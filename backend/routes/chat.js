const express = require('express');
const router = express.Router();
const { askGemini, buildMedicalContext } = require('../utils/gemini');
const { findRelevantKnowledge } = require('../utils/pdfKnowledge');

router.post('/', async (req, res) => {
  try {
    const { message, patient } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Nội dung tin nhắn không được để trống' });
    }

    // 1. Tìm kiến thức liên quan từ PDF
    const knowledge = findRelevantKnowledge(message);
    
    // 2. Build context
    let prompt = `Bạn là BioAI, trợ lý ảo chuyên nghiệp của Bệnh Viện Sinh Học Thông Minh.
    Nhiệm vụ của bạn là giải đáp thắc mắc về sinh học và sức khỏe cho người dùng một cách chính xác, thân thiện, đồng cảm và dễ hiểu.
    
    NGUYÊN TẮC QUAN TRỌNG:
    1. Ưu tiên sử dụng KIẾN THỨC SINH HỌC 11 (được cung cấp bên dưới) để trả lời.
    2. Nếu kiến thức cung cấp không đủ, bạn có quyền TỰ TỔNG HỢP KIẾN THỨC BÊN NGOÀI để trả lời linh hoạt, nhưng phải đảm bảo tính khoa học y khoa.
    3. Trả lời bằng định dạng Markdown để có giao diện đẹp (in đậm, danh sách...). Trả lời gãy gọn, không dài dòng.
    4. Cảnh báo người dùng đây chỉ là nền tảng tư vấn giáo dục, cần tham khảo ý kiến bác sĩ khi cần.\n\n`;

    if (patient) {
      prompt += `===== THÔNG TIN BỆNH NHÂN (Ngữ cảnh cá nhân) =====\n`;
      prompt += buildMedicalContext(patient) + `\n\n`;
    }

    if (knowledge && knowledge.text) {
      prompt += `===== KIẾN THỨC SINH HỌC 11 TỪ FILE (Chủ đề: ${knowledge.system}) =====\n`;
      // Trích xuất một phần text phù hợp (đã được giới hạn trong pdfKnowledge.js)
      prompt += `${knowledge.text}\n\n`;
    }

    prompt += `===== CÂU HỎI CỦA NGƯỜI DÙNG =====\n${message}\n\n`;
    prompt += `Hãy tư vấn chi tiết và khoa học.`;

    // 3. Gọi Gemini
    const reply = await askGemini(prompt);

    res.json({
      reply,
      source: knowledge ? knowledge.system : 'Tổng hợp bên ngoài'
    });

  } catch (error) {
    console.error('Lỗi khi chat:', error);
    res.status(500).json({ error: error.message || 'Lỗi hệ thống khi phân tích tin nhắn' });
  }
});

module.exports = router;

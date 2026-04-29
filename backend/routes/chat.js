const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const { buildMedicalContext } = require('../utils/gemini');
const { findRelevantKnowledge } = require('../utils/pdfKnowledge');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

router.post('/', async (req, res) => {
  try {
    const { message, patient, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Nội dung tin nhắn không được để trống' });
    }

    // 1. Tìm kiến thức PDF liên quan
    const knowledge = findRelevantKnowledge(message);

    // 2. Build system instruction
    let systemInstruction = `Bạn là BioAI, Chuyên gia Y tế & Sinh học của Bệnh Viện Sinh Học Thông Minh.
Nhiệm vụ: Phân tích triệu chứng và giải đáp thắc mắc theo tư duy Y khoa "Xếp chồng kiến thức" (Vĩ mô -> Vi mô -> Gốc rễ).

NGUYÊN TẮC TRẢ LỜI BẮT BUỘC (Luôn tuân theo 4 phần sau):
1. Tầng 1 - Lâm sàng (Sinh 11): Phân tích ở cấp độ hệ cơ quan (Tuần hoàn, Hô hấp, Thần kinh...). Giải thích cơ quan nào đang gặp vấn đề.
2. Tầng 2 - Cơ chế tế bào (Sinh 10): Bóc tách xuống nguyên nhân vi mô (hô hấp tế bào, ti thể, ATP, cân bằng nội môi, enzyme).
3. Tầng 3 - Gốc rễ Di truyền (Sinh 12): Nhấn mạnh các yếu tố rủi ro di truyền, đột biến gen, hoặc quy luật di truyền liên quan nếu có.
4. Lời khuyên Y khoa: Đề xuất thực đơn (Sinh 10), bài tập (Sinh 11), và tư vấn tầm soát/di truyền (Sinh 12).

YÊU CẦU ĐỊNH DẠNG:
- Dùng Markdown rõ ràng (tiêu đề ## cho từng tầng, in đậm, danh sách).
- Trả lời thân thiện, đồng cảm, chuyên nghiệp nhưng dễ hiểu cho học sinh THPT.
- Cuối câu trả lời, GỢI Ý 2-3 câu hỏi follow-up theo định dạng (nằm trên 1 dòng duy nhất):
  [FOLLOWUP]: câu 1 | câu 2 | câu 3
- Cảnh báo rõ AI chỉ mang tính giáo dục, cần tham khảo bác sĩ nếu nghiêm trọng.`;

    if (patient) {
      systemInstruction += `\n\n===== THÔNG TIN BỆNH NHÂN =====\n` + buildMedicalContext(patient);
    }

    if (knowledge && knowledge.text) {
      systemInstruction += `\n\n===== KIẾN THỨC SINH HỌC 11 (Chủ đề: ${knowledge.system}) =====\n${knowledge.text}`;
    }

    // 3. Build conversation history for multi-turn
    // history = [{ role: 'user'|'model', text: '...' }, ...]
    const chatHistory = history.slice(-8).map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    // 4. Start multi-turn chat with Gemini
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
      safetySettings,
      systemInstruction
    });

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const fullReply = result.response.text();

    // 5. Extract follow-up suggestions
    const followupMatch = fullReply.match(/\[FOLLOWUP\]:\s*(.+)/);
    let followups = [];
    let reply = fullReply;

    if (followupMatch) {
      followups = followupMatch[1].split('|').map(s => s.trim()).filter(Boolean).slice(0, 3);
      reply = fullReply.replace(/\[FOLLOWUP\]:\s*.+/, '').trim();
    }

    res.json({
      reply,
      followups,
      source: knowledge ? knowledge.system : 'Tổng hợp bên ngoài'
    });

  } catch (error) {
    console.error('Lỗi khi chat:', error);
    res.status(500).json({ error: error.message || 'Lỗi hệ thống' });
  }
});

module.exports = router;

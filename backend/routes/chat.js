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
    let systemInstruction = `Bạn là BioAI, trợ lý ảo chuyên nghiệp của Bệnh Viện Sinh Học Thông Minh.
Nhiệm vụ: Giải đáp thắc mắc về sinh học và sức khỏe một cách chính xác, thân thiện, đồng cảm.

NGUYÊN TẮC:
1. Ưu tiên KIẾN THỨC SINH HỌC 11 được cung cấp.
2. Dùng Markdown: in đậm, danh sách gạch đầu dòng, tiêu đề ##.
3. Trả lời ngắn gọn, súc tích. Không lặp lại câu hỏi.
4. Cuối câu trả lời: gợi ý 2-3 câu hỏi follow-up liên quan theo định dạng:
   [FOLLOWUP]: câu 1 | câu 2 | câu 3
5. Cảnh báo tham khảo bác sĩ khi triệu chứng nghiêm trọng.`;

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

const express = require('express');
const router = express.Router();
const { askGemini, buildMedicalContext } = require('../utils/gemini');

// POST /api/chat — Chatbot AI Assistant
router.post('/', async (req, res) => {
  try {
    const { message, history, patientData } = req.body;

    const systemCtx = patientData ? buildMedicalContext(patientData) : 'Bạn là AI trợ lý y tế giáo dục của Bệnh Viện Sinh Học Thông Minh.';
    
    // Xây dựng bối cảnh cho Gemini
    const chatPrompt = `${systemCtx}

Lịch sử trò chuyện:
${(history || []).map(h => `${h.role === 'user' ? 'Người dùng' : 'AI'}: ${h.content}`).join('\n')}

Người dùng hỏi: ${message}

Trả lời ngắn gọn, thân thiện, mang tính giáo dục sinh học và y tế. Nếu người dùng hỏi về kiến thức SGK 11, hãy giải thích dựa trên chương trình học.`;

    const reply = await askGemini(chatPrompt);
    res.json({ success: true, reply });

  } catch (error) {
    console.error('POST /api/chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { askGeminiJSON } = require('../utils/gemini');

// POST /api/quiz/generate — AI Gemini tạo câu hỏi quiz cho từng hệ cơ quan
router.post('/generate', async (req, res) => {
  try {
    const { system, organ } = req.body;

    if (!system) {
      return res.status(400).json({ error: 'Thiếu tên hệ cơ quan (system)' });
    }

    const prompt = `Bạn là giáo viên Sinh học 11. Hãy tạo 1 ca bệnh giả lập cho học sinh đóng vai bác sĩ chẩn đoán.

Hệ cơ quan: ${system}${organ ? `, Bộ phận: ${organ}` : ''}

Tạo JSON với cấu trúc sau:
{
  "caseTitle": "<Tiêu đề ca bệnh ngắn gọn, ví dụ: Bệnh nhân khó thở khi vận động>",
  "patientInfo": "<Mô tả ngắn bệnh nhân: tuổi, giới tính, triệu chứng chính, 2-3 câu>",
  "question": "<Câu hỏi chẩn đoán, ví dụ: Dựa trên triệu chứng, cơ quan nào bị ảnh hưởng chính?>",
  "options": [
    {"id": "A", "text": "<Đáp án A>"},
    {"id": "B", "text": "<Đáp án B>"},
    {"id": "C", "text": "<Đáp án C>"},
    {"id": "D", "text": "<Đáp án D>"}
  ],
  "correctAnswer": "<A hoặc B hoặc C hoặc D>",
  "explanation": "<Giải thích chi tiết 3-4 câu tại sao đáp án đúng, liên hệ kiến thức SGK Sinh 11>",
  "relatedKnowledge": {
    "biology10": "<1 khái niệm Sinh 10 liên quan>",
    "biology11": "<1 khái niệm Sinh 11 liên quan>",
    "biology12": "<1 khái niệm Sinh 12 liên quan>"
  }
}

Yêu cầu:
- Ca bệnh phải thực tế, dễ hiểu cho học sinh THPT
- Đáp án đúng phải chính xác theo kiến thức Sinh học 11
- Giải thích phải liên hệ cấu tạo và chức năng cơ quan
- Các đáp án sai phải hợp lý (không quá dễ loại)`;

    const quiz = await askGeminiJSON(prompt);

    // Tạo quiz ID duy nhất
    const quizId = `quiz_${system}_${organ || 'general'}_${Date.now().toString(36)}`;

    res.json({
      success: true,
      quizId,
      quiz
    });

  } catch (error) {
    console.error('POST /quiz/generate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/quiz/submit — Kiểm tra đáp án
router.post('/submit', async (req, res) => {
  try {
    const { quizId, selectedAnswer, correctAnswer } = req.body;

    const isCorrect = selectedAnswer === correctAnswer;
    let score = 0;
    if (isCorrect) score = 100;

    res.json({
      success: true,
      isCorrect,
      score,
      quizId
    });

  } catch (error) {
    console.error('POST /quiz/submit error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

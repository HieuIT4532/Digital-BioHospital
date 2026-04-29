const express = require('express');
const router = express.Router();
const { askGeminiJSON, buildMedicalContext } = require('../utils/gemini');

// POST /api/personalize/twin — Cập nhật Bản Sao Số
router.post('/twin', async (req, res) => {
  try {
    const { patientData, dailyHabits } = req.body;

    const systemCtx = patientData ? buildMedicalContext(patientData) : 'Bạn là AI trợ lý y tế giáo dục.';

    const prompt = `${systemCtx}

Thói quen sinh hoạt hôm nay của người dùng: ${dailyHabits.join(', ')}

Phân tích tác động của các thói quen này lên các cơ quan nội tạng dưới góc độ Sinh học (cơ chế tế bào - Sinh 10, và cân bằng nội môi - Sinh 11).
Trả về JSON cấu trúc sau (health là điểm sức khỏe 0-100, 100 là tốt nhất):
{
  "summary": "<tóm tắt 2-3 câu về tổng quan cơ thể hôm nay>",
  "organs": {
    "brain": { "health": <số>, "feedback": "<phân tích não bộ/thần kinh, 1-2 câu>" },
    "heart": { "health": <số>, "feedback": "<phân tích hệ tuần hoàn, 1-2 câu>" },
    "liver": { "health": <số>, "feedback": "<phân tích chức năng giải độc gan, 1-2 câu>" },
    "lungs": { "health": <số>, "feedback": "<phân tích hô hấp/oxy, 1-2 câu>" },
    "stomach": { "health": <số>, "feedback": "<phân tích tiêu hóa, 1-2 câu>" }
  },
  "recommendation": "<1 lời khuyên sinh hoạt cho ngày mai>"
}`;

    const result = await askGeminiJSON(prompt);
    res.json({ success: true, twinData: result });

  } catch (error) {
    console.error('POST /personalize/twin error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

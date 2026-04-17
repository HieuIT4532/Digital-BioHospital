const express = require('express');
const router = express.Router();
const { askGeminiJSON, buildMedicalContext } = require('../utils/gemini');

// POST /api/predict/future — AI dự đoán tương lai sức khỏe
router.post('/future', async (req, res) => {
  try {
    const { patientData, currentHabits, targetTimeframes } = req.body;

    const systemCtx = patientData ? buildMedicalContext(patientData) : 'Bạn là AI trợ lý y tế giáo dục.';
    const timeframes = targetTimeframes || ['30 ngày', '3 tháng', '1 năm'];

    const prompt = `${systemCtx}

Thói quen hiện tại của người dùng:
${currentHabits.map((h, i) => `${i + 1}. ${h}`).join('\n')}

Dựa vào dữ liệu sinh học và khoa học sức khỏe, hãy dự đoán xu hướng sức khỏe theo thời gian và trả về JSON:
{
  "currentStatus": {
    "summary": "<mô tả tình trạng hiện tại>",
    "score": <số 0-100>,
    "trend": <"Cải thiện" hoặc "Ổn định" hoặc "Suy giảm">
  },
  "predictions": [
    {
      "timeframe": "30 ngày",
      "healthScore": <số 0-100>,
      "keyChanges": ["<thay đổi dự kiến 1>", "<thay đổi 2>"],
      "risks": ["<nguy cơ mới 1>", "<nguy cơ 2>"],
      "affectedSystems": ["<hệ cơ quan bị ảnh hưởng>"],
      "description": "<mô tả chi tiết 2-3 câu>",
      "warningLevel": <"Xanh" hoặc "Vàng" hoặc "Cam" hoặc "Đỏ">
    },
    {
      "timeframe": "3 tháng",
      "healthScore": <số 0-100>,
      "keyChanges": ["<thay đổi dự kiến>"],
      "risks": ["<nguy cơ>"],
      "affectedSystems": ["<hệ cơ quan>"],
      "description": "<mô tả chi tiết>",
      "warningLevel": <"Xanh" hoặc "Vàng" hoặc "Cam" hoặc "Đỏ">
    },
    {
      "timeframe": "1 năm",
      "healthScore": <số 0-100>,
      "keyChanges": ["<thay đổi dự kiến>"],
      "risks": ["<nguy cơ>"],
      "affectedSystems": ["<hệ cơ quan>"],
      "description": "<mô tả chi tiết>",
      "warningLevel": <"Xanh" hoặc "Vàng" hoặc "Cam" hoặc "Đỏ">
    }
  ],
  "criticalWarnings": ["<cảnh báo quan trọng nhất>"],
  "ifChanged": {
    "description": "<nếu thay đổi thói quen thì sức khỏe sẽ thế nào>",
    "projectedScore1Year": <số 0-100>
  },
  "actionPlan": ["<hành động cần làm ngay 1>", "<hành động 2>", "<hành động 3>"]
}`;

    const result = await askGeminiJSON(prompt);
    res.json({ success: true, prediction: result });

  } catch (error) {
    console.error('POST /predict/future error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

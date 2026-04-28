const express = require('express');
const router = express.Router();
const { askGeminiJSON, buildMedicalContext } = require('../utils/gemini');

// POST /api/personalize/plan — AI tạo kế hoạch cá nhân hóa
router.post('/plan', async (req, res) => {
  try {
    const { patientData, goals } = req.body;

    const systemCtx = patientData ? buildMedicalContext(patientData) : 'Bạn là AI trợ lý y tế giáo dục.';

    const prompt = `${systemCtx}

Mục tiêu sức khỏe của người dùng: ${goals.join(', ')}

Tạo kế hoạch chăm sóc sức khỏe cá nhân hóa toàn diện cho 7 ngày và trả về JSON:
{
  "planTitle": "<tên kế hoạch cá nhân>",
  "planSummary": "<tóm tắt mục tiêu và phương pháp, 2-3 câu>",
  "weeklySchedule": [
    {
      "day": "Thứ 2",
      "morning": "<hoạt động buổi sáng cụ thể>",
      "noon": "<hoạt động trưa>",
      "evening": "<hoạt động tối>",
      "exercise": "<bài tập cụ thể + thời gian>",
      "focus": "<trọng tâm của ngày>"
    },
    { "day": "Thứ 3", "morning": "...", "noon": "...", "evening": "...", "exercise": "...", "focus": "..." },
    { "day": "Thứ 4", "morning": "...", "noon": "...", "evening": "...", "exercise": "...", "focus": "..." },
    { "day": "Thứ 5", "morning": "...", "noon": "...", "evening": "...", "exercise": "...", "focus": "..." },
    { "day": "Thứ 6", "morning": "...", "noon": "...", "evening": "...", "exercise": "...", "focus": "..." },
    { "day": "Thứ 7", "morning": "...", "noon": "...", "evening": "...", "exercise": "...", "focus": "..." },
    { "day": "Chủ nhật", "morning": "...", "noon": "...", "evening": "...", "exercise": "...", "focus": "..." }
  ],
  "nutritionPlan": {
    "breakfast": ["<bữa sáng gợi ý 1>", "<bữa sáng 2>"],
    "lunch": ["<bữa trưa gợi ý 1>", "<bữa trưa 2>"],
    "dinner": ["<bữa tối gợi ý 1>", "<bữa tối 2>"],
    "snacks": ["<snack lành mạnh 1>", "<snack 2>"],
    "avoidFoods": ["<thực phẩm cần tránh 1>", "<thực phẩm tránh 2>"],
    "waterIntake": "<lượng nước khuyến nghị/ngày>"
  },
  "sleepRoutine": {
    "bedtime": "<giờ đi ngủ đề xuất>",
    "wakeTime": "<giờ thức dậy>",
    "tips": ["<mẹo ngủ tốt 1>", "<mẹo 2>"]
  },
  "mentalWellness": ["<lời khuyên sức khỏe tâm thần 1>", "<lời khuyên 2>"],
  "progressMetrics": ["<chỉ số theo dõi 1>", "<chỉ số 2>", "<chỉ số 3>"],
  "expectedResults": "<kết quả dự kiến sau 7 ngày nếu thực hiện đúng>"
}`;

    const result = await askGeminiJSON(prompt);
    res.json({ success: true, plan: result });

  } catch (error) {
    console.error('POST /personalize/plan error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/personalize/twin — AI cập nhật Digital Twin
router.post('/twin', async (req, res) => {
  try {
    const { patientData, habits } = req.body;
    const { sleep, water, notes } = habits;

    const systemCtx = patientData ? buildMedicalContext(patientData) : 'Bạn là AI trợ lý y tế giáo dục STEM.';

    const prompt = `${systemCtx}

Báo cáo thói quen 24h qua của người dùng để cập nhật Digital Twin (Bản sao số):
- Giấc ngủ: ${sleep} tiếng
- Uống nước: ${water} lít
- Ghi chú thêm (ăn uống, hoạt động): ${notes}

Hãy phân tích mức độ tổn thương của 3 cơ quan: Não, Gan, Tim.
Đánh giá mức độ tổn thương từ 0 đến 100 bằng chỉ số sức khỏe còn lại (100 là hoàn hảo, trừ dần nếu thói quen xấu). 
Trích xuất một câu cảnh báo/phân tích DỰA VÀO KIẾN THỨC SINH HỌC 10 và 11 (Ví dụ: men gan, hô hấp tế bào, ti thể, thận lọc máu...).

Trả về dạng JSON đúng chuẩn:
{
  "heartHealth": <chỉ số sức khỏe tim còn lại, ví dủ 85>,
  "liverHealth": <chỉ số sức khỏe gan còn lại, ví dụ 70>,
  "brainHealth": <chỉ số sức khỏe não còn lại, ví dụ 90>,
  "aiAlert": "<giải thích tổn thương dưới góc độ Sinh học 10, 11, một đoạn văn 2-3 câu khắt khe, hàn lâm>"
}`;

    const result = await askGeminiJSON(prompt);
    res.json({ success: true, twinState: result });

  } catch (error) {
    console.error('POST /personalize/twin error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { askGeminiJSON, buildMedicalContext } = require('../utils/gemini');

// POST /api/patients — Tạo hồ sơ bệnh nhân mới + AI phân tích
router.post('/', async (req, res) => {
  try {
    const {
      name, age, gender, height, weight,
      sleepHours, exerciseDaysPerWeek,
      smokingStatus, alcoholStatus, stressLevel,
      medicalHistory
    } = req.body;

    // Tính BMI trước
    const hm = height / 100;
    const bmi = Math.round((weight / (hm * hm)) * 10) / 10;

    // Gọi AI phân tích sức khỏe
    const patientData = {
      name, age, gender, height, weight, bmi,
      bmiCategory: bmi < 18.5 ? 'Gầy' : bmi < 25 ? 'Bình thường' : bmi < 30 ? 'Thừa cân' : 'Béo phì',
      sleepHours, exerciseDaysPerWeek,
      smokingStatus: smokingStatus || 'Không hút',
      alcoholStatus: alcoholStatus || 'Không uống',
      stressLevel: stressLevel || 5,
      medicalHistory: medicalHistory || []
    };

    const systemCtx = buildMedicalContext(patientData);

    const aiResult = await askGeminiJSON(`${systemCtx}

Hãy phân tích sức khỏe toàn diện của bệnh nhân này và trả về JSON với cấu trúc sau:
{
  "healthScore": <số từ 0-100>,
  "riskLevel": <"Tốt" hoặc "Trung bình" hoặc "Nguy cơ">,
  "summary": "<tóm tắt 2-3 câu về tình trạng sức khỏe>",
  "strengths": ["<điểm mạnh 1>", "<điểm mạnh 2>"],
  "concerns": ["<vấn đề cần chú ý 1>", "<vấn đề cần chú ý 2>"],
  "recommendedDepartments": ["<khoa nên khám 1>", "<khoa nên khám 2>"],
  "immediateAdvice": "<lời khuyên ngay lập tức quan trọng nhất>"
}`);

    // Tính health score nếu AI không trả về hợp lệ
    let healthScore = aiResult.healthScore;
    if (!healthScore || healthScore < 0 || healthScore > 100) {
      healthScore = calculateLocalHealthScore(patientData);
    }

    // Lưu vào MongoDB
    const patient = new Patient({
      ...patientData,
      healthScore,
      riskLevel: aiResult.riskLevel || 'Trung bình',
      recommendedDepartments: aiResult.recommendedDepartments || [],
      aiSummary: aiResult.summary || ''
    });

    await patient.save();

    res.status(201).json({
      success: true,
      patient: patient.toObject(),
      aiAnalysis: aiResult
    });

  } catch (error) {
    console.error('POST /patients error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/patients/:id — Lấy hồ sơ bệnh nhân
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ bệnh nhân' });
    }
    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/patients/code/:code — Tìm bằng mã bệnh nhân
router.get('/code/:code', async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientCode: req.params.code.toUpperCase() });
    if (!patient) {
      return res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
    }
    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tính health score local (fallback)
function calculateLocalHealthScore(data) {
  let score = 70;

  // BMI
  if (data.bmi >= 18.5 && data.bmi < 25) score += 10;
  else if (data.bmi < 18.5 || (data.bmi >= 25 && data.bmi < 30)) score -= 5;
  else score -= 15;

  // Giấc ngủ
  if (data.sleepHours >= 7 && data.sleepHours <= 9) score += 10;
  else if (data.sleepHours >= 6) score += 0;
  else score -= 10;

  // Vận động
  if (data.exerciseDaysPerWeek >= 4) score += 10;
  else if (data.exerciseDaysPerWeek >= 2) score += 5;
  else score -= 5;

  // Hút thuốc
  if (data.smokingStatus === 'Hút nhiều') score -= 15;
  else if (data.smokingStatus === 'Hút ít') score -= 7;

  // Stress
  if (data.stressLevel >= 8) score -= 10;
  else if (data.stressLevel >= 6) score -= 5;

  return Math.max(0, Math.min(100, score));
}

module.exports = router;

const express = require('express');
const router = express.Router();
const { askGeminiJSON, buildMedicalContext } = require('../utils/gemini');

// POST /api/analyze/department — Phân tích chuyên khoa
router.post('/department', async (req, res) => {
  try {
    const { patientData, department, symptoms } = req.body;

    const departmentPrompts = {
      'Tim mạch': 'tim mạch, huyết áp, nhịp tim, mạch máu',
      'Hô hấp': 'phổi, đường thở, hô hấp, oxy',
      'Tai Mũi Họng': 'tai, mũi, họng, thanh quản',
      'Tiêu hóa': 'dạ dày, ruột, gan, mật, tiêu hóa',
      'Thần kinh': 'não, thần kinh, tâm lý, nhận thức',
      'Cơ xương khớp': 'xương, khớp, cơ, gân, dây chằng'
    };

    const systemCtx = patientData ? buildMedicalContext(patientData) : 'Bạn là AI trợ lý y tế giáo dục.';

    const prompt = `${systemCtx}

Chuyên khoa: ${department} — Lĩnh vực: ${departmentPrompts[department] || department}
Triệu chứng người dùng báo cáo: ${symptoms.join(', ')}

Phân tích triệu chứng và trả về ĐÚNG ĐỊNH DẠNG JSON sau để phục vụ tính năng "Gamification Trí tuệ" (Zoom-In 3 Tầng Kiến Thức Sinh Học):
{
  "level1_organ": {
    "grade": "Sinh học 11",
    "diagnosis": "<chẩn đoán sơ bộ ở cấp độ hệ cơ quan, 1-2 câu>",
    "explanation": "<giải thích cơ chế ở mức hệ cơ quan, cân bằng nội môi, 2-3 câu>",
    "affectedOrgans": ["<tên cơ quan tiếng Việt, VD: Não, Tim, Phổi, Dạ dày, Gan, Thận, Ruột>"],
    "riskLevel": "<Thấp/Trung bình/Cao>",
    "recommendations": ["<khuyến nghị 1>", "<khuyến nghị 2>"]
  },
  "level2_cell": {
    "grade": "Sinh học 10",
    "mechanism": "<giải thích sâu về cơ chế ở cấp độ tế bào, bào quan, hô hấp tế bào, phân giải chất, enzym... 2-3 câu>",
    "quiz_to_unlock": {
      "question": "<1 câu hỏi trắc nghiệm kiến thức Sinh 10 để kiểm tra người dùng, liên quan mật thiết đến cơ chế tế bào của bệnh này>",
      "options": ["<đáp án 1>", "<đáp án 2>", "<đáp án 3>", "<đáp án 4>"],
      "answer": "<đáp án đúng, phải khớp 100% với 1 trong 4 options trên>"
    }
  },
  "level3_genetics": {
    "grade": "Sinh học 12",
    "mechanism": "<giải thích nguyên nhân ở mức độ phân tử, di truyền, đột biến gene, biểu hiện gene hoặc yếu tố tiền sử gia đình của triệu chứng này, 2-3 câu>"
  }
}`;

    const result = await askGeminiJSON(prompt);
    res.json({ success: true, analysis: result });

  } catch (error) {
    console.error('POST /analyze/department error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/analyze/organs — Phân tích liên kết cơ quan
router.post('/organs', async (req, res) => {
  try {
    const { patientData, lifestyle } = req.body;

    const systemCtx = patientData ? buildMedicalContext(patientData) : 'Bạn là AI trợ lý y tế giáo dục.';

    const prompt = `${systemCtx}

Yếu tố lối sống hiện tại: ${lifestyle.join(', ')}

Phân tích chuỗi ảnh hưởng liên kết giữa các hệ cơ quan và trả về JSON:
{
  "summary": "<tóm tắt tổng quan 2-3 câu>",
  "chains": [
    {
      "trigger": "<nguyên nhân/yếu tố gốc>",
      "path": ["<cơ quan/hệ 1>", "<cơ quan/hệ 2>", "<cơ quan/hệ 3>"],
      "effects": ["<hậu quả 1>", "<hậu quả 2>", "<hậu quả 3>"],
      "severity": <"Nhẹ" hoặc "Trung bình" hoặc "Nặng">
    }
  ],
  "mostAffectedOrgans": [
    {
      "organ": "<tên cơ quan>",
      "impactLevel": <số 0-100>,
      "reason": "<lý do bị ảnh hưởng>"
    }
  ],
  "overallBodyStatus": "<mô tả tổng thể tình trạng cơ thể>",
  "topPriority": "<điều quan trọng nhất cần làm ngay>"
}`;

    const result = await askGeminiJSON(prompt);
    res.json({ success: true, analysis: result });

  } catch (error) {
    console.error('POST /analyze/organs error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

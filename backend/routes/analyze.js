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

Phân tích triệu chứng theo cơ chế "Zoom-in" (từ Vĩ mô đến Vi mô theo chương trình Sinh học SGK) và trả về JSON:
{
  "macro": {
    "diagnosis": "<Chẩn đoán sơ bộ ở cấp độ hệ cơ quan (sinh học 11), 1-2 câu>",
    "explanation": "<Giải thích vì sao xuất hiện triệu chứng ở cấp độ vĩ mô, dễ hiểu>",
    "affectedOrgans": ["<cơ quan 1>", "<cơ quan 2>"]
  },
  "micro": {
    "title": "<Tên bài học sinh 10 (ví dụ: Hô hấp tế bào, Cấu tạo màng...)>",
    "explanation": "<Phân tích chuyên sâu ở cấp độ tế bào: nguyên nhân sâu xa của triệu chứng (ATP, ti thể, enzym,...)>",
    "keywords": ["<từ khóa 1>", "<từ khóa 2>"]
  },
  "genetic": {
    "title": "<Tên kiến thức sinh 12 (ví dụ: Đột biến gen, Biểu hiện gen...)>",
    "explanation": "<Phân tích cấp độ phân tử/di truyền học: nguy cơ tiềm ẩn, liên kết biểu hiện kiểu hình>",
    "isInheritable": <true/false>
  },
  "riskLevel": "<Thấp/Trung bình/Cao/Rất cao>",
  "urgency": "<Không cần thiết/Nên khám/Khẩn cấp>",
  "lifestyle": "<1 lời khuyên thực tế>",
  "disclaimer": "Đây là phân tích giáo dục STEM, không thay thế chẩn đoán y tế chuyên nghiệp."
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

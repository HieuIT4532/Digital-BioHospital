const express = require('express');
const router = express.Router();
const { getSystemText } = require('../utils/pdfKnowledge');
const { askGeminiJSON } = require('../utils/gemini');

// ── Organ map (static, instant) ───────────────────────────────────────────────
const ORGAN_MAP = {
  'circulation': {
    systemKey: 'tuần hoàn',
    label: '❤️ Hệ Tuần Hoàn',
    organs: [
      { id: 'tim',         icon: '❤️',  name: 'Tim',               desc: 'Bơm máu tuần hoàn khắp cơ thể' },
      { id: 'dong-mach',   icon: '🩸',  name: 'Động Mạch',         desc: 'Mang máu giàu O₂ rời tim' },
      { id: 'tinh-mach',   icon: '💜',  name: 'Tĩnh Mạch',         desc: 'Đưa máu nghèo O₂ về tim' },
      { id: 'mao-mach',    icon: '🔬',  name: 'Mao Mạch',          desc: 'Trao đổi chất với tế bào' },
      { id: 'hong-cau',    icon: '🔴',  name: 'Máu & Hồng Cầu',    desc: 'Vận chuyển O₂ nhờ hemoglobin' },
    ]
  },
  'respiratory': {
    systemKey: 'hô hấp',
    label: '🫁 Hệ Hô Hấp',
    organs: [
      { id: 'mui-hong',    icon: '👃',  name: 'Mũi & Họng',        desc: 'Lọc, làm ấm và ẩm không khí' },
      { id: 'khi-quan',    icon: '🌬️', name: 'Khí Quản & Phế Quản', desc: 'Đường dẫn khí vào phổi' },
      { id: 'phoi',        icon: '🫁',  name: 'Phổi & Phế Nang',   desc: '70m² diện tích trao đổi khí' },
      { id: 'co-hoành',    icon: '💪',  name: 'Cơ Hoành',          desc: 'Cơ chính kiểm soát hít thở' },
    ]
  },
  'nervous': {
    systemKey: 'thần kinh',
    label: '🧠 Hệ Thần Kinh',
    organs: [
      { id: 'nao-bo',      icon: '🧠',  name: 'Não Bộ',            desc: 'Trung khu xử lý và điều khiển' },
      { id: 'tuy-song',    icon: '🦴',  name: 'Tủy Sống',          desc: 'Truyền tín hiệu, phản xạ tủy' },
      { id: 'neuron',      icon: '⚡',  name: 'Neuron',             desc: 'Đơn vị cơ bản của hệ thần kinh' },
      { id: 'synapse',     icon: '🔗',  name: 'Synapse',            desc: 'Khớp thần kinh – nơi truyền tín hiệu' },
      { id: 'tk-tu-chu',   icon: '🔄',  name: 'Hệ TK Tự Chủ',     desc: 'Giao cảm & phó giao cảm' },
    ]
  },
  'immune': {
    systemKey: 'miễn dịch',
    label: '🛡️ Hệ Miễn Dịch',
    organs: [
      { id: 'te-bao-b',    icon: '💉',  name: 'Tế Bào B & Kháng Thể', desc: 'Sản xuất immunoglobulin đặc hiệu' },
      { id: 'te-bao-t',    icon: '🧬',  name: 'Tế Bào T (CD4/CD8)',   desc: 'Điều phối và tiêu diệt tế bào nhiễm' },
      { id: 'nk-cells',    icon: '🔫',  name: 'NK Cells',             desc: 'Tiêu diệt ung thư & virus tự nhiên' },
      { id: 'dai-thuc-bao',icon: '👾',  name: 'Đại Thực Bào',         desc: 'Nuốt và tiêu diệt mầm bệnh' },
      { id: 'hach-lympho', icon: '🫘',  name: 'Hạch Lympho',          desc: 'Lọc bạch huyết, tập kết lympho' },
    ]
  },
  'homeostasis': {
    systemKey: 'nội môi',
    label: '⚖️ Cân Bằng Nội Môi',
    organs: [
      { id: 'than',        icon: '🫘',  name: 'Thận',              desc: 'Lọc máu, điều hòa nước & điện giải' },
      { id: 'tuyen-tuy',   icon: '🍬',  name: 'Tuyến Tụy',         desc: 'Insulin & Glucagon điều hòa đường huyết' },
      { id: 'tuyen-yen',   icon: '🧪',  name: 'Tuyến Yên',         desc: 'ADH và nhiều hormone điều hòa' },
      { id: 'gan',         icon: '🟫',  name: 'Gan',               desc: 'Kho glycogen, ổn định glucose máu' },
      { id: 'da',          icon: '🌡️', name: 'Da (Thân Nhiệt)',    desc: 'Đổ mồ hôi & co mạch điều nhiệt' },
    ]
  },
  'digestive': {
    systemKey: 'tiêu hóa',
    label: '🍽️ Hệ Tiêu Hóa',
    organs: [
      { id: 'mieng',       icon: '👄',  name: 'Miệng & Amylase',   desc: 'Nhai cơ học + amylase phân giải tinh bột' },
      { id: 'da-day',      icon: '🫙',  name: 'Dạ Dày',            desc: 'HCl + Pepsin phân giải protein' },
      { id: 'ruot-non',    icon: '🌀',  name: 'Ruột Non',          desc: 'Dài 6m – hấp thu glucose, amino acid' },
      { id: 'gan-mat',     icon: '🟡',  name: 'Gan & Túi Mật',     desc: 'Mật nhũ hóa lipid' },
      { id: 'tuy',         icon: '🧫',  name: 'Tụy (Ngoại tiết)', desc: 'Lipase, Protease, Amylase' },
      { id: 'ruot-gia',    icon: '🦠',  name: 'Ruột Già',          desc: 'Hấp thu nước, vi khuẩn đường ruột' },
    ]
  },
  'genetics': {
    systemKey: 'di truyền',
    label: '🧬 Di Truyền Học',
    organs: [
      { id: 'nst',         icon: '🧬',  name: 'Nhiễm Sắc Thể',     desc: 'Cấu trúc mang gen, ADN & Histon' },
      { id: 'dot-bien',    icon: '⚠️',  name: 'Đột Biến Gen',      desc: 'Thay đổi trình tự Nucleotide' },
      { id: 'benh-di-truyen', icon: '🏥', name: 'Bệnh Di Truyền',   desc: 'Hội chứng Down, Patau, Siêu nữ' },
      { id: 'ung-thu',     icon: '🦠',  name: 'Cơ Chế Ung Thư',    desc: 'Mất kiểm soát phân bào & p53' },
      { id: 'he-gen-nguoi', icon: '🗺️',  name: 'Hệ Gen Người',      desc: '3.200 Mb và 20.500 gen mã hóa' },
    ]
  },
  'cell': {
    systemKey: 'tế bào',
    label: '🧪 Sinh Học Tế Bào',
    organs: [
      { id: 'chu-ky-tb',   icon: '🔄',  name: 'Chu Kỳ Tế Bào',     desc: 'Kỳ trung gian & Nguyên phân' },
      { id: 'apoptosis',   icon: '💀',  name: 'Chết Chương Trình', desc: 'Cơ chế tự hủy của tế bào lỗi' },
      { id: 'ho-hap-tb',   icon: '🔋',  name: 'Hô Hấp Tế Bào',     desc: 'Đường phân, Krebs & Chuỗi chuyền e' },
      { id: 'ti-the',      icon: '⚡',  name: 'Ti Thể',            desc: 'Nhà máy năng lượng ATP' },
      { id: 'cong-nghe-tb', icon: '💉',  name: 'Công Nghệ Tế Bào',  desc: 'Nuôi cấy tế bào gốc & mô' },
    ]
  },
  'evolution': {
    systemKey: 'tiến hóa',
    label: '🐒 Tiến Hóa Người',
    organs: [
      { id: 'linh-truong', icon: '🦧',  name: 'Nguồn Gốc',         desc: 'Mối quan hệ người & tinh tinh' },
      { id: 'nst-dung-hop', icon: '🧩',  name: 'Dung Hợp NST',      desc: 'Sự kiện n=23 ở người hiện đại' },
      { id: 'gen-ngon-ngu', icon: '🗣️',  name: 'Gen Ngôn Ngữ',      desc: 'Sự tiến hóa của gen FOXP2' },
      { id: 'chon-loc',    icon: '⚖️',  name: 'Chọn Lọc Tự Nhiên', desc: 'Cơ chế hình thành loài người' },
    ]
  },
};

// ── RAM Cache ─────────────────────────────────────────────────────────────────
// Structure: { [systemId]: { [organId]: { tabs: [...], cachedAt: Date } } }
const libraryCache = {};

// ── GET /api/library/:system ──────────────────────────────────────────────────
// Returns the list of organs for a system (static, instant)
router.get('/:system', (req, res) => {
  const { system } = req.params;
  const data = ORGAN_MAP[system];
  if (!data) {
    return res.status(404).json({ error: `Không tìm thấy hệ: ${system}` });
  }
  res.json({ systemId: system, label: data.label, organs: data.organs });
});

// ── GET /api/library/:system/:organ ──────────────────────────────────────────
// Returns AI-generated 5-tab detail for a specific organ
router.get('/:system/:organ', async (req, res) => {
  const { system, organ } = req.params;
  const systemData = ORGAN_MAP[system];
  if (!systemData) {
    return res.status(404).json({ error: `Không tìm thấy hệ: ${system}` });
  }

  const organInfo = systemData.organs.find(o => o.id === organ);
  if (!organInfo) {
    return res.status(404).json({ error: `Không tìm thấy bộ phận: ${organ}` });
  }

  // Check RAM cache
  if (libraryCache[system]?.[organ]) {
    console.log(`📦 Cache hit: ${system}/${organ}`);
    return res.json({ ...libraryCache[system][organ], cached: true });
  }

  // Get PDF text for this system
  const pdfText = getSystemText(systemData.systemKey);
  const contextBlock = pdfText
    ? `Dưới đây là nội dung sách giáo khoa Sinh học 11 về ${systemData.label}:\n\n${pdfText.slice(0, 8000)}`
    : `Không có dữ liệu PDF. Hãy dùng kiến thức Sinh học 11 chuẩn.`;

  const prompt = `${contextBlock}

Hãy viết tài liệu học tập chi tiết cho bộ phận sau trong ${systemData.label}: **${organInfo.name}** (${organInfo.desc}).

Trả về JSON với đúng cấu trúc sau (KHÔNG dùng markdown code fence, chỉ JSON thuần):
{
  "organId": "${organ}",
  "organName": "${organInfo.name}",
  "organIcon": "${organInfo.icon}",
  "systemId": "${system}",
  "systemLabel": "${systemData.label}",
  "tabs": [
    {
      "label": "Khái Niệm",
      "html": "<h4>🔬 Khái Niệm</h4><p>...</p>"
    },
    {
      "label": "Cấu Tạo Chi Tiết",
      "html": "<h4>🧬 Cấu Tạo Chi Tiết</h4><ul><li>...</li></ul>"
    },
    {
      "label": "Chức Năng",
      "html": "<h4>⚡ Chức Năng</h4><ul><li>...</li></ul>"
    },
    {
      "label": "SGK Sinh 11",
      "html": "<div class=\\"sgk-box\\"><div class=\\"sgk-box-title\\">📖 Kiến Thức SGK Sinh 11</div><p>...</p></div>"
    },
    {
      "label": "Liên Hệ Thực Tế",
      "html": "<div class=\\"reallife-box\\"><div class=\\"reallife-box-title\\">🌍 Liên Hệ Thực Tế</div><p>...</p></div><ul><li>...</li></ul>"
    }
  ]
}

Yêu cầu:
- Mỗi tab phải có nội dung phong phú, ít nhất 3–5 điểm hoặc 200 từ
- Dùng thẻ HTML theo mẫu (h4, p, ul>li)
- Viết bằng tiếng Việt, ngắn gọn súc tích, chuẩn SGK 11
- Phần SGK: trích dẫn kiến thức, số liệu, định nghĩa chuẩn trong sách
- Phần Liên Hệ: ví dụ thực tế thú vị, bệnh lý liên quan, lời khuyên sức khỏe`;

  try {
    console.log(`🤖 AI generating: ${system}/${organ} ...`);
    const data = await askGeminiJSON(prompt);

    // Store in RAM cache
    if (!libraryCache[system]) libraryCache[system] = {};
    libraryCache[system][organ] = { ...data, cached: false, cachedAt: new Date().toISOString() };

    res.json({ ...data, cached: false });
  } catch (err) {
    console.error('Library AI error:', err);
    res.status(500).json({ error: `Lỗi AI: ${err.message}` });
  }
});

module.exports = router;

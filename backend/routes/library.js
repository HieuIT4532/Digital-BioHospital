const express = require('express');
const router = express.Router();

// Mock database for library content
const libraryData = {
  'circulation': {
    title: 'Hệ Tuần Hoàn',
    icon: '🩸',
    excerpt: 'Tim, mạch máu và hành trình của máu trong cơ thể.',
    content: `<h4>🔬 Tổng Quan</h4><p>Hệ tuần hoàn là mạng lưới giao thông của cơ thể...</p>`
  },
  'respiratory': {
    title: 'Hệ Hô Hấp',
    icon: '🫁',
    excerpt: 'Cơ chế trao đổi O₂-CO₂, vai trò của phổi.',
    content: `<h4>🔬 Cơ Chế</h4><p>Tại phổi, O₂ từ không khí khuếch tán vào máu...</p>`
  },
  'digestive': {
    title: 'Hệ Tiêu Hóa',
    icon: '🟡',
    excerpt: 'Quá trình biến đổi thức ăn thành năng lượng.',
    content: `<h4>🔬 Tiêu Hóa</h4><p>Thức ăn được nghiền nát và phân giải bởi acid dạ dày...</p>`
  }
};

// GET /api/library/:category — Lấy thông tin bài viết
router.get('/:category', (req, res) => {
  const { category } = req.params;
  const article = libraryData[category];
  
  if (article) {
    res.json({ success: true, article });
  } else {
    res.status(404).json({ success: false, error: 'Không tìm thấy bài viết' });
  }
});

// GET /api/library — Lấy danh sách tất cả bài viết
router.get('/', (req, res) => {
  res.json({ success: true, articles: libraryData });
});

module.exports = router;

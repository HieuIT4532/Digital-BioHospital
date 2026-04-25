require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy cho Render (load balancer) để rate limit hoạt động đúng
app.set('trust proxy', 1);

// ── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100,
  message: { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' }
});
app.use('/api/', limiter);

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => o && origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error('Không được phép bởi CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// No database connection needed

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/patients', require('./routes/patients'));
app.use('/api/analyze', require('./routes/analyze'));
app.use('/api/predict', require('./routes/predict'));
app.use('/api/personalize', require('./routes/personalize'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/library', require('./routes/library'));


// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Bệnh Viện Sinh Học Thông Minh API đang hoạt động',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Bệnh Viện Sinh Học Thông Minh – API',
    version: '1.0.0',
    endpoints: ['/api/patients', '/api/analyze', '/api/predict', '/api/personalize', '/api/chat', '/api/library']

  });
});

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Lỗi máy chủ nội bộ',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🏥 Server đang chạy tại port ${PORT}`);
});

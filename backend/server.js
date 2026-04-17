require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy cho Render (load balancer)
app.set('trust proxy', 1);

// ── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts in HTML pages
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' }
});
app.use('/api/', limiter);

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'null' // allow file:// origin
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === 'null' || allowedOrigins.some(o => o && origin.startsWith(o))) {
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

// ── Serve Frontend Static Files ───────────────────────────────────────────────
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/patients',   require('./routes/patients'));
app.use('/api/analyze',    require('./routes/analyze'));
app.use('/api/predict',    require('./routes/predict'));
app.use('/api/personalize',require('./routes/personalize'));
app.use('/api/chat',       require('./routes/chat')); // New chat route

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Bệnh Viện Sinh Học Thông Minh API đang hoạt động',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// ── SPA Fallback ───────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Lỗi máy chủ nội bộ',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const { loadAllPDFs } = require('./utils/pdfKnowledge');

app.listen(PORT, async () => {
  console.log(`🏥 BioHospital Server: http://localhost:${PORT}`);
  console.log(`📁 Frontend:  http://localhost:${PORT}/index.html`);
  console.log(`🤖 Chatbot:   http://localhost:${PORT}/chatbot.html`);
  console.log(`📚 Library:   http://localhost:${PORT}/library.html`);
  console.log(`🔬 Analysis:  http://localhost:${PORT}/analysis.html`);
  
  // Load PDF knowledge base
  await loadAllPDFs();
});

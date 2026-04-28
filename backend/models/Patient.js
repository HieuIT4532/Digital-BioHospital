const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  // ── Thông tin cơ bản ───────────────────────────────────────────────────────
  name: {
    type: String,
    required: [true, 'Họ tên là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên không quá 100 ký tự']
  },
  age: {
    type: Number,
    required: [true, 'Tuổi là bắt buộc'],
    min: [1, 'Tuổi tối thiểu là 1'],
    max: [120, 'Tuổi tối đa là 120']
  },
  gender: {
    type: String,
    enum: ['Nam', 'Nữ', 'Khác'],
    required: true
  },

  // ── Chỉ số cơ thể ─────────────────────────────────────────────────────────
  height: {
    type: Number, // cm
    required: true,
    min: 50,
    max: 250
  },
  weight: {
    type: Number, // kg
    required: true,
    min: 10,
    max: 300
  },

  // ── Lối sống ──────────────────────────────────────────────────────────────
  sleepHours: {
    type: Number, // giờ/đêm
    min: 0,
    max: 24,
    default: 7
  },
  exerciseDaysPerWeek: {
    type: Number,
    min: 0,
    max: 7,
    default: 0
  },
  smokingStatus: {
    type: String,
    enum: ['Không hút', 'Đã bỏ', 'Hút ít', 'Hút nhiều'],
    default: 'Không hút'
  },
  alcoholStatus: {
    type: String,
    enum: ['Không uống', 'Hiếm khi', 'Thỉnh thoảng', 'Thường xuyên'],
    default: 'Không uống'
  },
  stressLevel: {
    type: Number, // 1–10
    min: 1,
    max: 10,
    default: 5
  },

  // ── Tiền sử bệnh ─────────────────────────────────────────────────────────
  medicalHistory: {
    type: [String],
    default: []
    // Ví dụ: ['Tiểu đường', 'Tim mạch', 'Cao huyết áp']
  },

  // ── Kết quả AI ────────────────────────────────────────────────────────────
  bmi: {
    type: Number
  },
  bmiCategory: {
    type: String,
    enum: ['Gầy', 'Bình thường', 'Thừa cân', 'Béo phì', '']
  },
  healthScore: {
    type: Number,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['Tốt', 'Trung bình', 'Nguy cơ', ''],
    default: ''
  },
  recommendedDepartments: {
    type: [String],
    default: []
  },
  aiSummary: {
    type: String,
    default: ''
  },

  // ── Metadata ──────────────────────────────────────────────────────────────
  patientCode: {
    type: String,
    unique: true,
    default: () => 'BN' + Date.now().toString(36).toUpperCase()
  }
}, {
  timestamps: true,
  versionKey: false
});

// ── Virtual: BMI tính tự động ─────────────────────────────────────────────
patientSchema.pre('save', function (next) {
  if (this.height && this.weight) {
    const hm = this.height / 100;
    this.bmi = Math.round((this.weight / (hm * hm)) * 10) / 10;

    if (this.bmi < 18.5) this.bmiCategory = 'Gầy';
    else if (this.bmi < 25) this.bmiCategory = 'Bình thường';
    else if (this.bmi < 30) this.bmiCategory = 'Thừa cân';
    else this.bmiCategory = 'Béo phì';
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);

/* ═══════════════════════════════════════════════════════════════════════════
   API.JS — Frontend API Client
   Giao tiếp với backend Render
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Cấu hình API ──────────────────────────────────────────────────────────
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://digital-biohospital.onrender.com'; // URL Render thật

// ── Helper: Fetch với error handling ─────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  const response = await fetch(url, defaultOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Lỗi ${response.status}: ${response.statusText}`);
  }

  return data;
}

// ════════════════════════════════════════════════════════════════════════════
// PATIENTS API
// ════════════════════════════════════════════════════════════════════════════

const PatientsAPI = {
  /**
   * Tạo hồ sơ bệnh nhân mới + AI phân tích
   * @param {Object} patientFormData
   * @returns {Promise<{patient, aiAnalysis}>}
   */
  async create(patientFormData) {
    return apiFetch('/api/patients', {
      method: 'POST',
      body: JSON.stringify(patientFormData)
    });
  },

  /**
   * Lấy hồ sơ bệnh nhân theo ID
   */
  async getById(id) {
    return apiFetch(`/api/patients/${id}`);
  },

  /**
   * Tìm bệnh nhân theo mã (VD: BN1234ABC)
   */
  async getByCode(code) {
    return apiFetch(`/api/patients/code/${code}`);
  }
};

// ════════════════════════════════════════════════════════════════════════════
// ANALYZE API
// ════════════════════════════════════════════════════════════════════════════

const AnalyzeAPI = {
  /**
   * Phân tích triệu chứng theo chuyên khoa
   * @param {Object} patientData - Thông tin bệnh nhân (optional)
   * @param {string} department - Tên chuyên khoa
   * @param {string[]} symptoms - Danh sách triệu chứng
   */
  async byDepartment(patientData, department, symptoms) {
    return apiFetch('/api/analyze/department', {
      method: 'POST',
      body: JSON.stringify({ patientData, department, symptoms })
    });
  },

  /**
   * Phân tích liên kết cơ quan
   * @param {Object} patientData
   * @param {string[]} lifestyle - Các yếu tố lối sống xấu
   */
  async organs(patientData, lifestyle) {
    return apiFetch('/api/analyze/organs', {
      method: 'POST',
      body: JSON.stringify({ patientData, lifestyle })
    });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// PREDICT API
// ════════════════════════════════════════════════════════════════════════════

const PredictAPI = {
  /**
   * Dự đoán tương lai sức khỏe
   * @param {Object} patientData
   * @param {string[]} currentHabits
   */
  async future(patientData, currentHabits) {
    return apiFetch('/api/predict/future', {
      method: 'POST',
      body: JSON.stringify({ patientData, currentHabits })
    });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// PERSONALIZE API
// ════════════════════════════════════════════════════════════════════════════

const PersonalizeAPI = {
  /**
   * Tạo kế hoạch 7 ngày cá nhân hóa
   * @param {Object} patientData
   * @param {string[]} goals - Mục tiêu sức khoẻ
   */
  async plan(patientData, goals) {
    return apiFetch('/api/personalize/plan', {
      method: 'POST',
      body: JSON.stringify({ patientData, goals })
    });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// UPTIME / HEALTH CHECK
// ════════════════════════════════════════════════════════════════════════════

async function checkAPIHealth() {
  try {
    const data = await apiFetch('/health');
    console.log('✅ API Online:', data.message);
    return true;
  } catch (e) {
    console.warn('⚠️ API Offline — chạy ở chế độ offline');
    return false;
  }
}

// Export để dùng trong các trang
window.API = {
  Patients: PatientsAPI,
  Analyze: AnalyzeAPI,
  Predict: PredictAPI,
  Personalize: PersonalizeAPI,
  checkHealth: checkAPIHealth
};

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
  
  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(`Phản hồi từ server không phải JSON (Status ${response.status}). Có thể server đang gặp lỗi hoặc endpoint không tồn tại.`);
  }

  if (!response.ok) {
    throw new Error(data?.error || `Lỗi ${response.status}: ${response.statusText}`);
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
   * Cập nhật Bản Sao Số (Digital Twin)
   * @param {Object} patientData
   * @param {string[]} dailyHabits
   */
  async updateTwin(patientData, dailyHabits) {
    return apiFetch('/api/personalize/twin', {
      method: 'POST',
      body: JSON.stringify({ patientData, dailyHabits })
    });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// CHAT API
// ════════════════════════════════════════════════════════════════════════════

const ChatAPI = {
  /**
   * Nhắn tin với AI, lấy thông tin từ PDF hoặc kiến thức ngoài
   * @param {Object} patientData
   * @param {string} message
   */
  async send(patientData, message, history = []) {
    return apiFetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ patient: patientData, message, history })
    });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// LIBRARY API
// ════════════════════════════════════════════════════════════════════════════

const LibraryAPI = {
  /**
   * Lấy danh sách bộ phận của một hệ
   */
  async getSystem(systemId) {
    return apiFetch(`/api/library/${systemId}`);
  },

  /**
   * Lấy chi tiết bộ phận (AI)
   */
  async getOrgan(systemId, organId) {
    return apiFetch(`/api/library/${systemId}/${organId}`);
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
  Chat: ChatAPI,
  Library: LibraryAPI,
  checkHealth: checkAPIHealth,
  baseUrl: API_BASE
};

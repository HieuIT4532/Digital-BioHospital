/* ═══════════════════════════════════════════════════════════════════════════
   PATIENT.JS — Quản lý hồ sơ bệnh nhân
   localStorage + Session Management
   ═══════════════════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'bioai_patient';
const HISTORY_KEY = 'bioai_patient_history';

const PatientManager = {
  /**
   * Lưu hồ sơ hiện tại vào localStorage
   */
  save(patient) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patient));
    // Thêm vào lịch sử
    const history = this.getHistory();
    const exists = history.findIndex(p => p._id === patient._id);
    if (exists >= 0) history[exists] = patient;
    else history.unshift(patient);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 5))); // Giữ 5 gần nhất
  },

  /**
   * Lấy hồ sơ hiện tại
   */
  get() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  /**
   * Xóa hồ sơ hiện tại
   */
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Lấy danh sách lịch sử
   */
  getHistory() {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  /**
   * Cập nhật thông tin bệnh nhân
   */
  update(updates) {
    const current = this.get();
    if (current) {
      const updated = { ...current, ...updates };
      this.save(updated);
      return updated;
    }
    return null;
  },

  /**
   * Kiểm tra có hồ sơ chưa
   */
  exists() {
    return !!this.get();
  }
};

// ── Cập nhật navbar khi có hồ sơ ─────────────────────────────────────────
function updateNavbarPatientStatus() {
  const patient = PatientManager.get();
  const indicator = document.getElementById('patient-nav-indicator');
  const btn = document.getElementById('btn-start-exam');

  if (patient && indicator) {
    indicator.style.display = 'flex';
    const nameEl = indicator.querySelector('.patient-name');
    if (nameEl) nameEl.textContent = patient.name;

    const scoreEl = indicator.querySelector('.patient-score');
    if (scoreEl) scoreEl.textContent = patient.healthScore;
  }

  if (patient && btn) {
    btn.textContent = '📋 Xem hồ sơ';
    btn.href = 'reception.html';
  }
}

// ── Toast Notifications ───────────────────────────────────────────────────
function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Loading State ─────────────────────────────────────────────────────────
function showLoading(message = 'AI đang phân tích...', sub = 'Vui lòng chờ một chút') {
  let overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="ai-loader">
        <div class="ai-loader-ring"></div>
        <div class="ai-loader-ring"></div>
        <div class="ai-loader-ring"></div>
      </div>
      <div class="loading-text">${message}</div>
      <div class="loading-subtext">${sub}</div>
    `;
    document.body.appendChild(overlay);
  } else {
    overlay.querySelector('.loading-text').textContent = message;
    overlay.querySelector('.loading-subtext').textContent = sub;
  }
  overlay.classList.add('active');
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.classList.remove('active');
}

// ── Scroll Reveal ──────────────────────────────────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  elements.forEach(el => observer.observe(el));
}

// ── Health Score Animation ────────────────────────────────────────────────
function animateHealthScore(score, elementId = 'health-score-ring') {
  const scoreNumber = document.querySelector(`#${elementId} .score-number`);
  if (!scoreNumber) return;

  const duration = 1500;
  const start = performance.now();

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * score);

    scoreNumber.textContent = current;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);

  // Animate SVG circle
  const circle = document.querySelector(`#${elementId} .score-circle`);
  if (circle) {
    const circumference = 2 * Math.PI * 54; // r=54
    const dashOffset = circumference - (score / 100) * circumference;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    setTimeout(() => {
      circle.style.transition = 'stroke-dashoffset 1.5s ease';
      circle.style.strokeDashoffset = dashOffset;
    }, 100);

    // Color based on score
    if (score >= 75) circle.style.stroke = '#10B981';
    else if (score >= 50) circle.style.stroke = '#F59E0B';
    else circle.style.stroke = '#EF4444';
  }
}

// ── Ripple Effect for Buttons ─────────────────────────────────────────────
function addRippleEffect() {
  document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height);

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${x - size/2}px; top: ${y - size/2}px;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ── Format Utilities ──────────────────────────────────────────────────────
const Format = {
  bmi(bmi) {
    if (bmi < 18.5) return { value: bmi, label: 'Gầy', color: 'blue' };
    if (bmi < 25)   return { value: bmi, label: 'Bình thường', color: 'green' };
    if (bmi < 30)   return { value: bmi, label: 'Thừa cân', color: 'yellow' };
    return { value: bmi, label: 'Béo phì', color: 'red' };
  },

  riskBadgeClass(level) {
    const map = {
      'Tốt': 'badge-green',
      'Thấp': 'badge-green',
      'Trung bình': 'badge-yellow',
      'Cao': 'badge-red',
      'Rất cao': 'badge-red',
      'Nguy cơ': 'badge-red'
    };
    return map[level] || 'badge-purple';
  },

  warningColor(level) {
    const map = {
      'Xanh': '#10B981',
      'Vàng': '#F59E0B',
      'Cam': '#F97316',
      'Đỏ': '#EF4444'
    };
    return map[level] || '#A78BFA';
  },

  date(d) {
    return new Date(d).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }
};

// ── Init on DOM ready ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateNavbarPatientStatus();
  initScrollReveal();
  addRippleEffect();
});

// Export
window.PatientManager = PatientManager;
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.animateHealthScore = animateHealthScore;
window.Format = Format;

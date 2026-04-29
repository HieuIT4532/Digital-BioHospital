import { BioDB } from './firebase-config.js';

window.BioAuth = {
  currentUser: null,
  currentDoc: null,

  async init() {
    BioDB.onAuthStateChanged(async (user) => {
      this.currentUser = user;
      
      const loginBtn = document.getElementById('nav-login-btn');
      const profileBtn = document.getElementById('nav-profile-btn');
      const expBadge = document.getElementById('nav-exp-badge');

      if (user) {
        // Lấy document
        this.currentDoc = await BioDB.getUserDoc(user.uid);
        
        // Cập nhật giao diện Navbar
        if (loginBtn) loginBtn.style.display = 'none';
        if (profileBtn) {
          profileBtn.style.display = 'inline-flex';
          const rank = BioDB.getRankFromEXP(this.currentDoc?.exp || 0);
          profileBtn.innerHTML = `${rank.icon} ${user.displayName}`;
        }
        // Hiển thị EXP badge
        if (expBadge) {
          const exp = this.currentDoc?.exp || 0;
          const rank = BioDB.getRankFromEXP(exp);
          expBadge.style.display = 'inline-flex';
          expBadge.innerHTML = `⚡ ${exp} EXP`;
          expBadge.title = rank.name;
        }

        // Cập nhật check-in widget nếu có
        this.updateCheckInWidget();
      } else {
        this.currentDoc = null;
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (profileBtn) profileBtn.style.display = 'none';
        if (expBadge) expBadge.style.display = 'none';
      }
    });

    this.attachEvents();
  },

  attachEvents() {
    const loginBtn = document.getElementById('nav-login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await BioDB.signInWithGoogle();
          window.location.reload();
        } catch (error) {
          console.error('Lỗi đăng nhập:', error);
          alert('Không thể đăng nhập. Vui lòng thử lại.');
        }
      });
    }

    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await BioDB.signOut();
        window.location.replace('index.html');
      });
    }

    // Check-in button
    const checkInBtn = document.getElementById('checkin-btn');
    if (checkInBtn) {
      checkInBtn.addEventListener('click', async () => {
        if (!this.currentUser) {
          alert('Vui lòng đăng nhập để check-in!');
          return;
        }
        checkInBtn.disabled = true;
        checkInBtn.textContent = '⏳ Đang xử lý...';

        const result = await BioDB.checkIn(this.currentUser.uid);
        if (result.success) {
          this.currentDoc = await BioDB.getUserDoc(this.currentUser.uid);
          this.updateCheckInWidget();
          this.showConfetti();
        } else if (result.reason === 'already_checked_in') {
          checkInBtn.textContent = '✅ Đã check-in hôm nay';
        }
      });
    }
  },

  updateCheckInWidget() {
    if (!this.currentDoc) return;
    const widget = document.getElementById('checkin-widget');
    if (!widget) return;

    const today = new Date().toISOString().split('T')[0];
    const alreadyCheckedIn = this.currentDoc.lastCheckIn === today;
    const streak = this.currentDoc.streak || 0;

    const streakEl = document.getElementById('checkin-streak');
    const btnEl = document.getElementById('checkin-btn');

    if (streakEl) {
      streakEl.innerHTML = `<span class="streak-fire" style="font-size: 1.3rem;">🔥</span> ${streak} ngày`;
    }

    if (btnEl) {
      if (alreadyCheckedIn) {
        btnEl.textContent = '✅ Đã check-in hôm nay';
        btnEl.disabled = true;
        btnEl.style.opacity = '0.6';
      } else {
        btnEl.textContent = '📋 Check-in hôm nay (+5 EXP)';
        btnEl.disabled = false;
        btnEl.style.opacity = '1';
      }
    }

    widget.style.display = 'block';
  },

  showConfetti() {
    const colors = ['#FBBF24', '#A78BFA', '#EC4899', '#10B981', '#38BDF8'];
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 8px; height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        z-index: 99999; pointer-events: none;
        left: ${50 + (Math.random() - 0.5) * 40}%;
        top: ${40 + Math.random() * 20}%;
        animation: confettiFall ${1 + Math.random()}s ease-out forwards;
        animation-delay: ${Math.random() * 0.3}s;
      `;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 2000);
    }
  },

  async addKnowledge(level, knowledgeItem) {
    if (!this.currentUser) return;
    const doc = await BioDB.getUserDoc(this.currentUser.uid);
    if (!doc.unlockedKnowledge[level].includes(knowledgeItem)) {
       doc.unlockedKnowledge[level].push(knowledgeItem);
       await BioDB.updateUserDoc(this.currentUser.uid, { unlockedKnowledge: doc.unlockedKnowledge });
    }
  },

  async updateDigitalTwin(organData) {
    if (!this.currentUser) return;
    const doc = await BioDB.getUserDoc(this.currentUser.uid);
    const newTwinState = { ...doc.digitalTwinState, ...organData };
    await BioDB.updateUserDoc(this.currentUser.uid, { digitalTwinState: newTwinState });
  },

  // ── EXP shortcut helpers ──
  async earnEXP(amount, source) {
    if (!this.currentUser) return null;
    const result = await BioDB.addEXP(this.currentUser.uid, amount, source);
    if (result) {
      this.currentDoc = await BioDB.getUserDoc(this.currentUser.uid);
      // Update navbar EXP badge
      const expBadge = document.getElementById('nav-exp-badge');
      if (expBadge) expBadge.innerHTML = `⚡ ${result.newExp} EXP`;
    }
    return result;
  },

  async earnChatEXP() {
    if (!this.currentUser) return false;
    return await BioDB.addChatEXP(this.currentUser.uid);
  },

  async completeQuiz(quizId, score) {
    if (!this.currentUser) return null;
    return await BioDB.recordQuizCompletion(this.currentUser.uid, quizId, score);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.BioAuth.init();
});

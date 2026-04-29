import { BioDB } from './firebase-config.js';

window.BioAuth = {
  currentUser: null,
  currentDoc: null,

  async init() {
    BioDB.onAuthStateChanged(async (user) => {
      this.currentUser = user;
      
      const loginBtn = document.getElementById('nav-login-btn');
      const profileBtn = document.getElementById('nav-profile-btn');

      if (user) {
        // Lấy document
        this.currentDoc = await BioDB.getUserDoc(user.uid);
        
        // Cập nhật giao diện Navbar
        if (loginBtn) loginBtn.style.display = 'none';
        if (profileBtn) {
          profileBtn.style.display = 'inline-block';
          profileBtn.innerHTML = `👤 ${user.displayName}`;
        }
      } else {
        this.currentDoc = null;
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (profileBtn) profileBtn.style.display = 'none';
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
          alert('Đăng nhập mô phỏng thành công!');
          // Reload để refresh trạng thái (hoặc dùng observer)
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
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.BioAuth.init();
});

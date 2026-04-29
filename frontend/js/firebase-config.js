// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC43kz_bzcrmbmHV5Zv_87yLfbfEFdW7Yc",
  authDomain: "biohospital-77aaf.firebaseapp.com",
  databaseURL: "https://biohospital-77aaf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "biohospital-77aaf",
  storageBucket: "biohospital-77aaf.firebasestorage.app",
  messagingSenderId: "719575895164",
  appId: "1:719575895164:web:e0ad6986cdca23b15dcdf9"
};

// Khởi tạo Firebase SDK qua CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged as firebaseOnAuthStateChanged, signOut as firebaseSignOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ============================================
// RANK SYSTEM
// ============================================
const RANKS = [
  { id: "intern",      name: "Bác sĩ thực tập",   icon: "🩺",  minEXP: 0 },
  { id: "resident",    name: "Bác sĩ nội trú",    icon: "👨‍⚕️", minEXP: 100 },
  { id: "specialist",  name: "Bác sĩ chuyên khoa", icon: "🧑‍⚕️", minEXP: 300 },
  { id: "chief",       name: "Trưởng khoa",        icon: "👨‍🔬", minEXP: 600 },
  { id: "professor",   name: "Giáo sư Y khoa",     icon: "🏆",  minEXP: 1000 },
];

function getRankFromEXP(exp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (exp >= r.minEXP) rank = r;
  }
  return rank;
}

function getNextRank(exp) {
  for (const r of RANKS) {
    if (exp < r.minEXP) return r;
  }
  return null; // Đã max rank
}

// ============================================
// BIO DB WRAPPER (Real Firebase + Gamification)
// ============================================
export const BioDB = {
  RANKS,
  getRankFromEXP,
  getNextRank,

  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);
      await this.initUserDoc(result.user);
      return result;
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      throw error;
    }
  },

  async signOut() {
    return firebaseSignOut(auth);
  },

  onAuthStateChanged(callback) {
    firebaseOnAuthStateChanged(auth, callback);
  },

  // ── Init User Document (with Gamification fields) ──
  async initUserDoc(user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL || null,
        // Bio-Map
        digitalTwinState: { heart: 100, liver: 100, brain: 100, lungs: 100, stomach: 100 },
        unlockedOrgans: [],
        unlockedKnowledge: {
          biology10: [],
          biology11: [],
          biology12: []
        },
        // Gamification
        exp: 0,
        rank: "intern",
        streak: 0,
        lastCheckIn: null,
        checkInHistory: [],
        completedQuizzes: [],
        totalDiagnoses: 0,
        activeDays: 0,
        chatExpToday: 0,
        lastChatExpDate: null,
        // Meta
        createdAt: new Date().toISOString()
      });
    }
  },

  async getUserDoc(uid) {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  },

  async updateUserDoc(uid, dataToMerge) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, dataToMerge);
  },

  // ── EXP System ──
  async addEXP(uid, amount, source = "unknown") {
    const userDoc = await this.getUserDoc(uid);
    if (!userDoc) return null;

    const newExp = (userDoc.exp || 0) + amount;
    const oldRank = getRankFromEXP(userDoc.exp || 0);
    const newRank = getRankFromEXP(newExp);
    const rankChanged = oldRank.id !== newRank.id;

    await this.updateUserDoc(uid, {
      exp: newExp,
      rank: newRank.id
    });

    console.log(`[EXP] +${amount} từ ${source} → Tổng: ${newExp} (${newRank.name})`);

    // Show popup animation
    showEXPPopup(amount);

    // Show rank up notification
    if (rankChanged) {
      showRankUpPopup(newRank);
    }

    return { newExp, newRank, rankChanged };
  },

  // ── Daily Check-in ──
  async checkIn(uid) {
    const userDoc = await this.getUserDoc(uid);
    if (!userDoc) return { success: false, reason: "no_user" };

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastCheckIn = userDoc.lastCheckIn;

    // Đã check-in hôm nay rồi
    if (lastCheckIn === today) {
      return { success: false, reason: "already_checked_in", streak: userDoc.streak };
    }

    // Tính streak
    let newStreak = 1;
    if (lastCheckIn) {
      const lastDate = new Date(lastCheckIn);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Liên tiếp → streak +1
        newStreak = (userDoc.streak || 0) + 1;
      } else {
        // Đứt chuỗi → reset
        newStreak = 1;
      }
    }

    const history = userDoc.checkInHistory || [];
    history.push(today);
    // Giữ tối đa 365 ngày
    if (history.length > 365) history.shift();

    await this.updateUserDoc(uid, {
      lastCheckIn: today,
      streak: newStreak,
      checkInHistory: history,
      activeDays: (userDoc.activeDays || 0) + 1
    });

    // Cộng EXP
    const expResult = await this.addEXP(uid, 5, "check-in");

    // Bonus streak milestone
    let bonusEXP = 0;
    if (newStreak === 7) bonusEXP = 20;
    else if (newStreak === 30) bonusEXP = 50;
    else if (newStreak === 100) bonusEXP = 200;

    if (bonusEXP > 0) {
      await this.addEXP(uid, bonusEXP, `streak-milestone-${newStreak}`);
    }

    return {
      success: true,
      streak: newStreak,
      bonusEXP,
      ...expResult
    };
  },

  // ── Quiz ──
  async recordQuizCompletion(uid, quizId, score) {
    const userDoc = await this.getUserDoc(uid);
    if (!userDoc) return;

    const completed = userDoc.completedQuizzes || [];
    const alreadyDone = completed.includes(quizId);

    if (!alreadyDone) {
      completed.push(quizId);
      await this.updateUserDoc(uid, {
        completedQuizzes: completed,
        totalDiagnoses: (userDoc.totalDiagnoses || 0) + 1
      });

      // EXP dựa trên score
      let expAmount = 10;
      if (score >= 80) expAmount = 20;
      else if (score >= 50) expAmount = 15;

      await this.addEXP(uid, expAmount, `quiz-${quizId}`);
      return { expEarned: expAmount, isNew: true };
    }

    return { expEarned: 0, isNew: false };
  },

  // ── Leaderboard ──
  async getLeaderboard(maxResults = 10) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("exp", "desc"), limit(maxResults));
    const snapshot = await getDocs(q);

    const leaders = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      leaders.push({
        uid: doc.id,
        displayName: data.displayName || "Ẩn danh",
        photoURL: data.photoURL || null,
        exp: data.exp || 0,
        rank: getRankFromEXP(data.exp || 0),
        streak: data.streak || 0,
        activeDays: data.activeDays || 0,
        checkInHistory: data.checkInHistory || []
      });
    });

    return leaders;
  },

  // ── Chat EXP (max 5/day) ──
  async addChatEXP(uid) {
    const userDoc = await this.getUserDoc(uid);
    if (!userDoc) return false;

    const today = new Date().toISOString().split('T')[0];
    let chatExpToday = userDoc.chatExpToday || 0;
    const lastChatExpDate = userDoc.lastChatExpDate;

    // Reset counter mỗi ngày
    if (lastChatExpDate !== today) {
      chatExpToday = 0;
    }

    if (chatExpToday >= 5) return false; // Đã đạt giới hạn

    chatExpToday++;
    await this.updateUserDoc(uid, {
      chatExpToday,
      lastChatExpDate: today
    });

    await this.addEXP(uid, 3, "chat-ai");
    return true;
  },

  // ── Unlocked Knowledge (existing) ──
  async saveUnlockedKnowledge(uid, organs, grade10, grade11, grade12) {
    const userRef = doc(db, "users", uid);
    const updates = {};

    if (organs && organs.length > 0) {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        let currentOrgans = data.unlockedOrgans || [];
        organs.forEach(o => { if (!currentOrgans.includes(o)) currentOrgans.push(o); });
        updates.unlockedOrgans = currentOrgans;
      }
    }

    if (grade10) updates["unlockedKnowledge.biology10"] = arrayUnion(grade10);
    if (grade11) updates["unlockedKnowledge.biology11"] = arrayUnion(grade11);
    if (grade12) updates["unlockedKnowledge.biology12"] = arrayUnion(grade12);

    if (Object.keys(updates).length > 0) {
      await updateDoc(userRef, updates);
    }
  }
};

// ============================================
// GLOBAL EXP POPUP ANIMATION
// ============================================
function showEXPPopup(amount) {
  const popup = document.createElement('div');
  popup.className = 'exp-popup';
  popup.innerHTML = `+${amount} EXP ⚡`;
  popup.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 40px;
    font-size: 1.4rem;
    font-weight: 900;
    color: #FBBF24;
    text-shadow: 0 0 20px rgba(251,191,36,0.6), 0 2px 8px rgba(0,0,0,0.5);
    z-index: 99999;
    pointer-events: none;
    animation: expFlyUp 2s ease-out forwards;
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2100);
}

function showRankUpPopup(newRank) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 99998;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.3s ease;
  `;
  overlay.innerHTML = `
    <div style="
      text-align: center; padding: 3rem;
      background: linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.2));
      border: 2px solid rgba(167,139,250,0.5);
      border-radius: 2rem; max-width: 400px;
      animation: scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1);
    ">
      <div style="font-size: 4rem; margin-bottom: 1rem;">${newRank.icon}</div>
      <h2 style="color: #FBBF24; font-size: 1.5rem; margin-bottom: 0.5rem;">🎉 Thăng cấp!</h2>
      <p style="color: rgba(255,255,255,0.9); font-size: 1.1rem; margin-bottom: 0.25rem;">Bạn đã trở thành</p>
      <p style="color: var(--color-primary-light, #A78BFA); font-size: 1.4rem; font-weight: 900;">${newRank.name}</p>
      <button onclick="this.closest('div[style]').parentElement.remove()" style="
        margin-top: 1.5rem; padding: 0.6rem 2rem;
        background: rgba(167,139,250,0.3); border: 1px solid rgba(167,139,250,0.5);
        border-radius: 999px; color: white; font-weight: 700; cursor: pointer;
        font-family: inherit; font-size: 0.9rem;
      ">Tuyệt vời! 🚀</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

// ── Global helpers ──
window.showEXPPopup = showEXPPopup;

window.saveUnlockedKnowledge = async (organs, type) => {
  const user = auth.currentUser;
  if (user) {
    const g10 = "Hô hấp tế bào";
    const g11 = "Cân bằng nội môi";
    const g12 = "Đột biến gen";
    await BioDB.saveUnlockedKnowledge(user.uid, organs, g10, g11, g12);
    console.log('Đã lưu Bio-Map vào Firebase:', organs);
  } else {
    console.warn("Chưa đăng nhập, không thể lưu Bio-Map vào Firebase!");
  }
};

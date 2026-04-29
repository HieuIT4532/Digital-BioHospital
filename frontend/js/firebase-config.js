// Cấu hình Firebase (Template)
// Yêu cầu: Tạo project Firebase, bật Authentication (Google) và Firestore.
// Tham khảo: https://firebase.google.com/docs/web/setup

// TODO: Thay thế bằng config thật từ Firebase Console
const firebaseConfig = {
  apiKey: "AIza...TODO",
  authDomain: "biohospital-...firebaseapp.com",
  projectId: "biohospital-...",
  storageBucket: "biohospital-....appspot.com",
  messagingSenderId: "123456789",
  appId: "1:1234567:web:abcde",
  measurementId: "G-XXXXX"
};

/* 
// Code khởi tạo thật (bỏ comment khi có cấu hình thật + đã cài firebase SDK qua CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, signInWithPopup, onAuthStateChanged, signOut, doc, setDoc, getDoc, updateDoc };
*/

// ============================================
// MOCK FIREBASE (Dành cho giai đoạn phát triển Prototype)
// Dùng LocalStorage để giả lập Database.
// ============================================

const MOCK_STORAGE_KEY = 'bio_hospital_mock_db';

export const MockFirebase = {
  initMock() {
    if (!localStorage.getItem(MOCK_STORAGE_KEY)) {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify({ users: {} }));
    }
  },
  
  async signInWithGoogle() {
    // Trả về mock user
    const mockUser = {
      uid: 'user_' + Math.random().toString(36).substring(7),
      displayName: 'Học sinh Sinh học',
      email: 'student@example.com',
      photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=student'
    };
    
    // Lưu session hiện tại
    localStorage.setItem('bio_mock_session', JSON.stringify(mockUser));
    
    // Khởi tạo Document giả lập nếu chưa có
    await this.initUserDoc(mockUser);
    return { user: mockUser };
  },

  async signOut() {
    localStorage.removeItem('bio_mock_session');
  },

  onAuthStateChanged(callback) {
    const session = localStorage.getItem('bio_mock_session');
    if (session) {
      callback(JSON.parse(session));
    } else {
      callback(null);
    }
  },

  async initUserDoc(user) {
    const db = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY));
    if (!db.users[user.uid]) {
      db.users[user.uid] = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        digitalTwinState: { heart: 100, liver: 100, brain: 100, lungs: 100, stomach: 100 },
        unlockedKnowledge: {
          biology10: [],
          biology11: [],
          biology12: []
        },
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
    }
  },

  async getUserDoc(uid) {
    const db = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY));
    return db.users[uid];
  },

  async updateUserDoc(uid, dataToMerge) {
    const db = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY));
    if (db.users[uid]) {
      db.users[uid] = { ...db.users[uid], ...dataToMerge };
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
    }
  },

  async saveUnlockedKnowledge(uid, organs, grade10, grade11, grade12) {
    const db = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY));
    if (db.users[uid]) {
      const user = db.users[uid];
      if (!user.unlockedOrgans) user.unlockedOrgans = [];
      
      organs.forEach(o => {
         if(!user.unlockedOrgans.includes(o)) user.unlockedOrgans.push(o);
      });

      if (grade10 && !user.unlockedKnowledge.biology10.includes(grade10)) {
         user.unlockedKnowledge.biology10.push(grade10);
      }
      if (grade11 && !user.unlockedKnowledge.biology11.includes(grade11)) {
         user.unlockedKnowledge.biology11.push(grade11);
      }
      if (grade12 && !user.unlockedKnowledge.biology12.includes(grade12)) {
         user.unlockedKnowledge.biology12.push(grade12);
      }

      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
    }
  }
};

// Global function để các trang có thể gọi nhanh
window.saveUnlockedKnowledge = async (organs, type) => {
   const session = localStorage.getItem('bio_mock_session');
   if (session) {
      const user = JSON.parse(session);
      // Giả lập lưu tag kiến thức dựa trên type hoặc random
      const g10 = "Hô hấp tế bào";
      const g11 = "Cân bằng nội môi";
      const g12 = "Đột biến gen";
      await MockFirebase.saveUnlockedKnowledge(user.uid, organs, g10, g11, g12);
      console.log('Đã lưu Bio-Map:', organs);
   }
};

MockFirebase.initMock();

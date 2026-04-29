// Cấu hình Firebase
// TODO: Thay thế bằng config thật từ Firebase Console
const firebaseConfig = {
  apiKey: "TODO_API_KEY",
  authDomain: "TODO_PROJECT.firebaseapp.com",
  projectId: "TODO_PROJECT",
  storageBucket: "TODO_PROJECT.appspot.com",
  messagingSenderId: "TODO_SENDER_ID",
  appId: "TODO_APP_ID",
  measurementId: "TODO_MEASUREMENT_ID"
};

// Khởi tạo Firebase SDK qua CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged as firebaseOnAuthStateChanged, signOut as firebaseSignOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ============================================
// BIO DB WRAPPER (Real Firebase)
// ============================================
export const BioDB = {
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

  async initUserDoc(user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        digitalTwinState: { heart: 100, liver: 100, brain: 100, lungs: 100, stomach: 100 },
        unlockedOrgans: [],
        unlockedKnowledge: {
          biology10: [],
          biology11: [],
          biology12: []
        },
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

  async saveUnlockedKnowledge(uid, organs, grade10, grade11, grade12) {
    const userRef = doc(db, "users", uid);
    const updates = {};
    
    if (organs && organs.length > 0) {
      // Vì arrayUnion không nhận mảng mà nhận spread, ta lặp qua hoặc ghi đè (ở đây là merge ở component gọi)
      // Dùng updateDoc bình thường vì arrayUnion cho nhiều phần tử hơi phức tạp.
      // Giải pháp tốt nhất là fetch mảng hiện tại rồi merge.
      const docSnap = await getDoc(userRef);
      if(docSnap.exists()) {
        const data = docSnap.data();
        let currentOrgans = data.unlockedOrgans || [];
        organs.forEach(o => { if(!currentOrgans.includes(o)) currentOrgans.push(o); });
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

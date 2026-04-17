const admin = require('firebase-admin');
require('dotenv').config();

// ── Cấu hình Firebase Admin ──────────────────────────────────────────────────
// Lưu ý: private_key cần được format đúng (thay các ký tự \n nếu cần)
let privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (privateKey) {
  privateKey = privateKey.trim().replace(/^["']|["']$/g, '');
  privateKey = privateKey.replace(/\\n/g, '\n');
}

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
  console.warn('⚠️ Cảnh báo: Thiếu thông tin cấu hình Firebase trong .env');
  console.warn('Vui lòng kiểm tra FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL và FIREBASE_PRIVATE_KEY');
}

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    })
  });
  console.log('✅ Firebase Admin đã được khởi tạo');
} catch (error) {
  console.error('❌ Lỗi khởi tạo Firebase:', error.message);
}

const db = admin.firestore();

// Thiết lập cài đặt Firestore (tùy chọn)
db.settings({ ignoreUndefinedProperties: true });

module.exports = { admin, db };

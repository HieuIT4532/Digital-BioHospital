const admin = require('firebase-admin');

// Kiểm tra xem đã có instance nào chưa để tránh lỗi re-initialize
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Chú ý: Thay thế \n trong chuỗi biến môi trường thành ký tự xuống dòng thực tế
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      })
    });
    console.log('🔥 Firebase Admin SDK đã được khởi tạo thành công.');
  } catch (error) {
    console.error('❌ Lỗi khởi tạo Firebase Admin SDK:', error.message);
  }
}

const db = admin.firestore();
module.exports = { admin, db };

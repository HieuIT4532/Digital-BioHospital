# Bệnh Viện Sinh Học Thông Minh – Đồng Điệu Sống 🏥

> Hệ thống AI phòng khám thông minh: phân tích sức khoẻ, khám chuyên khoa, dự đoán tương lai và kế hoạch cá nhân hóa.

## 🚀 Tech Stack

| Layer     | Công nghệ              | Hosting        |
|-----------|------------------------|----------------|
| Frontend  | HTML/CSS/JS thuần      | **Vercel**     |
| Backend   | Node.js + Express      | **Render**     |
| Database  | MongoDB Atlas          | MongoDB Free   |
| AI        | Google Gemini 1.5 Flash| Gemini API     |

## 📂 Cấu Trúc Dự Án

```
bio-ai-hospital/
├── frontend/           ← Deploy lên Vercel
│   ├── index.html      ← Landing page
│   ├── reception.html  ← Tiếp nhận bệnh nhân
│   ├── departments.html← 6 chuyên khoa AI
│   ├── anatomy.html    ← Giải phẫu tương tác
│   ├── analysis.html   ← Liên kết cơ quan
│   ├── prediction.html ← Dự đoán tương lai ⭐
│   ├── personalize.html← Kế hoạch cá nhân ⭐
│   ├── library.html    ← Thư viện sức khoẻ
│   ├── disclaimer.html ← Nội quy
│   ├── css/            ← Design system
│   └── js/             ← API client + utilities
└── backend/            ← Deploy lên Render
    ├── server.js        ← Express server
    ├── models/          ← MongoDB schemas
    ├── routes/          ← API endpoints
    └── utils/           ← Gemini AI wrapper
```

## ⚡ Setup Nhanh

### 1. Clone & Install Backend

```bash
cd backend
npm install
cp .env.example .env
# Điền GEMINI_API_KEY và MONGODB_URI vào .env
npm run dev
```

### 2. Lấy API Keys

**Google Gemini API:**
1. Vào [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Tạo API key miễn phí
3. Dán vào `GEMINI_API_KEY` trong `.env`

**MongoDB Atlas:**
1. Vào [https://mongodb.com/atlas](https://mongodb.com/atlas) → Free M0
2. Tạo cluster → Connect → Copy connection string
3. Dán vào `MONGODB_URI` trong `.env`

### 3. Chạy Frontend

Mở `frontend/index.html` trực tiếp trong browser, hoặc dùng Live Server.

---

## 🌐 Deploy

### Frontend → Vercel

```bash
# Cài Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Backend → Render

1. Push code lên GitHub
2. Vào [render.com](https://render.com) → New Web Service
3. Connect GitHub repo → Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Thêm Environment Variables từ `.env`

---

## 🧠 Tính Năng AI

| Tính năng | Mô tả |
|-----------|-------|
| **Health Analysis** | BMI, health score 0-100, risk level |
| **Department AI** | Phân tích triệu chứng 6 chuyên khoa |
| **Organ Chain** | Chuỗi ảnh hưởng giữa các hệ cơ quan |
| **Future Prediction** | Dự đoán sức khoẻ 30 ngày / 3 tháng / 1 năm |
| **Personal Plan** | Lịch sinh hoạt 7 ngày + dinh dưỡng + bài tập |

---

## ⚠️ Tuyên Bố Miễn Trách

Hệ thống này chỉ dành cho **mục đích giáo dục và học tập**.
Không thay thế chẩn đoán y tế chuyên nghiệp.
Khi có triệu chứng nghiêm trọng, hãy gặp bác sĩ ngay.

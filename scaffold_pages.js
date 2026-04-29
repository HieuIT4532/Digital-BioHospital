const fs = require('fs');
const path = require('path');

const dir = 'd:/Digital-BioHospital/frontend';

const pages = [
  { name: 'microscope.html', title: 'Soi Kính Hiển Vi', icon: '🔬', desc: 'Khám phá thế giới vi mô của Tế bào và Bào quan (Lớp 10).' },
  { name: 'metabolism.html', title: 'Chuyển Hóa & Năng Lượng', icon: '⚡', desc: 'Phân tích quá trình tạo ATP, hoạt động của Enzyme và trao đổi chất (Lớp 10).' },
  { name: 'microbiology.html', title: 'Vi Sinh & Miễn Dịch', icon: '🦠', desc: 'Tìm hiểu về Virus, Vi khuẩn và cơ chế hoạt động của Hệ Miễn Dịch (Lớp 10).' },
  { name: 'genetics.html', title: 'Bản Đồ Gene', icon: '🧬', desc: 'Khám phá bí ẩn di truyền, phân tích tiền sử bệnh và đột biến (Lớp 12).' }
];

// Lấy template từ một file có sẵn (VD: leaderboard.html)
let template = fs.readFileSync(path.join(dir, 'leaderboard.html'), 'utf-8');

// Hàm trích xuất layout chung (chỉ thay đổi ruột <main>)
function generatePage(pageInfo) {
  let content = template;
  
  // Replace Title
  content = content.replace(/<title>.*?<\/title>/, `<title>${pageInfo.title} – Digital BioHospital</title>`);
  
  // Tạo nội dung placeholder
  const placeholderMain = `
  <main id="main">
    <div class="page-header" style="background:linear-gradient(180deg,rgba(124,58,237,0.08) 0%,transparent 100%);border-bottom:1px solid rgba(255,255,255,0.05);">
      <div class="container">
        <div class="section-tag animate-fadeInUp">Phòng Lab & Viện Di Truyền</div>
        <h1 class="animate-fadeInUp delay-100">${pageInfo.icon} ${pageInfo.title}</h1>
        <p class="animate-fadeInUp delay-200">${pageInfo.desc}</p>
      </div>
    </div>

    <div class="container" style="text-align: center; padding: 6rem 0;">
      <div style="font-size: 5rem; margin-bottom: 1.5rem; animation: float 3s ease-in-out infinite;">🛠️</div>
      <h2>Tính năng đang được phát triển</h2>
      <p style="color: rgba(255,255,255,0.5); margin-top: 1rem; max-width: 600px; margin-left: auto; margin-right: auto;">
        Phân hệ này đang trong quá trình xây dựng và sẽ sớm ra mắt trong các phiên bản cập nhật tiếp theo của Bệnh Viện Sinh Học Thông Minh.
      </p>
      <a href="index.html" class="btn btn-primary" style="margin-top: 2rem;">Về Trang Chủ</a>
    </div>
  </main>`;

  // Cắt <main> cũ và thay bằng <main> mới
  const mainStart = content.indexOf('<main id="main">');
  const mainEnd = content.indexOf('</main>') + 7;
  
  content = content.substring(0, mainStart) + placeholderMain + content.substring(mainEnd);
  
  return content;
}

pages.forEach(p => {
  fs.writeFileSync(path.join(dir, p.name), generatePage(p), 'utf-8');
  console.log('Created ' + p.name);
});

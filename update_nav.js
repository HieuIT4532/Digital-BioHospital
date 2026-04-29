const fs = require('fs');
const path = require('path');

const newNav = `<ul class="navbar-nav" role="list">
        <li><a href="index.html" id="nav-home">🏠 Trang chủ</a></li>
        <li class="nav-item">
          <a href="#" style="cursor:default;">🏥 Lâm Sàng (Lớp 11) ▼</a>
          <div class="nav-dropdown flex-col">
            <a href="reception.html">📋 Phòng Tiếp nhận</a>
            <a href="departments.html">🏥 Khám Chuyên khoa</a>
            <a href="anatomy.html">🧬 Giải phẫu 3D</a>
          </div>
        </li>
        <li class="nav-item">
          <a href="#" style="cursor:default;">🔬 Phòng Lab (Lớp 10) ▼</a>
          <div class="nav-dropdown flex-col">
            <a href="microscope.html">🔬 Soi Kính Hiển Vi</a>
            <a href="metabolism.html">⚡ Chuyển Hóa & Năng Lượng</a>
            <a href="microbiology.html">🦠 Vi Sinh & Miễn Dịch</a>
          </div>
        </li>
        <li class="nav-item">
          <a href="#" style="cursor:default;">🧬 Di Truyền Học (Lớp 12) ▼</a>
          <div class="nav-dropdown flex-col">
            <a href="genetics.html">🧬 Bản Đồ Gene</a>
            <a href="prediction.html">🔮 Dự Báo Tương Lai</a>
          </div>
        </li>
        <li class="nav-item">
          <a href="#" style="cursor:default;">🏆 Hồ Sơ & Thành Tựu ▼</a>
          <div class="nav-dropdown flex-col">
            <a href="profile.html">👤 Hộ Chiếu Sức Khỏe</a>
            <a href="personalize.html">🌱 Kế Hoạch Cá Nhân</a>
            <a href="leaderboard.html">🏆 Bảng Xếp Hạng</a>
            <a href="library.html">📚 Thư Viện Y Khoa</a>
          </div>
        </li>
      </ul>`;

const dir = 'd:/Digital-BioHospital/frontend';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace the <ul> block for the navbar
    const ulStart = content.indexOf('<ul class="navbar-nav"');
    if (ulStart !== -1) {
        const ulEnd = content.indexOf('</ul>', ulStart) + 5;
        content = content.substring(0, ulStart) + newNav + content.substring(ulEnd);
    }
    
    // Check if floating chatbot is present, if not add it before </body>
    if (!content.includes('floating-chat-btn')) {
        content = content.replace('</body>', '  <!-- Floating Chatbot Button -->\n  <a href="chatbot.html" class="floating-chat-btn" title="Tư vấn AI">🤖</a>\n</body>');
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Updated ' + file);
});

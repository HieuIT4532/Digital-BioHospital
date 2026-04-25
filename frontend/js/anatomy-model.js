/* ============================================================
   HUMAN ANATOMY 2D MODEL - INTERACTIVE JAVASCRIPT V2
   Full popup system for all body parts & systems
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    //  COMPREHENSIVE PART DATA (All Systems)
    // ============================================================
    const partData = {

        // ==================== SKELETAL SYSTEM ====================
        skull: {
            icon: '💀',
            name: 'Hộp Sọ',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Hộp sọ gồm 22 xương ghép lại chặt chẽ, tạo thành một "mũ bảo hiểm" tự nhiên bảo vệ bộ não — cơ quan quan trọng nhất cơ thể. Trẻ sơ sinh có thóp mềm cho phép sọ biến dạng khi sinh!',
            functions: [
                { icon: '🛡️', text: 'Bảo vệ não bộ và các giác quan' },
                { icon: '👀', text: 'Chứa hốc mắt, mũi, tai trong' },
                { icon: '🦷', text: 'Hỗ trợ hệ thống nhai qua xương hàm' },
                { icon: '🎭', text: 'Tạo hình dạng khuôn mặt' }
            ],
            diseases: [
                { name: 'Nứt sọ', color: 'tag-red' },
                { name: 'U xương sọ', color: 'tag-purple' },
                { name: 'Viêm xoang', color: 'tag-orange' },
                { name: 'Dị tật sọ', color: 'tag-blue' }
            ],
            actionBtn: '🦴 Đến Khoa Xương'
        },

        cervical: {
            icon: '🦴',
            name: 'Đốt Sống Cổ',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Cột sống cổ gồm 7 đốt sống (C1-C7) nâng đỡ đầu nặng ~5kg. Đốt C1 (Atlas) cho phép gật đầu, C2 (Axis) cho phép xoay đầu. Hươu cao cổ cũng chỉ có đúng 7 đốt sống cổ!',
            functions: [
                { icon: '🔄', text: 'Cho phép cử động xoay và gật đầu' },
                { icon: '🏗️', text: 'Nâng đỡ trọng lượng hộp sọ' },
                { icon: '🧠', text: 'Bảo vệ tủy sống vùng cổ' },
                { icon: '🩸', text: 'Cho động mạch đốt sống đi qua' }
            ],
            diseases: [
                { name: 'Thoái hóa', color: 'tag-orange' },
                { name: 'Thoát vị đĩa đệm', color: 'tag-red' },
                { name: 'Vẹo cổ', color: 'tag-blue' },
                { name: 'Gãy đốt sống', color: 'tag-red' }
            ],
            actionBtn: '🦴 Đến Khoa Xương'
        },

        clavicle: {
            icon: '🦴',
            name: 'Xương Đòn',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Xương đòn (xương quai xanh) là xương dài nối vai với xương ức. Đây là xương thường bị gãy nhất ở cơ thể người, chiếm ~5% tổng số gãy xương, đặc biệt khi ngã chống tay!',
            functions: [
                { icon: '🔗', text: 'Kết nối cánh tay với thân mình' },
                { icon: '💪', text: 'Truyền lực từ tay đến thân' },
                { icon: '🛡️', text: 'Bảo vệ mạch máu và dây thần kinh' },
                { icon: '📐', text: 'Giữ vai ở vị trí đúng' }
            ],
            diseases: [
                { name: 'Gãy xương đòn', color: 'tag-red' },
                { name: 'Trật khớp vai', color: 'tag-orange' },
                { name: 'Viêm khớp', color: 'tag-purple' }
            ],
            actionBtn: '🦴 Đến Khoa Chấn Thương'
        },

        scapula: {
            icon: '🦴',
            name: 'Xương Bả Vai',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Xương bả vai là xương dẹt hình tam giác nằm ở phía sau lưng. Nó "trôi nổi" trên lồng ngực, được giữ bởi 17 cơ, cho phép vai cử động linh hoạt nhất cơ thể!',
            functions: [
                { icon: '🔄', text: 'Cho phép cử động vai đa hướng' },
                { icon: '💪', text: 'Là nơi bám của nhiều cơ vai và lưng' },
                { icon: '🦾', text: 'Tạo ổ chảo cho khớp vai' },
                { icon: '🏗️', text: 'Ổn định vùng vai khi vận động' }
            ],
            diseases: [
                { name: 'Gãy xương bả vai', color: 'tag-red' },
                { name: 'Viêm quanh khớp vai', color: 'tag-orange' },
                { name: 'Hội chứng vai đông cứng', color: 'tag-blue' }
            ],
            actionBtn: '🦴 Đến Khoa Chấn Thương'
        },

        ribcage: {
            icon: '🦴',
            name: 'Lồng Ngực',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Lồng ngực gồm 12 cặp xương sườn, xương ức và cột sống ngực, tạo thành "lồng" bảo vệ tim, phổi. Xương sườn có thể tự lành khi gãy nhờ cốt mạc phong phú!',
            functions: [
                { icon: '🛡️', text: 'Bảo vệ tim, phổi và các cơ quan ngực' },
                { icon: '🌬️', text: 'Hỗ trợ cơ chế hô hấp co giãn' },
                { icon: '💪', text: 'Điểm bám cho cơ hô hấp và cơ liên sườn' },
                { icon: '🔒', text: 'Giữ cấu trúc ổn định cho lồng ngực' }
            ],
            diseases: [
                { name: 'Gãy xương sườn', color: 'tag-red' },
                { name: 'Viêm sụn sườn', color: 'tag-orange' },
                { name: 'Tràn khí màng phổi', color: 'tag-red' },
                { name: 'Loãng xương', color: 'tag-purple' }
            ],
            actionBtn: '🦴 Đến Khoa Lồng Ngực'
        },

        spine: {
            icon: '🦴',
            name: 'Cột Sống',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Cột sống gồm 33 đốt sống chia thành 5 vùng, là trụ cột của cơ thể. Các đĩa đệm giữa đốt sống hoạt động như "giảm xóc" tự nhiên. Ban đêm bạn cao hơn ban ngày 1-2cm vì đĩa đệm giãn nở!',
            functions: [
                { icon: '🏗️', text: 'Nâng đỡ toàn bộ trọng lượng cơ thể' },
                { icon: '🧠', text: 'Bảo vệ tủy sống bên trong ống sống' },
                { icon: '🔄', text: 'Cho phép cúi, ngửa, xoay, nghiêng' },
                { icon: '⚡', text: 'Cho dây thần kinh tủy đi qua các lỗ liên hợp' }
            ],
            diseases: [
                { name: 'Thoái hóa cột sống', color: 'tag-orange' },
                { name: 'Thoát vị đĩa đệm', color: 'tag-red' },
                { name: 'Vẹo cột sống', color: 'tag-blue' },
                { name: 'Gai cột sống', color: 'tag-purple' },
                { name: 'Loãng xương', color: 'tag-orange' }
            ],
            actionBtn: '🦴 Đến Khoa Cột Sống'
        },

        humerus: {
            icon: '🦴',
            name: 'Xương Cánh Tay',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Xương cánh tay (humerus) là xương dài nhất chi trên, nối khớp vai với khuỷu tay. Rãnh thần kinh quay chạy xoắn quanh xương — gãy giữa xương cánh tay có thể gây liệt bàn tay rủ!',
            functions: [
                { icon: '💪', text: 'Đòn bẩy cho cử động cánh tay' },
                { icon: '🔗', text: 'Kết nối khớp vai và khớp khuỷu' },
                { icon: '🏋️', text: 'Điểm bám cho cơ nhị đầu và tam đầu' },
                { icon: '🦾', text: 'Chịu lực khi nâng đỡ vật nặng' }
            ],
            diseases: [
                { name: 'Gãy xương', color: 'tag-red' },
                { name: 'Viêm khớp vai', color: 'tag-orange' },
                { name: 'Hoại tử chỏm', color: 'tag-purple' }
            ],
            actionBtn: '🦴 Đến Khoa Chấn Thương'
        },

        forearm: {
            icon: '🦴',
            name: 'Xương Cẳng Tay',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Cẳng tay gồm 2 xương: xương quay (radius) ở phía ngón cái và xương trụ (ulna) ở phía ngón út. Hai xương này xoay quanh nhau cho phép bạn úp/ngửa bàn tay — cử động sấp ngửa!',
            functions: [
                { icon: '🔄', text: 'Cho phép cử động sấp ngửa bàn tay' },
                { icon: '🦾', text: 'Hỗ trợ gấp duỗi cẳng tay' },
                { icon: '💪', text: 'Điểm bám cho cơ cẳng tay và bàn tay' },
                { icon: '🔗', text: 'Kết nối khuỷu tay với cổ tay' }
            ],
            diseases: [
                { name: 'Gãy Colles', color: 'tag-red' },
                { name: 'Gãy Monteggia', color: 'tag-red' },
                { name: 'Viêm lồi cầu', color: 'tag-orange' }
            ],
            actionBtn: '🦴 Đến Khoa Chấn Thương'
        },

        'hand-bones': {
            icon: '🤚',
            name: 'Xương Bàn Tay',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Bàn tay có 27 xương: 8 xương cổ tay, 5 xương bàn tay và 14 xương đốt ngón. Ngón cái có 2 đốt, các ngón khác có 3 đốt. Tổng cộng hai bàn tay có 54 xương — chiếm 1/4 tổng số xương cơ thể!',
            functions: [
                { icon: '✋', text: 'Cầm nắm và thao tác vật thể' },
                { icon: '✍️', text: 'Viết, vẽ và các cử động tinh tế' },
                { icon: '🤏', text: 'Ngón cái đối chiều — đặc trưng loài người' },
                { icon: '🎹', text: 'Xúc giác và cảm nhận chính xác' }
            ],
            diseases: [
                { name: 'Gãy xương bàn', color: 'tag-red' },
                { name: 'H/c ống cổ tay', color: 'tag-blue' },
                { name: 'Viêm khớp ngón', color: 'tag-orange' },
                { name: 'Ngón tay cò súng', color: 'tag-purple' }
            ],
            actionBtn: '🦴 Đến Khoa Bàn Tay'
        },

        pelvis: {
            icon: '🦴',
            name: 'Xương Chậu',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Xương chậu là khung xương vững chắc gồm xương cánh chậu, xương ngồi và xương mu hợp nhất. Nó giống như một cái "bát" nâng đỡ nội tạng và truyền trọng lượng xuống chân. Xương chậu nữ rộng hơn nam để sinh nở!',
            functions: [
                { icon: '🏗️', text: 'Nâng đỡ nội tạng ổ bụng dưới' },
                { icon: '🚶', text: 'Truyền trọng lượng từ cột sống xuống chân' },
                { icon: '🛡️', text: 'Bảo vệ bàng quang, ruột và cơ quan sinh dục' },
                { icon: '🦵', text: 'Chứa ổ cối cho khớp háng' }
            ],
            diseases: [
                { name: 'Gãy xương chậu', color: 'tag-red' },
                { name: 'Viêm khớp háng', color: 'tag-orange' },
                { name: 'Hoại tử chỏm', color: 'tag-purple' },
                { name: 'Loãng xương', color: 'tag-orange' }
            ],
            actionBtn: '🦴 Đến Khoa Chấn Thương'
        },

        femur: {
            icon: '🦴',
            name: 'Xương Đùi',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Xương đùi (femur) là xương dài nhất, nặng nhất và khỏe nhất cơ thể người. Nó có thể chịu lực nén gấp 30 lần trọng lượng cơ thể! Chiều dài xương đùi xấp xỉ 1/4 chiều cao của bạn.',
            functions: [
                { icon: '🚶', text: 'Đòn bẩy chính khi đi lại và chạy' },
                { icon: '🏋️', text: 'Chịu lực tải trọng lượng cơ thể' },
                { icon: '💪', text: 'Điểm bám cho cơ đùi lớn nhất' },
                { icon: '🩸', text: 'Chứa tủy xương sản xuất máu' }
            ],
            diseases: [
                { name: 'Gãy cổ xương đùi', color: 'tag-red' },
                { name: 'Hoại tử chỏm', color: 'tag-purple' },
                { name: 'Loãng xương', color: 'tag-orange' },
                { name: 'U xương', color: 'tag-red' }
            ],
            actionBtn: '🦴 Đến Khoa Chỉnh Hình'
        },

        patella: {
            icon: '🦴',
            name: 'Xương Bánh Chè',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Xương bánh chè (patella) là xương vừng lớn nhất cơ thể, nằm trong gân cơ tứ đầu đùi. Nó hoạt động như một ròng rọc giúp tăng hiệu quả duỗi gối lên 50%! Trẻ sơ sinh chưa có xương này mà chỉ có sụn.',
            functions: [
                { icon: '⚡', text: 'Tăng hiệu suất cơ tứ đầu đùi' },
                { icon: '🛡️', text: 'Bảo vệ khớp gối phía trước' },
                { icon: '🔧', text: 'Hoạt động như ròng rọc cho gân' },
                { icon: '🚶', text: 'Hỗ trợ cử động gấp duỗi gối' }
            ],
            diseases: [
                { name: 'Gãy xương bánh chè', color: 'tag-red' },
                { name: 'Trật xương bánh chè', color: 'tag-orange' },
                { name: 'Viêm gân', color: 'tag-blue' }
            ],
            actionBtn: '🦴 Đến Khoa Chỉnh Hình'
        },

        tibia: {
            icon: '🦴',
            name: 'Xương Cẳng Chân',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Cẳng chân gồm xương chày (tibia) — xương chịu lực chính, và xương mác (fibula) — xương nhỏ ở bên ngoài. Xương chày là xương dễ gãy nhất vì phần giữa ít cơ bao phủ và lực tác động trực tiếp.',
            functions: [
                { icon: '🏗️', text: 'Chịu chính trọng lượng cơ thể (xương chày)' },
                { icon: '🔗', text: 'Kết nối khớp gối với cổ chân' },
                { icon: '💪', text: 'Điểm bám cho cơ cẳng chân' },
                { icon: '⚖️', text: 'Ổn định mắt cá (xương mác)' }
            ],
            diseases: [
                { name: 'Gãy xương chày', color: 'tag-red' },
                { name: 'Viêm cốt mạc', color: 'tag-orange' },
                { name: 'Gãy mỏi', color: 'tag-blue' },
                { name: 'H/c khoang', color: 'tag-red' }
            ],
            actionBtn: '🦴 Đến Khoa Chấn Thương'
        },

        'foot-bones': {
            icon: '🦶',
            name: 'Xương Bàn Chân',
            system: 'Hệ xương',
            systemTag: 'skeletal',
            aiText: 'Bàn chân có 26 xương, 33 khớp và hơn 100 cơ-gân-dây chằng. Vòm bàn chân hoạt động như lò xo hấp thu lực khi đi. Mỗi ngày hai bàn chân chịu tổng lực tương đương hàng trăm tấn!',
            functions: [
                { icon: '🚶', text: 'Nâng đỡ cơ thể khi đứng và di chuyển' },
                { icon: '🏃', text: 'Hấp thu lực va đập khi chạy nhảy' },
                { icon: '⚖️', text: 'Duy trì thăng bằng cơ thể' },
                { icon: '🦘', text: 'Tạo đòn bẩy khi đẩy bước chân' }
            ],
            diseases: [
                { name: 'Bàn chân bẹt', color: 'tag-blue' },
                { name: 'Gai gót chân', color: 'tag-orange' },
                { name: 'Hallux valgus', color: 'tag-purple' },
                { name: 'Gãy xương bàn', color: 'tag-red' }
            ],
            actionBtn: '🦶 Đến Khoa Bàn Chân'
        },

        // ==================== ORGANS ====================
        brain: {
            icon: '🧠',
            name: 'Não Bộ',
            system: 'Hệ thần kinh trung ương',
            systemTag: 'organs',
            aiText: 'Não người chứa ~86 tỷ neuron, tiêu thụ 20% năng lượng cơ thể dù chỉ nặng ~1.4kg. Não hoạt động 24/7 kể cả khi ngủ — tạo ra đủ điện để thắp sáng một bóng đèn nhỏ!',
            functions: [
                { icon: '🧠', text: 'Xử lý thông tin và tư duy' },
                { icon: '💭', text: 'Lưu trữ ký ức và học tập' },
                { icon: '🎭', text: 'Điều khiển cảm xúc và hành vi' },
                { icon: '⚡', text: 'Điều phối mọi hoạt động cơ thể' }
            ],
            diseases: [
                { name: 'Đột quỵ', color: 'tag-red' },
                { name: 'Alzheimer', color: 'tag-purple' },
                { name: 'Parkinson', color: 'tag-blue' },
                { name: 'U não', color: 'tag-red' },
                { name: 'Động kinh', color: 'tag-orange' }
            ],
            actionBtn: '🧠 Đến Khoa Thần Kinh'
        },

        trachea: {
            icon: '🫁',
            name: 'Khí Quản',
            system: 'Hệ hô hấp',
            systemTag: 'organs',
            aiText: 'Khí quản dài ~10-12cm, được cấu tạo bởi 16-20 vòng sụn hình chữ C giữ ống luôn mở. Phía sau (giáp thực quản) không có sụn để thức ăn dễ đi qua!',
            functions: [
                { icon: '🌬️', text: 'Dẫn không khí từ mũi/miệng đến phổi' },
                { icon: '🧹', text: 'Lọc bụi bẩn qua lông mao và dịch nhầy' },
                { icon: '🗣️', text: 'Hỗ trợ phát âm qua thanh quản' },
                { icon: '🌡️', text: 'Làm ấm và ẩm không khí' }
            ],
            diseases: [
                { name: 'Viêm khí quản', color: 'tag-orange' },
                { name: 'Hẹp khí quản', color: 'tag-red' },
                { name: 'Dị vật đường thở', color: 'tag-red' }
            ],
            actionBtn: '🫁 Đến Khoa Hô Hấp'
        },

        lungs: {
            icon: '🫁',
            name: 'Phổi',
            system: 'Hệ hô hấp',
            systemTag: 'organs',
            aiText: 'Hai lá phổi có tổng diện tích ~70m² — lớn bằng một sân tennis! Thực hiện 20.000 lần thở mỗi ngày, cung cấp O₂ và thải CO₂.',
            functions: [
                { icon: '🔄', text: 'Trao đổi khí (O₂ vào, CO₂ ra)' },
                { icon: '🛡️', text: 'Lọc vi khuẩn, bụi khỏi không khí' },
                { icon: '🩸', text: 'Oxy hóa máu trước khi về tim' },
                { icon: '🗣️', text: 'Tham gia tạo âm thanh khi nói' }
            ],
            diseases: [
                { name: 'Hen suyễn', color: 'tag-orange' },
                { name: 'COPD', color: 'tag-blue' },
                { name: 'Viêm phổi', color: 'tag-red' },
                { name: 'Ung thư phổi', color: 'tag-red' },
                { name: 'Lao phổi', color: 'tag-purple' }
            ],
            actionBtn: '🫁 Đến Khoa Hô Hấp'
        },

        heart: {
            icon: '🫀',
            name: 'Tim',
            system: 'Hệ tuần hoàn',
            systemTag: 'organs',
            aiText: 'Tim đập ~100.000 lần/ngày, bơm ~7.500 lít máu qua hệ mạch dài ~100.000km! Tim có hệ thống điện tự phát — có thể đập ngay cả khi tách rời cơ thể nếu có đủ oxy.',
            functions: [
                { icon: '💉', text: 'Bơm máu giàu oxy đi nuôi cơ thể' },
                { icon: '🔄', text: 'Thu hồi máu nghèo oxy về phổi' },
                { icon: '⚡', text: 'Tự phát xung điện nhịp tim' },
                { icon: '🩸', text: 'Duy trì huyết áp ổn định' }
            ],
            diseases: [
                { name: 'Nhồi máu cơ tim', color: 'tag-red' },
                { name: 'Suy tim', color: 'tag-red' },
                { name: 'Rối loạn nhịp', color: 'tag-orange' },
                { name: 'Bệnh van tim', color: 'tag-blue' },
                { name: 'Cao huyết áp', color: 'tag-purple' }
            ],
            actionBtn: '🫀 Đến Khoa Tim Mạch'
        },

        liver: {
            icon: '🫘',
            name: 'Gan',
            system: 'Hệ tiêu hóa',
            systemTag: 'organs',
            aiText: 'Gan là "nhà máy hóa chất" lớn nhất cơ thể với hơn 500 chức năng! Nặng ~1.5kg, gan có khả năng tự tái tạo đáng kinh ngạc — chỉ cần 25% gan còn lại có thể phục hồi toàn bộ.',
            functions: [
                { icon: '🧪', text: 'Giải độc các chất có hại trong máu' },
                { icon: '💚', text: 'Sản xuất mật để tiêu hóa chất béo' },
                { icon: '📦', text: 'Dự trữ glycogen, vitamin và khoáng chất' },
                { icon: '🩸', text: 'Tổng hợp protein huyết tương' }
            ],
            diseases: [
                { name: 'Viêm gan B/C', color: 'tag-red' },
                { name: 'Xơ gan', color: 'tag-orange' },
                { name: 'Gan nhiễm mỡ', color: 'tag-blue' },
                { name: 'Ung thư gan', color: 'tag-red' },
                { name: 'Sỏi mật', color: 'tag-purple' }
            ],
            actionBtn: '🫘 Đến Khoa Tiêu Hóa'
        },

        stomach: {
            icon: '🟠',
            name: 'Dạ Dày',
            system: 'Hệ tiêu hóa',
            systemTag: 'organs',
            aiText: 'Dạ dày chứa acid HCl mạnh đến mức có thể hòa tan kim loại! Lớp niêm mạc bảo vệ được thay mới mỗi 3-4 ngày. Dạ dày rỗng chỉ bằng nắm tay, nhưng có thể giãn chứa đến 4 lít thức ăn.',
            functions: [
                { icon: '🍽️', text: 'Nghiền nát và trộn thức ăn' },
                { icon: '🧪', text: 'Tiết acid HCl và enzyme pepsin' },
                { icon: '🛡️', text: 'Tiêu diệt vi khuẩn trong thức ăn' },
                { icon: '⏱️', text: 'Kiểm soát tốc độ tiêu hóa' }
            ],
            diseases: [
                { name: 'Viêm dạ dày', color: 'tag-orange' },
                { name: 'Loét dạ dày', color: 'tag-red' },
                { name: 'Trào ngược', color: 'tag-blue' },
                { name: 'Ung thư dạ dày', color: 'tag-red' },
                { name: 'H. pylori', color: 'tag-purple' }
            ],
            actionBtn: '🟠 Đến Khoa Tiêu Hóa'
        },

        kidneys: {
            icon: '🫘',
            name: 'Thận',
            system: 'Hệ tiết niệu',
            systemTag: 'organs',
            aiText: 'Hai quả thận lọc toàn bộ lượng máu trong cơ thể mỗi 30 phút! Mỗi quả chứa ~1 triệu nephron — đơn vị lọc cực nhỏ. Thận điều chỉnh nước, muối và huyết áp một cách chính xác.',
            functions: [
                { icon: '🔬', text: 'Lọc chất thải và độc tố khỏi máu' },
                { icon: '💧', text: 'Điều hòa cân bằng nước và điện giải' },
                { icon: '📊', text: 'Điều chỉnh huyết áp qua renin' },
                { icon: '🩸', text: 'Kích thích tạo hồng cầu (erythropoietin)' }
            ],
            diseases: [
                { name: 'Sỏi thận', color: 'tag-orange' },
                { name: 'Suy thận', color: 'tag-red' },
                { name: 'Viêm cầu thận', color: 'tag-blue' },
                { name: 'Thận đa nang', color: 'tag-purple' },
                { name: 'Nhiễm trùng tiết niệu', color: 'tag-red' }
            ],
            actionBtn: '🫘 Đến Khoa Thận'
        },

        intestines: {
            icon: '🟤',
            name: 'Ruột',
            system: 'Hệ tiêu hóa',
            systemTag: 'organs',
            aiText: 'Ruột non dài ~6-7m, ruột già ~1.5m — tổng cộng dài hơn 1 sân bóng rổ! Ruột chứa ~100 nghìn tỷ vi khuẩn đường ruột (microbiome), tạo thành "hệ thần kinh thứ hai" ảnh hưởng cảm xúc.',
            functions: [
                { icon: '🍎', text: 'Hấp thu dinh dưỡng từ thức ăn (ruột non)' },
                { icon: '💧', text: 'Hấp thu nước và khoáng chất (ruột già)' },
                { icon: '🛡️', text: 'Hàng rào miễn dịch đường ruột' },
                { icon: '🦠', text: 'Nuôi dưỡng hệ vi sinh có lợi' }
            ],
            diseases: [
                { name: 'Viêm ruột thừa', color: 'tag-red' },
                { name: 'Crohn', color: 'tag-purple' },
                { name: 'IBS', color: 'tag-blue' },
                { name: 'Ung thư đại tràng', color: 'tag-red' },
                { name: 'Tắc ruột', color: 'tag-orange' }
            ],
            actionBtn: '🟤 Đến Khoa Tiêu Hóa'
        },

        bladder: {
            icon: '💧',
            name: 'Bàng Quang',
            system: 'Hệ tiết niệu',
            systemTag: 'organs',
            aiText: 'Bàng quang là "túi chứa" nước tiểu co giãn, dung tích tối đa ~400-600ml. Thành bàng quang có cơ trơn dày, khi căng sẽ gửi tín hiệu "buồn tiểu" qua dây thần kinh đến não.',
            functions: [
                { icon: '💧', text: 'Lưu trữ nước tiểu tạm thời' },
                { icon: '🔒', text: 'Kiểm soát bài tiết qua cơ thắt' },
                { icon: '📡', text: 'Gửi tín hiệu buồn tiểu đến não' },
                { icon: '🧹', text: 'Tống xuất chất thải hòa tan' }
            ],
            diseases: [
                { name: 'Nhiễm trùng tiểu', color: 'tag-red' },
                { name: 'Sỏi bàng quang', color: 'tag-orange' },
                { name: 'Bàng quang tăng hoạt', color: 'tag-blue' },
                { name: 'Ung thư bàng quang', color: 'tag-red' }
            ],
            actionBtn: '💧 Đến Khoa Tiết Niệu'
        },

        // ==================== CIRCULATORY SYSTEM ====================
        aorta: {
            icon: '🔴',
            name: 'Động Mạch Chủ',
            system: 'Hệ tuần hoàn',
            systemTag: 'circulatory',
            aiText: 'Động mạch chủ (aorta) là mạch máu lớn nhất cơ thể, đường kính ~2.5cm, xuất phát từ tâm thất trái. Máu phun ra với vận tốc ~40cm/s — đủ để phun nước xa hơn 1.8m!',
            functions: [
                { icon: '🩸', text: 'Phân phối máu giàu oxy đi toàn cơ thể' },
                { icon: '💪', text: 'Duy trì áp lực máu ổn định' },
                { icon: '🌿', text: 'Phân nhánh cung cấp máu cho mọi cơ quan' },
                { icon: '🔄', text: 'Co giãn đàn hồi theo nhịp tim' }
            ],
            diseases: [
                { name: 'Phình ĐM chủ', color: 'tag-red' },
                { name: 'Bóc tách ĐM', color: 'tag-red' },
                { name: 'Xơ vữa ĐM', color: 'tag-orange' },
                { name: 'Hẹp eo ĐM chủ', color: 'tag-blue' }
            ],
            actionBtn: '🔴 Đến Khoa Tim Mạch'
        },

        carotid: {
            icon: '🔴',
            name: 'Động Mạch Cảnh',
            system: 'Hệ tuần hoàn',
            systemTag: 'circulatory',
            aiText: 'Hai động mạch cảnh cung cấp ~80% máu cho não. Bạn có thể sờ thấy mạch đập ở hai bên cổ. Nếu bị tắc, não sẽ thiếu oxy và đột quỵ xảy ra chỉ trong vài phút!',
            functions: [
                { icon: '🧠', text: 'Cung cấp máu chính cho não bộ' },
                { icon: '👀', text: 'Nuôi dưỡng mắt, mặt và da đầu' },
                { icon: '📊', text: 'Chứa thụ thể áp suất điều hòa huyết áp' },
                { icon: '🔬', text: 'Có thể thể cảnh phát hiện O₂/CO₂ máu' }
            ],
            diseases: [
                { name: 'Xơ vữa ĐM cảnh', color: 'tag-orange' },
                { name: 'Hẹp ĐM cảnh', color: 'tag-red' },
                { name: 'Đột quỵ', color: 'tag-red' },
                { name: 'Phình ĐM cảnh', color: 'tag-purple' }
            ],
            actionBtn: '🔴 Đến Khoa Mạch Máu'
        },

        'arm-arteries': {
            icon: '🔴',
            name: 'Động Mạch Cánh Tay',
            system: 'Hệ tuần hoàn',
            systemTag: 'circulatory',
            aiText: 'Động mạch dưới đòn → động mạch nách → động mạch cánh tay cung cấp máu cho chi trên. Bạn đo huyết áp chính là ở động mạch cánh tay!',
            functions: [
                { icon: '🩸', text: 'Cung cấp máu giàu oxy cho tay' },
                { icon: '📊', text: 'Vị trí đo huyết áp chuẩn' },
                { icon: '🌡️', text: 'Điều hòa nhiệt qua co giãn mạch' },
                { icon: '💪', text: 'Nuôi dưỡng cơ-xương-da chi trên' }
            ],
            diseases: [
                { name: 'Tắc mạch chi trên', color: 'tag-red' },
                { name: 'Xơ vữa ĐM', color: 'tag-orange' },
                { name: 'H/c lối ra lồng ngực', color: 'tag-blue' }
            ],
            actionBtn: '🔴 Đến Khoa Mạch Máu'
        },

        iliac: {
            icon: '🔴',
            name: 'Động Mạch Chậu',
            system: 'Hệ tuần hoàn',
            systemTag: 'circulatory',
            aiText: 'Động mạch chậu phân nhánh từ ĐM chủ bụng, chia thành ĐM chậu trong (nuôi tạng vùng chậu) và ĐM chậu ngoài (→ ĐM đùi nuôi chân). Đây là "ngã tư" mạch máu quan trọng!',
            functions: [
                { icon: '🦵', text: 'Cung cấp máu cho chi dưới' },
                { icon: '🛡️', text: 'Nuôi dưỡng cơ quan vùng chậu' },
                { icon: '🩸', text: 'Phân phối máu cho thận và ruột' },
                { icon: '🔄', text: 'Duy trì tuần hoàn chi dưới' }
            ],
            diseases: [
                { name: 'Xơ vữa ĐM chậu', color: 'tag-orange' },
                { name: 'Phình ĐM chậu', color: 'tag-red' },
                { name: 'Bệnh mạch ngoại biên', color: 'tag-blue' }
            ],
            actionBtn: '🔴 Đến Khoa Mạch Máu'
        },

        venacava: {
            icon: '🔵',
            name: 'Tĩnh Mạch Chủ',
            system: 'Hệ tuần hoàn',
            systemTag: 'circulatory',
            aiText: 'Tĩnh mạch chủ trên và dưới là 2 tĩnh mạch lớn nhất cơ thể, đưa toàn bộ máu nghèo oxy từ cơ thể trở về tâm nhĩ phải. TM chủ dưới dài ~22cm, đường kính ~3cm!',
            functions: [
                { icon: '🔵', text: 'Thu hồi máu nghèo oxy về tim' },
                { icon: '🔄', text: 'Hoàn thành vòng tuần hoàn lớn' },
                { icon: '⬆️', text: 'Chống trọng lực đưa máu từ chân lên' },
                { icon: '📦', text: 'Chứa ~60-70% tổng lượng máu cơ thể' }
            ],
            diseases: [
                { name: 'Huyết khối TM sâu', color: 'tag-red' },
                { name: 'H/c TM chủ trên', color: 'tag-red' },
                { name: 'Suy TM mãn tính', color: 'tag-orange' }
            ],
            actionBtn: '🔵 Đến Khoa Tim Mạch'
        },

        'arm-veins': {
            icon: '🔵',
            name: 'Tĩnh Mạch Chi Trên',
            system: 'Hệ tuần hoàn',
            systemTag: 'circulatory',
            aiText: 'Các tĩnh mạch chi trên bao gồm TM đầu, TM nền và TM giữa khuỷu — nơi thường lấy máu xét nghiệm. Tĩnh mạch có van một chiều ngăn máu chảy ngược!',
            functions: [
                { icon: '🔵', text: 'Đưa máu nghèo oxy từ tay về tim' },
                { icon: '🚪', text: 'Chứa van một chiều ngăn máu chảy ngược' },
                { icon: '💉', text: 'Vị trí truyền dịch và lấy máu' },
                { icon: '🌡️', text: 'Điều hòa nhiệt qua co giãn mạch da' }
            ],
            diseases: [
                { name: 'Viêm TM nông', color: 'tag-orange' },
                { name: 'Huyết khối', color: 'tag-red' },
                { name: 'Giãn TM', color: 'tag-blue' }
            ],
            actionBtn: '🔵 Đến Khoa Mạch Máu'
        },

        'leg-veins': {
            icon: '🔵',
            name: 'Tĩnh Mạch Chi Dưới',
            system: 'Hệ tuần hoàn',
            systemTag: 'circulatory',
            aiText: 'Tĩnh mạch chân phải chống trọng lực để đưa máu lên tim! Van tĩnh mạch + cơ bắp chân (bơm cơ) giúp đẩy máu đi lên. Đứng lâu gây suy van → giãn TM chân.',
            functions: [
                { icon: '⬆️', text: 'Đẩy máu từ chân ngược lên tim' },
                { icon: '🚪', text: 'Van tĩnh mạch ngăn máu trào ngược' },
                { icon: '💪', text: 'Phối hợp "bơm cơ" cẳng chân' },
                { icon: '🔄', text: 'Duy trì lưu lượng tuần hoàn chi dưới' }
            ],
            diseases: [
                { name: 'Giãn TM chân', color: 'tag-blue' },
                { name: 'Huyết khối TM sâu', color: 'tag-red' },
                { name: 'Suy TM mãn', color: 'tag-orange' },
                { name: 'Loét TM', color: 'tag-purple' }
            ],
            actionBtn: '🔵 Đến Khoa Mạch Máu'
        },

        // ==================== NERVOUS SYSTEM ====================
        'spinal-cord': {
            icon: '⚡',
            name: 'Tủy Sống',
            system: 'Hệ thần kinh trung ương',
            systemTag: 'nervous',
            aiText: 'Tủy sống dài ~45cm, nằm trong ống sống, là "đường cao tốc" truyền tín hiệu giữa não và cơ thể. Tủy sống có thể tự tạo phản xạ mà không cần lệnh từ não — ví dụ rụt tay khi chạm nóng!',
            functions: [
                { icon: '📡', text: 'Truyền tín hiệu giữa não và cơ thể' },
                { icon: '⚡', text: 'Thực hiện phản xạ tủy tự động' },
                { icon: '🔄', text: 'Điều phối cử động tay chân' },
                { icon: '🌡️', text: 'Truyền cảm giác đau, nhiệt, xúc giác' }
            ],
            diseases: [
                { name: 'Chấn thương tủy', color: 'tag-red' },
                { name: 'Thoát vị đĩa đệm', color: 'tag-orange' },
                { name: 'Xơ cứng rải rác', color: 'tag-purple' },
                { name: 'Viêm tủy', color: 'tag-red' },
                { name: 'U tủy sống', color: 'tag-blue' }
            ],
            actionBtn: '⚡ Đến Khoa Thần Kinh'
        },

        'brachial-plexus': {
            icon: '⚡',
            name: 'Đám Rối Thần Kinh Cánh Tay',
            system: 'Hệ thần kinh ngoại biên',
            systemTag: 'nervous',
            aiText: 'Đám rối thần kinh cánh tay (brachial plexus) gồm các rễ C5-T1 bện lại, chi phối toàn bộ vận động và cảm giác chi trên. Tổn thương đám rối có thể gây liệt hoàn toàn cánh tay!',
            functions: [
                { icon: '💪', text: 'Điều khiển vận động cánh tay và bàn tay' },
                { icon: '✋', text: 'Truyền cảm giác từ chi trên về não' },
                { icon: '🦾', text: 'Chi phối co cơ vai, khuỷu, cổ tay' },
                { icon: '🤏', text: 'Điều khiển cử động tinh tế ngón tay' }
            ],
            diseases: [
                { name: 'Tổn thương đám rối', color: 'tag-red' },
                { name: 'Liệt Erb-Duchenne', color: 'tag-purple' },
                { name: 'H/c lối ra lồng ngực', color: 'tag-blue' },
                { name: 'Viêm dây TK', color: 'tag-orange' }
            ],
            actionBtn: '⚡ Đến Khoa Thần Kinh'
        },

        'intercostal-nerves': {
            icon: '⚡',
            name: 'Thần Kinh Liên Sườn',
            system: 'Hệ thần kinh ngoại biên',
            systemTag: 'nervous',
            aiText: 'Các dây thần kinh liên sườn (T1-T12) chạy dọc giữa các xương sườn, chi phối cơ liên sườn và cảm giác da ngực/bụng. Herpes zoster (zona) thường phát ban theo đường thần kinh liên sườn!',
            functions: [
                { icon: '🌬️', text: 'Điều khiển cơ liên sườn khi thở' },
                { icon: '✋', text: 'Truyền cảm giác da ngực và bụng' },
                { icon: '💪', text: 'Hỗ trợ co cơ thành bụng' },
                { icon: '🔄', text: 'Tham gia phản xạ bảo vệ lồng ngực' }
            ],
            diseases: [
                { name: 'Đau TK liên sườn', color: 'tag-orange' },
                { name: 'Zona (Herpes Zoster)', color: 'tag-red' },
                { name: 'Viêm dây TK', color: 'tag-blue' }
            ],
            actionBtn: '⚡ Đến Khoa Thần Kinh'
        },

        'lumbar-plexus': {
            icon: '⚡',
            name: 'Đám Rối Thắt Lưng',
            system: 'Hệ thần kinh ngoại biên',
            systemTag: 'nervous',
            aiText: 'Đám rối thắt lưng (L1-L4) tạo ra các dây TK đùi và TK bịt, chi phối vận động và cảm giác mặt trước và trong đùi. Tổn thương gây yếu cơ đùi và khó duỗi gối!',
            functions: [
                { icon: '🦵', text: 'Điều khiển cơ mặt trước đùi' },
                { icon: '✋', text: 'Truyền cảm giác đùi và bẹn' },
                { icon: '🚶', text: 'Hỗ trợ gấp hông và duỗi gối' },
                { icon: '⚡', text: 'Phối hợp phản xạ gối (gõ gối)' }
            ],
            diseases: [
                { name: 'Đau TK đùi', color: 'tag-orange' },
                { name: 'Thoát vị đĩa đệm', color: 'tag-red' },
                { name: 'Hẹp ống sống', color: 'tag-blue' }
            ],
            actionBtn: '⚡ Đến Khoa Thần Kinh'
        },

        'sciatic-nerve': {
            icon: '⚡',
            name: 'Dây Thần Kinh Tọa',
            system: 'Hệ thần kinh ngoại biên',
            systemTag: 'nervous',
            aiText: 'Dây TK tọa (sciatic) là dây thần kinh dài nhất và dày nhất cơ thể — dài gần 1m, đường kính bằng ngón tay út! Đau TK tọa gây đau lan từ mông xuống chân, ảnh hưởng ~40% dân số.',
            functions: [
                { icon: '🦵', text: 'Điều khiển cử động toàn bộ chân' },
                { icon: '✋', text: 'Truyền cảm giác mặt sau đùi, cẳng chân, bàn chân' },
                { icon: '🚶', text: 'Thiết yếu cho đi lại, đứng, ngồi' },
                { icon: '⚡', text: 'Phản xạ gân gót (Achilles)' }
            ],
            diseases: [
                { name: 'Đau TK tọa', color: 'tag-orange' },
                { name: 'Thoát vị đĩa đệm L4-S1', color: 'tag-red' },
                { name: 'Hội chứng cơ hình lê', color: 'tag-blue' },
                { name: 'Hẹp ống sống', color: 'tag-purple' }
            ],
            actionBtn: '⚡ Đến Khoa Thần Kinh'
        }
    };

    // ============================================================
    //  DOM ELEMENTS
    // ============================================================
    const svg = document.getElementById('human-body-svg');
    const infoTitle = document.getElementById('info-title');
    const infoContent = document.getElementById('info-content');
    const tooltip = document.getElementById('organ-tooltip');
    const tooltipText = document.getElementById('tooltip-text');
    const modelWrapper = document.getElementById('model-wrapper');
    const navBtns = document.querySelectorAll('.nav-btn');
    const legendItems = document.querySelectorAll('.legend-item');

    // Popup elements
    const popupOverlay = document.getElementById('popup-overlay');
    const popupModal = document.getElementById('popup-modal');
    const popupClose = document.getElementById('popup-close');
    const popupIcon = document.getElementById('popup-icon');
    const popupTitle = document.getElementById('popup-title');
    const popupSystemTag = document.getElementById('popup-system-tag');
    const popupAiText = document.getElementById('popup-ai-text');
    const popupFunctionsList = document.getElementById('popup-functions-list');
    const popupDiseasesTags = document.getElementById('popup-diseases-tags');
    const popupActionBtn = document.getElementById('popup-action-btn');

    let selectedPart = null;

    // ============================================================
    //  SYSTEM FILTER (Navigation)
    // ============================================================
    let currentSystem = 'all';

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const system = btn.dataset.system;
            currentSystem = system;
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            clearSelection();
            filterSystems(system);
        });
    });

    function filterSystems(system) {
        const systemLayers = document.querySelectorAll('.system-layer');
        if (system === 'all') {
            systemLayers.forEach(layer => {
                layer.classList.remove('hidden');
                layer.classList.add('active');
            });
        } else {
            systemLayers.forEach(layer => {
                const layerSystem = layer.dataset.system;
                if (system === layerSystem) {
                    layer.classList.remove('hidden');
                    layer.classList.add('active');
                } else {
                    layer.classList.add('hidden');
                    layer.classList.remove('active');
                }
            });
        }
    }

    // ============================================================
    //  INTERACTIVE PART INTERACTION (All systems)
    // ============================================================
    const interactiveParts = document.querySelectorAll('.interactive-part');

    interactiveParts.forEach(part => {
        // Hover → tooltip
        part.addEventListener('mouseenter', () => {
            const partId = part.dataset.part;
            const data = partData[partId];
            if (!data) return;
            tooltipText.textContent = data.name;
            tooltip.classList.add('visible');
        });

        part.addEventListener('mousemove', (e) => {
            const wrapperRect = modelWrapper.getBoundingClientRect();
            const x = e.clientX - wrapperRect.left + 15;
            const y = e.clientY - wrapperRect.top - 10;
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
        });

        part.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });

        // Click → select + open popup
        part.addEventListener('click', () => {
            const partId = part.dataset.part;
            selectPart(part, partId);
        });
    });

    function selectPart(element, partId) {
        // Clear previous selection
        clearSelection();

        // Set new selection
        selectedPart = element;
        element.classList.add('selected');

        // Update left panel
        const data = partData[partId];
        if (data) {
            showLeftPanelInfo(partId, data);
            openPopup(data);
        }
    }

    function clearSelection() {
        if (selectedPart) {
            selectedPart.classList.remove('selected');
            selectedPart = null;
        }
        interactiveParts.forEach(p => p.classList.remove('selected'));
    }

    function showLeftPanelInfo(partId, data) {
        if (!infoTitle || !infoContent) return;
        infoTitle.textContent = data.name;
        const detailHTML = `
            <div class="organ-detail">
                <h3>${data.icon} ${data.name}</h3>
                <div class="organ-name-vi">${data.system}</div>
                <p>${data.aiText}</p>
                <ul class="detail-list">
                    ${data.functions.map(f => `<li>${f.text}</li>`).join('')}
                </ul>
            </div>
        `;
        infoContent.innerHTML = detailHTML;
    }

    // ============================================================
    //  POPUP MODAL
    // ============================================================
    function openPopup(data) {
        if (!popupOverlay || !popupIcon || !popupTitle) return;
        // Fill popup content
        popupIcon.textContent = data.icon;
        popupTitle.textContent = data.name;
        popupSystemTag.textContent = data.system;
        popupAiText.textContent = data.aiText;

        // Functions list
        popupFunctionsList.innerHTML = data.functions.map(f => `
            <li>
                <span class="func-icon">${f.icon}</span>
                <span>${f.text}</span>
            </li>
        `).join('');

        // Disease tags
        popupDiseasesTags.innerHTML = data.diseases.map(d => `
            <span class="popup-tag ${d.color}">${d.name}</span>
        `).join('');

        // Action button
        popupActionBtn.innerHTML = `<span>${data.actionBtn.split(' ')[0]}</span> ${data.actionBtn.substring(data.actionBtn.indexOf(' ') + 1)}`;

        // Show popup
        popupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        if (!popupOverlay) return;
        popupOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (popupClose) popupClose.addEventListener('click', closePopup);

    if (popupOverlay) {
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) closePopup();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePopup();
    });

    if (popupActionBtn) {
        popupActionBtn.addEventListener('click', () => {
            closePopup();
        });
    }

    // ============================================================
    //  LEGEND INTERACTION
    // ============================================================
    legendItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;

            if (target.includes('-system')) {
                const systemId = target.replace('-system', '');
                navBtns.forEach(b => {
                    if (b.dataset.system === systemId) b.click();
                });
                return;
            }

            // It's a part
            const partEl = document.querySelector(`[data-part="${target}"]`);
            if (partEl) {
                selectPart(partEl, target);
            }
        });

        item.addEventListener('mouseenter', () => {
            const target = item.dataset.target;
            const partEl = document.querySelector(`[data-part="${target}"]`);
            if (partEl) partEl.classList.add('highlighted');
        });

        item.addEventListener('mouseleave', () => {
            const target = item.dataset.target;
            const partEl = document.querySelector(`[data-part="${target}"]`);
            if (partEl) partEl.classList.remove('highlighted');
        });
    });

    // ============================================================
    //  ZOOM CONTROLS
    // ============================================================
    let zoomLevel = 1;
    const ZOOM_STEP = 0.15;
    const ZOOM_MIN = 0.5;
    const ZOOM_MAX = 2.5;

    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');

    if (zoomInBtn) zoomInBtn.addEventListener('click', () => {
        zoomLevel = Math.min(ZOOM_MAX, zoomLevel + ZOOM_STEP);
        applyZoom();
    });

    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => {
        zoomLevel = Math.max(ZOOM_MIN, zoomLevel - ZOOM_STEP);
        applyZoom();
    });

    if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => {
        zoomLevel = 1;
        applyZoom();
    });

    function applyZoom() {
        if (modelWrapper) modelWrapper.style.transform = `scale(${zoomLevel})`;
    }

    if (modelWrapper) {
        modelWrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomLevel = Math.min(ZOOM_MAX, zoomLevel + ZOOM_STEP * 0.5);
            } else {
                zoomLevel = Math.max(ZOOM_MIN, zoomLevel - ZOOM_STEP * 0.5);
            }
            applyZoom();
        }, { passive: false });
    }

    // ============================================================
    //  PARTICLE BACKGROUND
    // ============================================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.3 + 0.05;
                this.hue = Math.random() > 0.5 ? 190 : 260;
                this.life = Math.random() * 400 + 200;
                this.maxLife = this.life;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life--;
                if (this.life <= 0 || this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
                    this.reset();
                }
            }
            draw() {
                const fadeRatio = this.life / this.maxLife;
                const alpha = this.opacity * fadeRatio;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${alpha})`;
                ctx.fill();
            }
        }

        function initParticles() {
            resizeCanvas();
            const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
            particles = [];
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.08;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
        window.addEventListener('resize', () => {
            resizeCanvas();
            if (particles.length === 0) initParticles();
        });
    }

    // ============================================================
    //  KEYBOARD SHORTCUTS
    // ============================================================
    document.addEventListener('keydown', (e) => {
        if (popupOverlay && popupOverlay.classList.contains('active') && e.key === 'Escape') return;
        switch (e.key) {
            case '1': navBtns[0]?.click(); break;
            case '2': navBtns[1]?.click(); break;
            case '3': navBtns[2]?.click(); break;
            case '4': navBtns[3]?.click(); break;
            case '5': navBtns[4]?.click(); break;
            case '+': case '=': document.getElementById('zoom-in')?.click(); break;
            case '-': document.getElementById('zoom-out')?.click(); break;
            case '0': document.getElementById('zoom-reset')?.click(); break;
        }
    });

    // ============================================================
    //  INITIAL STATE
    // ============================================================
    filterSystems('all');
    console.log('🧬 Human Anatomy 2D Model v2 loaded — all systems interactive!');
});

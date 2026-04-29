const fs = require('fs');

let content = fs.readFileSync('d:/Digital-BioHospital/frontend/reception.html', 'utf-8');

// Thêm field input-symptoms
content = content.replace(
  '                  ✅ Không có\n                </label>\n              </div>\n            </div>',
  `                  ✅ Không có
                </label>
              </div>
              <div class="form-group" style="margin-top:1.5rem">
                <label class="form-label" for="input-symptoms">Triệu chứng hiện tại (Chi tiết) <span class="required">*</span></label>
                <textarea id="input-symptoms" class="form-input" rows="3" placeholder="Ví dụ: Đau cơ sau khi chạy bộ, mệt mỏi, khó tiêu..." required></textarea>
              </div>
            </div>`
);

// Thêm logic get value
content = content.replace(
  `      const medHistory = Array.from(
        document.querySelectorAll('#medical-history-group input:checked')
      ).map(el => el.value).filter(v => v !== 'Không có');`,
  `      const medHistory = Array.from(
        document.querySelectorAll('#medical-history-group input:checked')
      ).map(el => el.value).filter(v => v !== 'Không có');

      const currentSymptoms = document.getElementById('input-symptoms').value.trim();
      if (!currentSymptoms) {
        showToast('Vui lòng mô tả chi tiết triệu chứng hiện tại', 'error');
        return;
      }`
);

// Lưu vào Object
content = content.replace(
  `        stressLevel: parseInt(document.getElementById('input-stress').value),
        smokingStatus: document.getElementById('input-smoking').value,
        alcoholStatus: document.getElementById('input-alcohol').value,
        medicalHistory: medHistory
      };`,
  `        stressLevel: parseInt(document.getElementById('input-stress').value),
        smokingStatus: document.getElementById('input-smoking').value,
        alcoholStatus: document.getElementById('input-alcohol').value,
        medicalHistory: medHistory,
        currentSymptoms: currentSymptoms
      };`
);

fs.writeFileSync('d:/Digital-BioHospital/frontend/reception.html', content, 'utf-8');

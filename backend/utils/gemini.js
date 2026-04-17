const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Gọi Gemini API với prompt và trả về text
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function askGemini(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Không thể kết nối AI, vui lòng thử lại sau.');
  }
}

/**
 * Gọi Gemini và parse JSON từ response
 * @param {string} prompt
 * @returns {Promise<object>}
 */
async function askGeminiJSON(prompt) {
  const fullPrompt = `${prompt}

QUAN TRỌNG: Chỉ trả về JSON hợp lệ, không có markdown, không có backtick, không có giải thích thêm.`;

  const text = await askGemini(fullPrompt);

  // Làm sạch response để parse JSON
  const cleaned = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Thử tìm JSON trong text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('AI trả về định dạng không hợp lệ');
  }
}

/**
 * Build system context cho các prompt y tế
 */
function buildMedicalContext(patientData) {
  return `Bạn là AI trợ lý y tế giáo dục của Bệnh Viện Sinh Học Thông Minh – Đồng Điệu Sống.
QUAN TRỌNG: Đây là hệ thống GIÁO DỤC, không phải chẩn đoán y tế thực sự.
Luôn nhắc người dùng gặp bác sĩ thực sự khi có vấn đề nghiêm trọng.
Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu, tích cực và động viên.

Thông tin bệnh nhân:
- Tên: ${patientData.name}
- Tuổi: ${patientData.age}, Giới tính: ${patientData.gender}
- Chiều cao: ${patientData.height}cm, Cân nặng: ${patientData.weight}kg
- BMI: ${patientData.bmi} (${patientData.bmiCategory})
- Giấc ngủ: ${patientData.sleepHours} giờ/đêm
- Vận động: ${patientData.exerciseDaysPerWeek} buổi/tuần
- Hút thuốc: ${patientData.smokingStatus}
- Uống rượu: ${patientData.alcoholStatus}
- Mức stress: ${patientData.stressLevel}/10
- Tiền sử: ${patientData.medicalHistory?.join(', ') || 'Không có'}`;
}

module.exports = { askGemini, askGeminiJSON, buildMedicalContext };

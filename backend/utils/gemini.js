const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  safetySettings 
});

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
    console.error('Gemini API Error details:', error);
    // Trả về thông báo lỗi chi tiết hơn từ Google để dễ fix
    throw new Error(`Lỗi AI: ${error.message || 'Không thể kết nối'}`);
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

  try {
    const text = await askGemini(fullPrompt);
    
    // Làm sạch response để parse JSON
    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (e) {
    // Thử tìm JSON trong text nếu parse trực tiếp thất bại
    try {
      const jsonMatch = e.message.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (innerIgnore) {}
    
    throw e; // Ném lỗi gốc ra ngoài để backend bắt được
  }
}

/**
 * Build system context cho các prompt y tế
 */
function buildMedicalContext(patientData) {
  // Đảm bảo medicalHistory luôn là string trước khi vào prompt
  const historyStr = Array.isArray(patientData.medicalHistory) 
    ? patientData.medicalHistory.join(', ') 
    : (typeof patientData.medicalHistory === 'string' ? patientData.medicalHistory : 'Không có');

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
- Tiền sử: ${historyStr}`;
}

module.exports = { askGemini, askGeminiJSON, buildMedicalContext };

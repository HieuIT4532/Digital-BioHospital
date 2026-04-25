const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// ── PDF source files ──────────────────────────────────────────────────────────
const PDF_DIR = path.join(__dirname, '..', '..'); // Digital BioHospital root

const PDF_MAP = {
  'tuần hoàn':  'H? Tu?n Ho�n.pdf',
  'hô hấp':     'H? H� H?p.pdf',
  'thần kinh':  'H? Th?n Kinh.pdf',
  'miễn dịch':  'H? Mi?n D?ch.pdf',
  'nội môi':    'C?n B?ng N?i M�i.pdf',
  'tiêu hóa':   'H? Ti�u Ho�.pdf',
};

// Cache: { system: { text, chunks } }
const knowledgeCache = {};
let isLoaded = false;

/**
 * Load all PDFs and Script TXTs into memory cache on first call
 */
async function loadAllPDFs() {
  if (isLoaded) return;

  // 1. Load PDFs
  const pdfFiles = fs.readdirSync(PDF_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
  for (const file of pdfFiles) {
    const fullPath = path.join(PDF_DIR, file);
    try {
      const buffer = fs.readFileSync(fullPath);
      const data = await pdfParse(buffer);
      const text = data.text.replace(/\s+/g, ' ').trim();

      const key = detectSystem(file);
      if (key) {
        if (!knowledgeCache[key]) knowledgeCache[key] = { text: '' };
        knowledgeCache[key].text += "\n" + text.slice(0, 10000);
        console.log(`📄 Loaded PDF: ${file} → system: ${key}`);
      }
    } catch (err) {
      console.warn(`⚠️ Could not parse PDF: ${file} – ${err.message}`);
    }
  }

  // 2. Load Script TXTs
  const txtFiles = fs.readdirSync(PDF_DIR).filter(f => f.toLowerCase().endsWith('.txt') && f.toLowerCase().includes('script'));
  for (const file of txtFiles) {
    const fullPath = path.join(PDF_DIR, file);
    try {
      const text = fs.readFileSync(fullPath, 'utf8').replace(/\s+/g, ' ').trim();
      
      // Scripts are comprehensive, add them to related systems or new ones
      const systems = ['di truyền', 'tế bào', 'tiến hóa', 'thần kinh', 'nội môi'];
      systems.forEach(sys => {
        if (text.toLowerCase().includes(sys)) {
          if (!knowledgeCache[sys]) knowledgeCache[sys] = { text: '' };
          knowledgeCache[sys].text += "\n" + text;
        }
      });
      console.log(`📝 Loaded Script: ${file}`);
    } catch (err) {
      console.warn(`⚠️ Could not read TXT: ${file} – ${err.message}`);
    }
  }

  isLoaded = true;
  console.log(`✅ Knowledge Base loaded: ${Object.keys(knowledgeCache).length} topics`);
}

function detectSystem(filename) {
  const f = filename.toLowerCase();
  if (f.includes('tuần hoàn') || (f.includes('tu') && f.includes('ho'))) return 'tuần hoàn';
  if (f.includes('hô hấp') || (f.includes('h') && f.includes('hấp')))   return 'hô hấp';
  if (f.includes('thần kinh') || (f.includes('th') && f.includes('kinh'))) return 'thần kinh';
  if (f.includes('miễn dịch') || (f.includes('mi') && f.includes('dịch'))) return 'miễn dịch';
  if (f.includes('nội môi') || f.includes('cân bằng') || f.includes('n?i')) return 'nội môi';
  if (f.includes('tiêu hóa') || (f.includes('ti') && f.includes('hoá')))   return 'tiêu hóa';
  return null;
}

/**
 * Find the most relevant PDF content for a question
 * @param {string} question
 * @returns {{ system: string, text: string } | null}
 */
function findRelevantKnowledge(question) {
  const q = question.toLowerCase();

  const SYSTEM_KEYWORDS = {
    'tuần hoàn':  ['tim', 'mạch', 'tuần hoàn', 'huyết áp', 'máu', 'nhịp tim', 'tâm thất', 'tâm nhĩ', 'động mạch', 'tĩnh mạch'],
    'hô hấp':     ['thở', 'hô hấp', 'phổi', 'oxy', 'o2', 'co2', 'phế nang', 'khí quản', 'thở ra', 'hít vào'],
    'thần kinh':  ['não', 'thần kinh', 'neuron', 'phản xạ', 'cung phản xạ', 'điện thế', 'synapse', 'axon', 'myelin'],
    'miễn dịch':  ['miễn dịch', 'kháng thể', 'tế bào b', 'tế bào t', 'vaccine', 'kháng nguyên', 'lympho', 'bạch cầu'],
    'nội môi':    ['nội môi', 'cân bằng', 'ph máu', 'nhiệt độ', 'glucose', 'homeostasis', 'feedback', 'insulin', 'hormone'],
    'tiêu hóa':   ['tiêu hóa', 'dạ dày', 'ruột', 'enzyme', 'amylase', 'lipase', 'gan', 'tụy', 'hấp thu', 'ăn'],
    'di truyền':  ['di truyền', 'gen', 'dna', 'adn', 'nst', 'nhiễm sắc thể', 'đột biến', 'ung thư', 'p53', 'di truyền học'],
    'tế bào':     ['tế bào', 'chu kỳ', 'nguyên phân', 'apoptosis', 'ti thể', 'atp', 'hô hấp tế bào', 'chu trình krebs', 'tế bào gốc'],
    'tiến hóa':   ['tiến hóa', 'nguồn gốc', 'linh trưởng', 'tinh tinh', 'homo sapiens', 'chọn lọc tự nhiên', 'foxp2'],
  };

  let bestMatch = null;
  let bestScore = 0;

  for (const [system, keywords] of Object.entries(SYSTEM_KEYWORDS)) {
    const score = keywords.filter(kw => q.includes(kw)).length;
    if (score > bestScore && knowledgeCache[system]) {
      bestScore = score;
      bestMatch = system;
    }
  }

  if (bestMatch && bestScore > 0) {
    return { system: bestMatch, text: knowledgeCache[bestMatch].text };
  }

  // Return all combined if no specific match
  const allText = Object.values(knowledgeCache).map(k => k.text.slice(0, 1500)).join('\n\n');
  return { system: 'tổng hợp', text: allText };
}

/**
 * Get all loaded systems list
 */
function getLoadedSystems() {
  return Object.keys(knowledgeCache);
}

/**
 * Get raw PDF text for a specific system key
 * @param {string} systemKey  e.g. 'tuần hoàn'
 * @returns {string|null}
 */
function getSystemText(systemKey) {
  if (knowledgeCache[systemKey]) {
    return knowledgeCache[systemKey].text;
  }
  return null;
}

module.exports = { loadAllPDFs, findRelevantKnowledge, getLoadedSystems, getSystemText };

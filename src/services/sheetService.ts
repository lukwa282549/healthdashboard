import { HealthRecord } from '../types';
import { DEFAULT_HEALTH_RECORDS } from '../data/defaultData';

export const SHEET_ID = '1HvxHQO8SydJC4CSXyGY-L8MardGD0ObK9xW6x7exmZk';

export interface FetchResult {
  data: HealthRecord[];
  isLive: boolean;
  lastUpdated: string;
  error?: string;
}

// Helper to parse CSV line respecting quotes
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function fetchSheetData(sheetId: string = SHEET_ID): Promise<FetchResult> {
  const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTimestamp = `${dateStr} เวลา ${now} น.`;

  // Construct URL with cache-buster
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&t=${Date.now()}`;

  try {
    const response = await fetch(csvUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv, text/plain, */*'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      throw new Error('Empty CSV response');
    }

    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      throw new Error('Not enough data rows in CSV');
    }

    // Column Header check
    // "รหัสบุคคล","วันที่คัดกรอง","พื้นที่","เพศ","อายุ","ส่วนสูง_cm","น้ำหนัก_kg","BMI","SBP_mmHg","DBP_mmHg","ชีพจร_bpm","น้ำตาล_mg_dL","สูบบุหรี่","ดื่มแอลกอฮอล์","การออกกำลังกาย","เบาหวาน_คัดกรอง","ความดันโลหิตสูง_คัดกรอง","คะแนนความเสี่ยง","ระดับความเสี่ยง","เดือน"
    const parsedRecords: HealthRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      if (cols.length < 5 || !cols[0]) continue;

      const id = cols[0].replace(/^"|"$/g, '');
      if (!id || !id.startsWith('H')) continue;

      const screeningDate = cols[1]?.replace(/^"|"$/g, '') || '';
      const area = cols[2]?.replace(/^"|"$/g, '') || 'เมือง';
      const gender = cols[3]?.replace(/^"|"$/g, '') || 'หญิง';
      const age = parseFloat(cols[4]) || 0;
      const height = parseFloat(cols[5]) || 0;
      const weight = parseFloat(cols[6]) || 0;
      const bmi = parseFloat(cols[7]) || (height > 0 ? parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1)) : 0);
      const sbp = parseFloat(cols[8]) || 0;
      const dbp = parseFloat(cols[9]) || 0;
      const pulse = parseFloat(cols[10]) || 0;
      const glucose = parseFloat(cols[11]) || 0;
      const smoking = cols[12]?.replace(/^"|"$/g, '') || 'ไม่สูบ';
      const alcohol = cols[13]?.replace(/^"|"$/g, '') || 'ไม่ดื่ม';
      const exercise = cols[14]?.replace(/^"|"$/g, '') || 'สม่ำเสมอ';
      const diabetesRisk = cols[15]?.replace(/^"|"$/g, '') || 'ไม่มี';
      const hypertensionRisk = cols[16]?.replace(/^"|"$/g, '') || 'ไม่มี';
      const riskScore = parseFloat(cols[17]) || 0;
      const riskLevel = cols[18]?.replace(/^"|"$/g, '') || 'ต่ำ';
      const month = cols[19]?.replace(/^"|"$/g, '') || '2026-01';

      parsedRecords.push({
        id,
        screeningDate,
        area,
        gender,
        age,
        height,
        weight,
        bmi,
        sbp,
        dbp,
        pulse,
        glucose,
        smoking,
        alcohol,
        exercise,
        diabetesRisk,
        hypertensionRisk,
        riskScore,
        riskLevel,
        month
      });
    }

    if (parsedRecords.length > 0) {
      return {
        data: parsedRecords,
        isLive: true,
        lastUpdated: formattedTimestamp
      };
    } else {
      throw new Error('No valid records parsed');
    }
  } catch (err: any) {
    console.warn('Live Google Sheet fetch failed or blocked by CORS, using local synchronized copy:', err);
    return {
      data: DEFAULT_HEALTH_RECORDS,
      isLive: false,
      lastUpdated: `${formattedTimestamp} (ข้อมูลออฟไลน์สำรอง)`,
      error: err?.message || 'เชื่อมต่อออนไลน์ไม่สำเร็จ ใช้งานสำรองข้อมูลล่าสุด'
    };
  }
}

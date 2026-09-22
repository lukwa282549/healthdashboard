export interface HealthRecord {
  id: string; // รหัสบุคคล เช่น H0001
  screeningDate: string; // วันที่คัดกรอง เช่น 3/1/2026
  area: string; // พื้นที่ เช่น เมือง, เหนือ, ใต้, ตะวันออก, ตะวันตก
  gender: 'ชาย' | 'หญิง' | string; // เพศ
  age: number; // อายุ
  height: number; // ส่วนสูง_cm
  weight: number; // น้ำหนัก_kg
  bmi: number; // BMI
  sbp: number; // SBP_mmHg
  dbp: number; // DBP_mmHg
  pulse: number; // ชีพจร_bpm
  glucose: number; // น้ำตาล_mg_dL
  smoking: 'สูบ' | 'ไม่สูบ' | string; // สูบบุหรี่
  alcohol: 'ดื่ม' | 'ไม่ดื่ม' | string; // ดื่มแอลกอฮอล์
  exercise: 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย' | string; // การออกกำลังกาย
  diabetesRisk: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string; // เบาหวาน_คัดกรอง
  hypertensionRisk: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string; // ความดันโลหิตสูง_คัดกรอง
  riskScore: number; // คะแนนความเสี่ยง (0-7+)
  riskLevel: 'ต่ำ' | 'ปานกลาง' | 'สูง' | string; // ระดับความเสี่ยง
  month: string; // เดือน เช่น 2026-01, 2026-02, 2026-03
}

export interface FilterState {
  area: string;
  gender: string;
  riskLevel: string;
  month: string;
  searchQuery: string;
  urgentOnly: boolean;
}

export interface KpiSummary {
  totalCount: number;
  // ค่าเฉลี่ย
  avgBmi: number;
  avgGlucose: number;
  avgSbp: number;
  avgDbp: number;
  avgRiskScore: number;
  // ค่าต่ำสุด
  minGlucose: number;
  minBmi: number;
  minSbp: number;
  // ค่าสูงสุด
  maxGlucose: number;
  maxBmi: number;
  maxSbp: number;
  // สัดส่วน
  highRiskCount: number;
  moderateRiskCount: number;
  lowRiskCount: number;
  diabetesRiskCount: number;
  hypertensionRiskCount: number;
  // ร้อยละ
  highRiskPct: number;
  diabetesRiskPct: number;
  hypertensionRiskPct: number;
  smokingPct: number;
  alcoholPct: number;
  noExercisePct: number;
}

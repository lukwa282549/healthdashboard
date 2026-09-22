import { HealthRecord, KpiSummary } from '../types';

export function calculateKpis(records: HealthRecord[]): KpiSummary {
  const total = records.length;
  if (total === 0) {
    return {
      totalCount: 0,
      avgBmi: 0,
      avgGlucose: 0,
      avgSbp: 0,
      avgDbp: 0,
      avgRiskScore: 0,
      minGlucose: 0,
      minBmi: 0,
      minSbp: 0,
      maxGlucose: 0,
      maxBmi: 0,
      maxSbp: 0,
      highRiskCount: 0,
      moderateRiskCount: 0,
      lowRiskCount: 0,
      diabetesRiskCount: 0,
      hypertensionRiskCount: 0,
      highRiskPct: 0,
      diabetesRiskPct: 0,
      hypertensionRiskPct: 0,
      smokingPct: 0,
      alcoholPct: 0,
      noExercisePct: 0
    };
  }

  let sumBmi = 0;
  let sumGlucose = 0;
  let sumSbp = 0;
  let sumDbp = 0;
  let sumRiskScore = 0;

  let minGlucose = Infinity;
  let minBmi = Infinity;
  let minSbp = Infinity;

  let maxGlucose = -Infinity;
  let maxBmi = -Infinity;
  let maxSbp = -Infinity;

  let highRiskCount = 0;
  let moderateRiskCount = 0;
  let lowRiskCount = 0;

  let diabetesRiskCount = 0;
  let hypertensionRiskCount = 0;

  let smokingCount = 0;
  let alcoholCount = 0;
  let noExerciseCount = 0;

  for (const r of records) {
    sumBmi += r.bmi;
    sumGlucose += r.glucose;
    sumSbp += r.sbp;
    sumDbp += r.dbp;
    sumRiskScore += r.riskScore;

    if (r.glucose < minGlucose) minGlucose = r.glucose;
    if (r.glucose > maxGlucose) maxGlucose = r.glucose;

    if (r.bmi < minBmi) minBmi = r.bmi;
    if (r.bmi > maxBmi) maxBmi = r.bmi;

    if (r.sbp < minSbp) minSbp = r.sbp;
    if (r.sbp > maxSbp) maxSbp = r.sbp;

    if (r.riskLevel === 'สูง') highRiskCount++;
    else if (r.riskLevel === 'ปานกลาง') moderateRiskCount++;
    else lowRiskCount++;

    if (r.diabetesRisk.includes('มีแนวโน้ม') || r.diabetesRisk.includes('เสี่ยง') || r.glucose >= 126) {
      diabetesRiskCount++;
    }

    if (r.hypertensionRisk.includes('มีแนวโน้ม') || r.hypertensionRisk.includes('เสี่ยง') || r.sbp >= 140 || r.dbp >= 90) {
      hypertensionRiskCount++;
    }

    if (r.smoking === 'สูบ') smokingCount++;
    if (r.alcohol === 'ดื่ม') alcoholCount++;
    if (r.exercise === 'ไม่ออกกำลังกาย') noExerciseCount++;
  }

  return {
    totalCount: total,
    avgBmi: parseFloat((sumBmi / total).toFixed(1)),
    avgGlucose: parseFloat((sumGlucose / total).toFixed(1)),
    avgSbp: parseFloat((sumSbp / total).toFixed(1)),
    avgDbp: parseFloat((sumDbp / total).toFixed(1)),
    avgRiskScore: parseFloat((sumRiskScore / total).toFixed(1)),
    minGlucose: minGlucose === Infinity ? 0 : minGlucose,
    minBmi: minBmi === Infinity ? 0 : minBmi,
    minSbp: minSbp === Infinity ? 0 : minSbp,
    maxGlucose: maxGlucose === -Infinity ? 0 : maxGlucose,
    maxBmi: maxBmi === -Infinity ? 0 : maxBmi,
    maxSbp: maxSbp === -Infinity ? 0 : maxSbp,
    highRiskCount,
    moderateRiskCount,
    lowRiskCount,
    diabetesRiskCount,
    hypertensionRiskCount,
    highRiskPct: parseFloat(((highRiskCount / total) * 100).toFixed(1)),
    diabetesRiskPct: parseFloat(((diabetesRiskCount / total) * 100).toFixed(1)),
    hypertensionRiskPct: parseFloat(((hypertensionRiskCount / total) * 100).toFixed(1)),
    smokingPct: parseFloat(((smokingCount / total) * 100).toFixed(1)),
    alcoholPct: parseFloat(((alcoholCount / total) * 100).toFixed(1)),
    noExercisePct: parseFloat(((noExerciseCount / total) * 100).toFixed(1))
  };
}

// Age Group helper
export function getAgeGroup(age: number): string {
  if (age < 30) return '< 30 ปี';
  if (age <= 45) return '30 - 45 ปี';
  if (age <= 60) return '46 - 60 ปี';
  return '> 60 ปี';
}

// Color coding helpers
export function getRiskLevelColor(level: string) {
  switch (level) {
    case 'สูง':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        fill: '#f43f5e'
      };
    case 'ปานกลาง':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        fill: '#f59e0b'
      };
    case 'ต่ำ':
    default:
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        fill: '#10b981'
      };
  }
}

export function getGlucoseBadge(glucose: number) {
  if (glucose >= 126) {
    return { label: 'เสี่ยงเบาหวาน (≥126)', color: 'text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200' };
  }
  if (glucose >= 100) {
    return { label: 'เฝ้าระวัง (100-125)', color: 'text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200' };
  }
  return { label: 'ปกติ (<100)', color: 'text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200' };
}

export function getBpBadge(sbp: number, dbp: number) {
  if (sbp >= 140 || dbp >= 90) {
    return { label: 'ความดันสูง (≥140/90)', color: 'text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200' };
  }
  if (sbp >= 120 || dbp >= 80) {
    return { label: 'เริ่มสูง (120-139)', color: 'text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200' };
  }
  return { label: 'ปกติ (<120/80)', color: 'text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200' };
}

export function getBmiBadge(bmi: number) {
  if (bmi >= 30) {
    return { label: 'อ้วนระดับ 2 (≥30)', color: 'text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200' };
  }
  if (bmi >= 25) {
    return { label: 'อ้วนระดับ 1 / ท้วม (25-29.9)', color: 'text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200' };
  }
  if (bmi >= 23) {
    return { label: 'น้ำหนักเกิน (23-24.9)', color: 'text-yellow-600 font-medium bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200' };
  }
  if (bmi >= 18.5) {
    return { label: 'สมส่วนปกติ (18.5-22.9)', color: 'text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200' };
  }
  return { label: 'ผอม (<18.5)', color: 'text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-200' };
}

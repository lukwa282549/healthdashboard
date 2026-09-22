import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { ShieldAlert, Activity, HeartCrack, UserCheck } from 'lucide-react';
import { HealthRecord } from '../types';
import { getAgeGroup } from '../utils/healthCalculations';

interface RiskAnalysisProps {
  records: HealthRecord[];
}

const RISK_COLORS: Record<string, string> = {
  'ต่ำ': '#10b981', // emerald
  'ปานกลาง': '#f59e0b', // amber
  'สูง': '#ef4444' // red
};

export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ records }) => {
  // 1. ระดับความเสี่ยง (Donut)
  const riskCounts = records.reduce((acc, r) => {
    acc[r.riskLevel] = (acc[r.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskData = [
    { name: 'ต่ำ', value: riskCounts['ต่ำ'] || 0, color: RISK_COLORS['ต่ำ'] },
    { name: 'ปานกลาง', value: riskCounts['ปานกลาง'] || 0, color: RISK_COLORS['ปานกลาง'] },
    { name: 'สูง', value: riskCounts['สูง'] || 0, color: RISK_COLORS['สูง'] }
  ];

  // 2. คะแนนความเสี่ยง (Risk Score 0 - 7)
  const scoreCounts = [0, 1, 2, 3, 4, 5, 6, 7].map(score => {
    const count = records.filter(r => r.riskScore === score).length;
    return {
      score: `คะแนน ${score}`,
      count,
      color: score <= 1 ? '#10b981' : score <= 3 ? '#f59e0b' : '#ef4444'
    };
  });

  // 3. คัดกรองเบาหวาน & ความดันโลหิตสูง
  const diabetesRiskCount = records.filter(
    r => r.diabetesRisk.includes('มีแนวโน้ม') || r.diabetesRisk.includes('เสี่ยง') || r.glucose >= 126
  ).length;
  const diabetesNormalCount = records.length - diabetesRiskCount;

  const htRiskCount = records.filter(
    r => r.hypertensionRisk.includes('มีแนวโน้ม') || r.hypertensionRisk.includes('เสี่ยง') || r.sbp >= 140
  ).length;
  const htNormalCount = records.length - htRiskCount;

  const screeningComparisonData = [
    {
      name: 'คัดกรองเบาหวาน (DM)',
      'ปกติ/ไม่มีแนวโน้ม': diabetesNormalCount,
      'มีแนวโน้ม/เสี่ยง': diabetesRiskCount
    },
    {
      name: 'คัดกรองความดันสูง (HT)',
      'ปกติ/ไม่มีแนวโน้ม': htNormalCount,
      'มีแนวโน้ม/เสี่ยง': htRiskCount
    }
  ];

  // 4. กลุ่มอายุที่มีความเสี่ยงสูง (Age Group vs Risk Level)
  const ageBrackets = ['< 30 ปี', '30 - 45 ปี', '46 - 60 ปี', '> 60 ปี'];
  const ageRiskData = ageBrackets.map(bracket => {
    const subset = records.filter(r => getAgeGroup(r.age) === bracket);
    return {
      bracket,
      'ต่ำ': subset.filter(r => r.riskLevel === 'ต่ำ').length,
      'ปานกลาง': subset.filter(r => r.riskLevel === 'ปานกลาง').length,
      'สูง': subset.filter(r => r.riskLevel === 'สูง').length,
      total: subset.length
    };
  });

  return (
    <div id="risk-analysis-container" className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-blue-600 to-sky-500" />
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            การวิเคราะห์ความเสี่ยงสุขภาพ (Health Risk Analytics)
          </h3>
          <p className="text-xs text-slate-500">
            วิเคราะห์ 4 ปัจจัยหลัก: ระดับความเสี่ยง, คะแนนความเสี่ยง, คัดกรองเบาหวาน, คัดกรองความดันโลหิต และการกระจายตามกลุ่มอายุ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: สัดส่วนระดับความเสี่ยง (Donut) */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-slate-800">
                1. สัดส่วนระดับความเสี่ยงรวม (Health Risk Level)
              </span>
            </div>
            <span className="text-xs text-slate-400">ต่ำ / ปานกลาง / สูง</span>
          </div>

          <div className="h-64 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} คน`, 'จำนวน']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-50 text-center text-xs">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-800 font-medium">
              <p className="text-[11px] text-slate-500">เสี่ยงต่ำ</p>
              <p className="text-base font-bold">{riskCounts['ต่ำ'] || 0} คน</p>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800 font-medium">
              <p className="text-[11px] text-slate-500">ปานกลาง</p>
              <p className="text-base font-bold">{riskCounts['ปานกลาง'] || 0} คน</p>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-800 font-medium">
              <p className="text-[11px] text-slate-500">เสี่ยงสูง</p>
              <p className="text-base font-bold">{riskCounts['สูง'] || 0} คน</p>
            </div>
          </div>
        </div>

        {/* Chart 2: การกระจายตัวของคะแนนความเสี่ยง (Risk Score 0-7) */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-slate-800">
                2. การกระจายของคะแนนความเสี่ยง (Risk Score Distribution)
              </span>
            </div>
            <span className="text-xs text-slate-400">เกณฑ์ 0 - 7 คะแนน</span>
          </div>

          <div className="h-64 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="score" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`${value} คน`, 'จำนวนผู้รับการคัดกรอง']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {scoreCounts.map((entry, index) => (
                    <Cell key={`score-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 text-center mt-2 pt-2 border-t border-slate-50">
            *คะแนน 0-1 (เสี่ยงต่ำ สีเขียว) | 2-3 (เสี่ยงปานกลาง สีเหลือง) | 4-7 (เสี่ยงสูง สีแดง)
          </p>
        </div>

        {/* Chart 3: เปรียบเทียบผลคัดกรองเบาหวาน & ความดันโลหิตสูง */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HeartCrack className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-slate-800">
                3. สัดส่วนคัดกรองเบาหวาน vs ความดันโลหิตสูง
              </span>
            </div>
            <span className="text-xs text-slate-400">เปรียบเทียบ 2 โรคหลัก</span>
          </div>

          <div className="h-64 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={screeningComparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} คน`, name]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="ปกติ/ไม่มีแนวโน้ม" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="มีแนวโน้ม/เสี่ยง" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-600 mt-2 pt-2 border-t border-slate-50 px-2">
            <span>เสี่ยงเบาหวาน: <strong className="text-rose-600">{diabetesRiskCount} คน</strong></span>
            <span>เสี่ยงความดัน: <strong className="text-rose-600">{htRiskCount} คน</strong></span>
          </div>
        </div>

        {/* Chart 4: กลุ่มอายุที่มีความเสี่ยงสูง (Age Group vs Risk) */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-slate-800">
                4. กลุ่มอายุที่มีความเสี่ยงสูง (Age Groups by Risk)
              </span>
            </div>
            <span className="text-xs text-slate-400">จำแนกตามช่วงวัย</span>
          </div>

          <div className="h-64 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageRiskData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bracket" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} คน`, `เสี่ยง${name}`]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="ต่ำ" stackId="a" fill="#0ea5e9" />
                <Bar dataKey="ปานกลาง" stackId="a" fill="#f59e0b" />
                <Bar dataKey="สูง" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 text-center mt-2 pt-2 border-t border-slate-50">
            *ช่วงอายุ 46 ปีขึ้นไปมีสัดส่วนกลุ่มเสี่ยงสูงและปานกลางเพิ่มขึ้นอย่างมีนัยสำคัญ
          </p>
        </div>
      </div>
    </div>
  );
};

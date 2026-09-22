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
import { Cigarette, Wine, Dumbbell, Flame, CheckCircle, AlertCircle } from 'lucide-react';
import { HealthRecord } from '../types';

interface BehaviorAnalysisProps {
  records: HealthRecord[];
}

export const BehaviorAnalysis: React.FC<BehaviorAnalysisProps> = ({ records }) => {
  const total = records.length || 1;

  // 1. สูบบุหรี่
  const smokerCount = records.filter(r => r.smoking === 'สูบ').length;
  const nonSmokerCount = total - smokerCount;
  const smokingData = [
    { name: 'ไม่สูบบุหรี่', value: nonSmokerCount, color: '#10b981' },
    { name: 'สูบบุหรี่', value: smokerCount, color: '#f43f5e' }
  ];

  // 2. ดื่มแอลกอฮอล์
  const drinkerCount = records.filter(r => r.alcohol === 'ดื่ม').length;
  const nonDrinkerCount = total - drinkerCount;
  const alcoholData = [
    { name: 'ไม่ดื่มแอลกอฮอล์', value: nonDrinkerCount, color: '#10b981' },
    { name: 'ดื่มแอลกอฮอล์', value: drinkerCount, color: '#f59e0b' }
  ];

  // 3. การออกกำลังกาย
  const exerciseRegular = records.filter(r => r.exercise === 'สม่ำเสมอ').length;
  const exerciseSometimes = records.filter(r => r.exercise === 'บางครั้ง').length;
  const exerciseNone = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย').length;
  const exerciseData = [
    { name: 'สม่ำเสมอ', value: exerciseRegular, color: '#10b981' },
    { name: 'บางครั้ง', value: exerciseSometimes, color: '#38bdf8' },
    { name: 'ไม่ออกกำลังกาย', value: exerciseNone, color: '#f43f5e' }
  ];

  // 4. พฤติกรรมกับระดับความเสี่ยง (Exercise vs Risk Level Stacked)
  const exerciseRiskMatrix = [
    {
      category: 'ออกกำลังกายสม่ำเสมอ',
      'เสี่ยงต่ำ': records.filter(r => r.exercise === 'สม่ำเสมอ' && r.riskLevel === 'ต่ำ').length,
      'เสี่ยงปานกลาง': records.filter(r => r.exercise === 'สม่ำเสมอ' && r.riskLevel === 'ปานกลาง').length,
      'เสี่ยงสูง': records.filter(r => r.exercise === 'สม่ำเสมอ' && r.riskLevel === 'สูง').length,
    },
    {
      category: 'ออกกำลังกายบางครั้ง',
      'เสี่ยงต่ำ': records.filter(r => r.exercise === 'บางครั้ง' && r.riskLevel === 'ต่ำ').length,
      'เสี่ยงปานกลาง': records.filter(r => r.exercise === 'บางครั้ง' && r.riskLevel === 'ปานกลาง').length,
      'เสี่ยงสูง': records.filter(r => r.exercise === 'บางครั้ง' && r.riskLevel === 'สูง').length,
    },
    {
      category: 'ไม่ออกกำลังกาย',
      'เสี่ยงต่ำ': records.filter(r => r.exercise === 'ไม่ออกกำลังกาย' && r.riskLevel === 'ต่ำ').length,
      'เสี่ยงปานกลาง': records.filter(r => r.exercise === 'ไม่ออกกำลังกาย' && r.riskLevel === 'ปานกลาง').length,
      'เสี่ยงสูง': records.filter(r => r.exercise === 'ไม่ออกกำลังกาย' && r.riskLevel === 'สูง').length,
    }
  ];

  // Multi-risk factor analysis: สูบ + ดื่ม + ไม่ออกกำลังกาย
  const combinedRiskCount = records.filter(
    r => r.smoking === 'สูบ' && r.alcohol === 'ดื่ม' && r.exercise === 'ไม่ออกกำลังกาย'
  ).length;

  return (
    <div id="behavior-analysis-container" className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-blue-600 to-sky-500" />
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            การวิเคราะห์พฤติกรรมสุขภาพ (Health Behaviors Analysis)
          </h3>
          <p className="text-xs text-slate-500">
            วิเคราะห์ 4 ปัจจัยพฤติกรรม: สูบบุหรี่, ดื่มสุรา, การออกกำลังกาย และความสัมพันธ์ต่อระดับความเสี่ยงสุขภาพ
          </p>
        </div>
      </div>

      {/* Behavioral Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Smoking Card */}
        <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Cigarette className="w-3.5 h-3.5 text-rose-500" /> พฤติกรรมการสูบบุหรี่
            </span>
            <p className="text-2xl font-bold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
              {((smokerCount / total) * 100).toFixed(1)}%
            </p>
            <p className="text-[11px] text-slate-500">
              สูบ {smokerCount} คน / ไม่สูบ {nonSmokerCount} คน
            </p>
          </div>
          <div className="h-16 w-16">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={smokingData} innerRadius={18} outerRadius={28} dataKey="value" stroke="none">
                  {smokingData.map((e, idx) => (
                    <Cell key={`smk-${idx}`} fill={e.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alcohol Card */}
        <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Wine className="w-3.5 h-3.5 text-amber-500" /> พฤติกรรมการดื่มสุรา
            </span>
            <p className="text-2xl font-bold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
              {((drinkerCount / total) * 100).toFixed(1)}%
            </p>
            <p className="text-[11px] text-slate-500">
              ดื่ม {drinkerCount} คน / ไม่ดื่ม {nonDrinkerCount} คน
            </p>
          </div>
          <div className="h-16 w-16">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={alcoholData} innerRadius={18} outerRadius={28} dataKey="value" stroke="none">
                  {alcoholData.map((e, idx) => (
                    <Cell key={`alc-${idx}`} fill={e.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Combined Behavior Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-600" /> พฤติกรรมเสี่ยงรวม 3 ด้าน
            </span>
            <p className="text-2xl font-bold text-rose-950 font-['Plus_Jakarta_Sans',sans-serif]">
              {combinedRiskCount} <span className="text-xs font-normal text-rose-700">คน</span>
            </p>
            <p className="text-[11px] text-rose-700">
              (สูบ + ดื่ม + ไม่ออกกำลังกาย) เสี่ยงสูง 100%
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: ระดับการออกกำลังกาย */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-slate-800">
                สัดส่วนความถี่ในการออกกำลังกาย (Physical Activity)
              </span>
            </div>
            <span className="text-xs text-slate-400">3 กลุ่มพฤติกรรม</span>
          </div>

          <div className="h-64 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={exerciseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {exerciseData.map((entry, index) => (
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
            <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
              <p className="text-[11px] text-slate-500">สม่ำเสมอ</p>
              <p className="text-sm font-bold">{exerciseRegular} คน</p>
            </div>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-800">
              <p className="text-[11px] text-slate-500">บางครั้ง</p>
              <p className="text-sm font-bold">{exerciseSometimes} คน</p>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-800">
              <p className="text-[11px] text-slate-500">ไม่ออกกำลังกาย</p>
              <p className="text-sm font-bold">{exerciseNone} คน</p>
            </div>
          </div>
        </div>

        {/* Chart 2: พฤติกรรมเทียบกับระดับความเสี่ยง (Behavior vs Risk Matrix) */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-slate-800">
                พฤติกรรมการออกกำลังกายกับระดับความเสี่ยงสุขภาพ
              </span>
            </div>
            <span className="text-xs text-slate-400">Cross Matrix</span>
          </div>

          <div className="h-64 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exerciseRiskMatrix} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} คน`, name]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="เสี่ยงต่ำ" fill="#0ea5e9" radius={[2, 2, 0, 0]} />
                <Bar dataKey="เสี่ยงปานกลาง" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                <Bar dataKey="เสี่ยงสูง" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 text-xs text-slate-600 mt-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>ข้อค้นพบ:</strong> กลุ่มที่ออกกำลังกายสม่ำเสมอเป็นกลุ่มเสี่ยงต่ำ 100% ขณะที่กลุ่มไม่ออกกำลังกายเป็นกลุ่มเสี่ยงสูง 100%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ReferenceLine,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { TrendingUp, GitFork, MapPin, Gauge } from 'lucide-react';
import { HealthRecord } from '../types';

interface TrendAndCorrelationProps {
  records: HealthRecord[];
}

export const TrendAndCorrelation: React.FC<TrendAndCorrelationProps> = ({ records }) => {
  // 1. Health Trends รายเดือน (2026-01, 2026-02, 2026-03)
  const months = ['2026-01', '2026-02', '2026-03'];
  const trendData = months.map(m => {
    const monthRecords = records.filter(r => r.month === m);
    const count = monthRecords.length || 1;
    const avgGlucose = (monthRecords.reduce((acc, r) => acc + r.glucose, 0) / count).toFixed(1);
    const avgSbp = (monthRecords.reduce((acc, r) => acc + r.sbp, 0) / count).toFixed(1);
    const avgDbp = (monthRecords.reduce((acc, r) => acc + r.dbp, 0) / count).toFixed(1);
    const avgRiskScore = (monthRecords.reduce((acc, r) => acc + r.riskScore, 0) / count).toFixed(1);
    const monthName = m === '2026-01' ? 'ม.ค. 2026' : m === '2026-02' ? 'ก.พ. 2026' : 'มี.ค. 2026';

    return {
      monthKey: m,
      monthName,
      'ระดับน้ำตาลเฉลี่ย (mg/dL)': parseFloat(avgGlucose),
      'ความดัน SBP เฉลี่ย (mmHg)': parseFloat(avgSbp),
      'ความดัน DBP เฉลี่ย (mmHg)': parseFloat(avgDbp),
      'คะแนนความเสี่ยงเฉลี่ย': parseFloat(avgRiskScore),
      sampleCount: monthRecords.length
    };
  });

  // 2. Correlation: BMI vs Glucose (Scatter)
  const bmiGlucoseData = records.map(r => ({
    id: r.id,
    bmi: r.bmi,
    glucose: r.glucose,
    riskLevel: r.riskLevel,
    age: r.age,
    area: r.area
  }));

  // 3. Correlation: BMI vs SBP (Scatter)
  const bmiSbpData = records.map(r => ({
    id: r.id,
    bmi: r.bmi,
    sbp: r.sbp,
    dbp: r.dbp,
    riskLevel: r.riskLevel,
    age: r.age,
    area: r.area
  }));

  // 4. พื้นที่ที่มีผู้เสี่ยงสูง (Area with High Risk Breakdown)
  const uniqueAreas = ['เมือง', 'เหนือ', 'ใต้', 'ตะวันออก', 'ตะวันตก'];
  const areaRiskData = uniqueAreas.map(area => {
    const areaRecords = records.filter(r => r.area === area);
    const highRisk = areaRecords.filter(r => r.riskLevel === 'สูง').length;
    const moderateRisk = areaRecords.filter(r => r.riskLevel === 'ปานกลาง').length;
    const lowRisk = areaRecords.filter(r => r.riskLevel === 'ต่ำ').length;
    const highRiskPct = areaRecords.length > 0 ? ((highRisk / areaRecords.length) * 100).toFixed(0) : '0';

    return {
      area,
      'เสี่ยงสูง': highRisk,
      'เสี่ยงปานกลาง': moderateRisk,
      'เสี่ยงต่ำ': lowRisk,
      total: areaRecords.length,
      highRiskPct: parseFloat(highRiskPct)
    };
  });

  return (
    <div id="trend-correlation-container" className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-blue-600 to-sky-500" />
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            แนวโน้มและความสัมพันธ์เชิงลึก (Trends & Correlations)
          </h3>
          <p className="text-xs text-slate-500">
            วิเคราะห์แนวโน้มสุขภาพรายเดือน ความสัมพันธ์ BMI กับน้ำตาล/ความดัน และการแจกแจงตามเขตพื้นที่
          </p>
        </div>
      </div>

      {/* 1. Monthly Trend Line Chart */}
      <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-semibold text-slate-800">
              แนวโน้มสุขภาพรายเดือน (Monthly Health Trends: ม.ค. - มี.ค. 2026)
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 font-medium">
            3 ตัวชี้วัด: น้ำตาลในเลือด, ความดัน SBP, คะแนนความเสี่ยง
          </span>
        </div>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="monthName" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" domain={[60, 160]} tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 6]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="ระดับน้ำตาลเฉลี่ย (mg/dL)"
                stroke="#0284c7"
                strokeWidth={3}
                dot={{ r: 5, fill: '#0284c7' }}
                activeDot={{ r: 7 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="ความดัน SBP เฉลี่ย (mmHg)"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 5, fill: '#38bdf8' }}
                activeDot={{ r: 7 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="คะแนนความเสี่ยงเฉลี่ย"
                stroke="#f43f5e"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#f43f5e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          {trendData.map(item => (
            <div key={item.monthKey} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
              <span className="font-semibold text-slate-800">{item.monthName} ({item.sampleCount} ราย)</span>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>น้ำตาลเฉลี่ย: <strong className="text-sky-600">{item['ระดับน้ำตาลเฉลี่ย (mg/dL)']}</strong></span>
                <span>ความดันเฉลี่ย: <strong className="text-sky-700">{item['ความดัน SBP เฉลี่ย (mmHg)']}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Correlations: BMI vs Glucose and BMI vs SBP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scatter 1: BMI vs Glucose */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-slate-800">
                ความสัมพันธ์ระหว่าง BMI กับระดับน้ำตาลในเลือด
              </span>
            </div>
            <span className="text-xs text-slate-400">เกณฑ์เสี่ยง ≥126</span>
          </div>

          <div className="h-64 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="bmi"
                  name="BMI"
                  unit=" kg/m²"
                  domain={[18, 35]}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'BMI (kg/m²)', position: 'insideBottom', offset: -5, fontSize: 10 }}
                />
                <YAxis
                  type="number"
                  dataKey="glucose"
                  name="น้ำตาล"
                  unit=" mg/dL"
                  domain={[70, 170]}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'น้ำตาล (mg/dL)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2.5 rounded-xl shadow-md border border-slate-200 text-xs">
                        <p className="font-bold text-slate-800">{data.id} ({data.area})</p>
                        <p className="text-slate-600">BMI: <span className="font-semibold text-sky-700">{data.bmi}</span> kg/m²</p>
                        <p className="text-slate-600">น้ำตาล: <span className="font-semibold text-rose-600">{data.glucose}</span> mg/dL</p>
                        <p className="text-slate-500 text-[11px]">ระดับ: {data.riskLevel}</p>
                      </div>
                    );
                  }}
                />
                {/* Reference line for normal glucose upper bound (100) and diabetes threshold (126) */}
                <ReferenceLine y={126} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'เกณฑ์เบาหวาน 126', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
                <ReferenceLine x={25} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'เกณฑ์ท้วม BMI 25', fill: '#f59e0b', fontSize: 10, position: 'insideTopLeft' }} />
                <Scatter name="ผู้รับการคัดกรอง" data={bmiGlucoseData} fill="#0284c7" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-50">
            *แนวโน้ม: ค่า BMI สูงกว่า 28 มักสัมพันธ์กับค่าน้ำตาลที่เกิน 126 mg/dL (เกณฑ์ความเสี่ยงเบาหวาน)
          </p>
        </div>

        {/* Scatter 2: BMI vs SBP */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-slate-800">
                ความสัมพันธ์ระหว่าง BMI กับความดัน Systolic (SBP)
              </span>
            </div>
            <span className="text-xs text-slate-400">เกณฑ์ความดันสูง ≥140</span>
          </div>

          <div className="h-64 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="bmi"
                  name="BMI"
                  unit=" kg/m²"
                  domain={[18, 35]}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'BMI (kg/m²)', position: 'insideBottom', offset: -5, fontSize: 10 }}
                />
                <YAxis
                  type="number"
                  dataKey="sbp"
                  name="ความดัน SBP"
                  unit=" mmHg"
                  domain={[100, 170]}
                  tick={{ fontSize: 11 }}
                  label={{ value: 'SBP (mmHg)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2.5 rounded-xl shadow-md border border-slate-200 text-xs">
                        <p className="font-bold text-slate-800">{data.id} ({data.area})</p>
                        <p className="text-slate-600">BMI: <span className="font-semibold text-sky-700">{data.bmi}</span> kg/m²</p>
                        <p className="text-slate-600">ความดัน: <span className="font-semibold text-rose-600">{data.sbp}/{data.dbp}</span> mmHg</p>
                        <p className="text-slate-500 text-[11px]">ระดับ: {data.riskLevel}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'เกณฑ์ความดันสูง 140', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
                <ReferenceLine x={25} stroke="#f59e0b" strokeDasharray="3 3" />
                <Scatter name="ผู้รับการคัดกรอง" data={bmiSbpData} fill="#0369a1" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-50">
            *แนวโน้ม: ค่า BMI ยิ่งสูง ความดัน Systolic (SBP) มีแนวโน้มเกิน 140 mmHg ซึ่งเป็นเกณฑ์โรคความดันโลหิตสูง
          </p>
        </div>
      </div>

      {/* 3. พื้นที่ที่มีผู้เสี่ยงสูง (Regional Comparison) */}
      <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-semibold text-slate-800">
              พื้นที่ที่มีผู้มีความเสี่ยงสูง (Regional Health Risk Comparison)
            </span>
          </div>
          <span className="text-xs text-slate-400">เปรียบเทียบ 5 พื้นที่</span>
        </div>

        <div className="h-64 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={areaRiskData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="area" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: any, name: any) => [`${value} คน`, name]}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="เสี่ยงต่ำ" fill="#0ea5e9" />
              <Bar dataKey="เสี่ยงปานกลาง" fill="#f59e0b" />
              <Bar dataKey="เสี่ยงสูง" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
          {areaRiskData.map(item => (
            <div key={item.area} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <p className="font-semibold text-slate-700">พื้นที่{item.area}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">เสี่ยงสูง: <strong className="text-rose-600">{item['เสี่ยงสูง']} คน</strong> ({item.highRiskPct}%)</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

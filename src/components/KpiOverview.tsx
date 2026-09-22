import React from 'react';
import { Users, Activity, TrendingUp, TrendingDown, AlertTriangle, HeartPulse, Scale, Flame } from 'lucide-react';
import { KpiSummary } from '../types';

interface KpiOverviewProps {
  kpis: KpiSummary;
}

export const KpiOverview: React.FC<KpiOverviewProps> = ({ kpis }) => {
  return (
    <section id="kpi-overview-section" className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-blue-600 to-sky-500" />
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">
            สรุปข้อมูลสำคัญทางสุขภาพ (Health Overview KPIs)
          </h2>
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">
          ครอบคลุม 6 มิติ: จำนวน, ค่าเฉลี่ย, ค่าต่ำสุด, ค่าสูงสุด, สัดส่วน, ร้อยละ
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. จำนวน (Total Count) */}
        <div id="kpi-card-count" className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-sky-50/70 p-4 rounded-2xl border border-blue-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              จำนวน
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-600">ผู้รับการคัดกรองทั้งหมด</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-blue-950 font-['Plus_Jakarta_Sans',sans-serif]">
              {kpis.totalCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">คน</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-blue-100 pt-2">
            <span>ชาย/หญิง ในพื้นที่</span>
            <span className="font-semibold text-blue-700">100% บันทึก</span>
          </div>
        </div>

        {/* 2. ค่าเฉลี่ย (Averages) */}
        <div id="kpi-card-average" className="relative overflow-hidden bg-gradient-to-br from-sky-50 to-cyan-50/70 p-4 rounded-2xl border border-sky-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
              ค่าเฉลี่ย
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-600">BMI & น้ำตาลเฉลี่ย</p>
          <div className="mt-1 flex items-baseline gap-2">
            <div>
              <span className="text-2xl font-bold text-sky-950 font-['Plus_Jakarta_Sans',sans-serif]">
                {kpis.avgBmi}
              </span>
              <span className="text-[10px] text-slate-500 ml-0.5 font-medium">BMI</span>
            </div>
            <div className="text-slate-300">|</div>
            <div>
              <span className="text-xl font-bold text-sky-900 font-['Plus_Jakarta_Sans',sans-serif]">
                {kpis.avgGlucose}
              </span>
              <span className="text-[10px] text-slate-500 ml-0.5">mg/dL</span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-sky-100 pt-2">
            <span>SBP เฉลี่ย</span>
            <span className="font-semibold text-sky-800">{kpis.avgSbp} mmHg</span>
          </div>
        </div>

        {/* 3. ค่าต่ำสุด (Minimum) */}
        <div id="kpi-card-minimum" className="relative overflow-hidden bg-gradient-to-br from-cyan-50/80 to-blue-50/60 p-4 rounded-2xl border border-cyan-200/60 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
              ค่าต่ำสุด
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-700">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-600">น้ำตาล & BMI ต่ำสุด</p>
          <div className="mt-1 flex items-baseline gap-2">
            <div>
              <span className="text-2xl font-bold text-cyan-950 font-['Plus_Jakarta_Sans',sans-serif]">
                {kpis.minGlucose}
              </span>
              <span className="text-[10px] text-slate-500 ml-0.5">mg/dL</span>
            </div>
            <div className="text-slate-300">|</div>
            <div>
              <span className="text-xl font-bold text-cyan-900 font-['Plus_Jakarta_Sans',sans-serif]">
                {kpis.minBmi}
              </span>
              <span className="text-[10px] text-slate-500 ml-0.5">BMI</span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-cyan-100 pt-2">
            <span>SBP ต่ำสุด</span>
            <span className="font-semibold text-cyan-800">{kpis.minSbp} mmHg</span>
          </div>
        </div>

        {/* 4. ค่าสูงสุด (Maximum) */}
        <div id="kpi-card-maximum" className="relative overflow-hidden bg-gradient-to-br from-amber-50/80 to-rose-50/60 p-4 rounded-2xl border border-amber-200/60 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              ค่าสูงสุด
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-600">น้ำตาล & SBP สูงสุด</p>
          <div className="mt-1 flex items-baseline gap-2">
            <div>
              <span className="text-2xl font-bold text-amber-950 font-['Plus_Jakarta_Sans',sans-serif]">
                {kpis.maxGlucose}
              </span>
              <span className="text-[10px] text-slate-500 ml-0.5">mg/dL</span>
            </div>
            <div className="text-slate-300">|</div>
            <div>
              <span className="text-xl font-bold text-amber-900 font-['Plus_Jakarta_Sans',sans-serif]">
                {kpis.maxSbp}
              </span>
              <span className="text-[10px] text-slate-500 ml-0.5">mmHg</span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-amber-100 pt-2">
            <span>BMI สูงสุด</span>
            <span className="font-semibold text-amber-800">{kpis.maxBmi} kg/m²</span>
          </div>
        </div>

        {/* 5. สัดส่วน (Proportion) */}
        <div id="kpi-card-proportion" className="relative overflow-hidden bg-gradient-to-br from-indigo-50/70 to-sky-50/60 p-4 rounded-2xl border border-indigo-200/60 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              สัดส่วน
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-600">สัดส่วนผู้มีความเสี่ยงสูง</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-indigo-950 font-['Plus_Jakarta_Sans',sans-serif]">
              {kpis.highRiskCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">/ {kpis.totalCount} คน</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-indigo-100 pt-2">
            <span>ปานกลาง / ต่ำ</span>
            <span className="font-semibold text-indigo-700">{kpis.moderateRiskCount} / {kpis.lowRiskCount} คน</span>
          </div>
        </div>

        {/* 6. ร้อยละ (Percentage) */}
        <div id="kpi-card-percentage" className="relative overflow-hidden bg-gradient-to-br from-rose-50/80 to-sky-50/50 p-4 rounded-2xl border border-rose-200/70 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              ร้อยละ
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-700">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-600">ร้อยละกลุ่มเสี่ยงสูง</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-rose-700 font-['Plus_Jakarta_Sans',sans-serif]">
              {kpis.highRiskPct}%
            </span>
            <span className="text-xs font-semibold text-slate-500">เสี่ยงสูง</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-rose-100 pt-2">
            <span>เสี่ยงเบาหวาน / ความดัน</span>
            <span className="font-semibold text-rose-700">{kpis.diabetesRiskPct}% / {kpis.hypertensionRiskPct}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

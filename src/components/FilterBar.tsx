import React from 'react';
import { Filter, Search, RotateCcw, AlertOctagon, MapPin, Users, Activity, Calendar } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  areas: string[];
  months: string[];
  totalFiltered: number;
  totalAll: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  areas,
  months,
  totalFiltered,
  totalAll
}) => {
  const isFiltered =
    filters.area !== 'all' ||
    filters.gender !== 'all' ||
    filters.riskLevel !== 'all' ||
    filters.month !== 'all' ||
    filters.searchQuery !== '' ||
    filters.urgentOnly;

  return (
    <div id="filter-bar-container" className="bg-white/95 backdrop-blur-md rounded-2xl border border-sky-100 shadow-sm p-4 sm:p-5 mb-6 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-3 border-b border-sky-50">
        <div className="flex items-center gap-2 text-blue-950 font-semibold text-sm sm:text-base">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
            <Filter className="w-4 h-4" />
          </div>
          <span>ตัวกรองข้อมูลและระบบค้นหา (Filters & Search)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick urgent filter toggle */}
          <button
            id="filter-urgent-toggle"
            onClick={() => onChange({ urgentOnly: !filters.urgentOnly })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              filters.urgentOnly
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>เฉพาะกลุ่มเสี่ยงสูง (High Risk)</span>
          </button>

          {/* Reset button */}
          {isFiltered && (
            <button
              id="filter-reset-btn"
              onClick={onReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}

          {/* Result counter */}
          <span className="text-xs px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 font-medium border border-sky-200">
            แสดง {totalFiltered} จาก {totalAll} รายการ
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3">
        {/* Search */}
        <div className="relative">
          <label htmlFor="filter-search-input" className="block text-[11px] font-semibold text-slate-500 mb-1">
            ค้นหารหัส / คำสำคัญ
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="filter-search-input"
              type="text"
              placeholder="ค้นหา เช่น H0001, สูง..."
              value={filters.searchQuery}
              onChange={(e) => onChange({ searchQuery: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Area Filter */}
        <div>
          <label htmlFor="filter-area-select" className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <MapPin className="w-3 h-3 text-sky-600" /> พื้นที่
          </label>
          <select
            id="filter-area-select"
            value={filters.area}
            onChange={(e) => onChange({ area: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 text-slate-800 font-medium"
          >
            <option value="all">ทุกพื้นที่ (ทั้งหมด)</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label htmlFor="filter-gender-select" className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <Users className="w-3 h-3 text-sky-600" /> เพศ
          </label>
          <select
            id="filter-gender-select"
            value={filters.gender}
            onChange={(e) => onChange({ gender: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 text-slate-800 font-medium"
          >
            <option value="all">ทุกเพศ (ชาย/หญิง)</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
          </select>
        </div>

        {/* Risk Level Filter */}
        <div>
          <label htmlFor="filter-risk-select" className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <Activity className="w-3 h-3 text-sky-600" /> ระดับความเสี่ยง
          </label>
          <select
            id="filter-risk-select"
            value={filters.riskLevel}
            onChange={(e) => onChange({ riskLevel: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 text-slate-800 font-medium"
          >
            <option value="all">ทุกระดับความเสี่ยง</option>
            <option value="ต่ำ">ความเสี่ยงต่ำ (Low)</option>
            <option value="ปานกลาง">ความเสี่ยงปานกลาง (Moderate)</option>
            <option value="สูง">ความเสี่ยงสูง (High)</option>
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <label htmlFor="filter-month-select" className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
            <Calendar className="w-3 h-3 text-sky-600" /> เดือนที่คัดกรอง
          </label>
          <select
            id="filter-month-select"
            value={filters.month}
            onChange={(e) => onChange({ month: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 text-slate-800 font-medium"
          >
            <option value="all">ทุกเดือน (ม.ค. - มี.ค. 2026)</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m === '2026-01' ? 'มกราคม 2026 (2026-01)' : m === '2026-02' ? 'กุมภาพันธ์ 2026 (2026-02)' : m === '2026-03' ? 'มีนาคม 2026 (2026-03)' : m}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

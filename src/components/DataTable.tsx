import React, { useState } from 'react';
import { Download, ArrowUpDown, Eye, AlertCircle, CheckCircle, Search, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { HealthRecord } from '../types';
import { getRiskLevelColor, getGlucoseBadge, getBpBadge, getBmiBadge } from '../utils/healthCalculations';
import { PersonDetailModal } from './PersonDetailModal';

interface DataTableProps {
  records: HealthRecord[];
  allRecordsCount: number;
}

type SortField = 'id' | 'age' | 'bmi' | 'glucose' | 'sbp' | 'riskScore';

export const DataTable: React.FC<DataTableProps> = ({ records, allRecordsCount }) => {
  const [selectedPerson, setSelectedPerson] = useState<HealthRecord | null>(null);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [onlyHighRisk, setOnlyHighRisk] = useState(false);
  const pageSize = 10;

  // Filter if onlyHighRisk is toggled
  const displayedRecords = onlyHighRisk
    ? records.filter(r => r.riskLevel === 'สูง')
    : records;

  // Sorting
  const sortedRecords = [...displayedRecords].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      return sortDirection === 'asc'
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    }

    return sortDirection === 'asc'
      ? (valA as number) - (valB as number)
      : (valB as number) - (valA as number);
  });

  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = sortedRecords.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // CSV Export handler
  const handleExportCsv = () => {
    const headers = [
      'รหัสบุคคล',
      'วันที่คัดกรอง',
      'พื้นที่',
      'เพศ',
      'อายุ',
      'ส่วนสูง_cm',
      'น้ำหนัก_kg',
      'BMI',
      'SBP_mmHg',
      'DBP_mmHg',
      'ชีพจร_bpm',
      'น้ำตาล_mg_dL',
      'สูบบุหรี่',
      'ดื่มแอลกอฮอล์',
      'การออกกำลังกาย',
      'เบาหวาน_คัดกรอง',
      'ความดันโลหิตสูง_คัดกรอง',
      'คะแนนความเสี่ยง',
      'ระดับความเสี่ยง',
      'เดือน'
    ];

    const rows = sortedRecords.map(r => [
      r.id,
      r.screeningDate,
      r.area,
      r.gender,
      r.age,
      r.height,
      r.weight,
      r.bmi,
      r.sbp,
      r.dbp,
      r.pulse,
      r.glucose,
      r.smoking,
      r.alcohol,
      r.exercise,
      r.diabetesRisk,
      r.hypertensionRisk,
      r.riskScore,
      r.riskLevel,
      r.month
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `health_screening_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="data-table-section" className="space-y-4">
      {/* Table Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-blue-600 to-sky-500" />
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>รายละเอียดเชิงลึกและทะเบียนคัดกรอง (Detailed Registry & Individual View)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                {displayedRecords.length} ราย
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              ระบบใช้ Conditional Formatting (สีเขียว-เหลือง-แดง) แยกแยะกลุ่มเสี่ยง น้ำตาล ความดัน และ BMI
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Urgent High Risk Only */}
          <button
            onClick={() => {
              setOnlyHighRisk(!onlyHighRisk);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              onlyHighRisk
                ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {onlyHighRisk ? 'แสดงทุกกลุ่มความเสี่ยง' : 'เฉพาะกลุ่มเสี่ยงสูง (Urgent Care)'}
          </button>

          {/* Export CSV */}
          <button
            id="export-csv-btn"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด CSV</span>
          </button>
        </div>
      </div>

      {/* Color Legend for Conditional Formatting */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-2xl bg-white border border-sky-100 text-xs text-slate-600">
        <span className="font-semibold text-slate-700">สัญลักษณ์สี Conditional Formatting:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span>ปกติ (เสี่ยงต่ำ / FPG &lt;100 / BP &lt;120)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          <span>เฝ้าระวัง (เสี่ยงปานกลาง / FPG 100-125 / BP 120-139)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
          <span>วิกฤต/เสี่ยงสูง (เสี่ยงสูง / FPG ≥126 / BP ≥140)</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-gradient-to-r from-blue-50/90 to-sky-50/70 text-slate-700 uppercase tracking-wider text-[11px] font-semibold border-b border-sky-100">
              <tr>
                <th className="px-4 py-3 cursor-pointer hover:bg-sky-100/60" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1">
                    <span>รหัสบุคคล</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3">พื้นที่</th>
                <th className="px-3 py-3">เพศ</th>
                <th className="px-3 py-3 cursor-pointer hover:bg-sky-100/60" onClick={() => handleSort('age')}>
                  <div className="flex items-center gap-1">
                    <span>อายุ</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3 cursor-pointer hover:bg-sky-100/60" onClick={() => handleSort('bmi')}>
                  <div className="flex items-center gap-1">
                    <span>BMI (kg/m²)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3 cursor-pointer hover:bg-sky-100/60" onClick={() => handleSort('glucose')}>
                  <div className="flex items-center gap-1">
                    <span>น้ำตาล (mg/dL)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3 cursor-pointer hover:bg-sky-100/60" onClick={() => handleSort('sbp')}>
                  <div className="flex items-center gap-1">
                    <span>ความดัน (SBP/DBP)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3">พฤติกรรม (สูบ/ดื่ม/ออกกำลัง)</th>
                <th className="px-3 py-3 cursor-pointer hover:bg-sky-100/60" onClick={() => handleSort('riskScore')}>
                  <div className="flex items-center gap-1">
                    <span>คะแนนความเสี่ยง</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-3">ระดับความเสี่ยง</th>
                <th className="px-3 py-3 text-center">ดูข้อมูล</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-slate-400">
                    ไม่พบข้อมูลตามตัวกรองที่เลือก
                  </td>
                </tr>
              ) : (
                paginatedRecords.map(r => {
                  const riskStyle = getRiskLevelColor(r.riskLevel);
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedPerson(r)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        r.riskLevel === 'สูง' ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* ID */}
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {r.id}
                      </td>

                      {/* Area */}
                      <td className="px-3 py-3 font-medium text-slate-600">
                        {r.area}
                      </td>

                      {/* Gender */}
                      <td className="px-3 py-3 text-slate-600">
                        {r.gender}
                      </td>

                      {/* Age */}
                      <td className="px-3 py-3 text-slate-700">
                        {r.age} ปี
                      </td>

                      {/* BMI with Conditional Coloring */}
                      <td className="px-3 py-3 font-medium">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            r.bmi >= 30
                              ? 'bg-rose-100 text-rose-700 font-bold'
                              : r.bmi >= 25
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-sky-50 text-sky-700'
                          }`}
                        >
                          {r.bmi}
                        </span>
                      </td>

                      {/* Glucose with Conditional Coloring */}
                      <td className="px-3 py-3 font-medium">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            r.glucose >= 126
                              ? 'bg-rose-100 text-rose-700 font-bold'
                              : r.glucose >= 100
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-sky-50 text-sky-700'
                          }`}
                        >
                          {r.glucose}
                        </span>
                      </td>

                      {/* BP with Conditional Coloring */}
                      <td className="px-3 py-3 font-medium">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            r.sbp >= 140 || r.dbp >= 90
                              ? 'bg-rose-100 text-rose-700 font-bold'
                              : r.sbp >= 120
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-sky-50 text-sky-700'
                          }`}
                        >
                          {r.sbp}/{r.dbp}
                        </span>
                      </td>

                      {/* Behaviors */}
                      <td className="px-3 py-3 text-slate-500 text-[11px]">
                        <span className={r.smoking === 'สูบ' ? 'text-rose-600 font-semibold' : 'text-slate-500'}>
                          {r.smoking}
                        </span>
                        {' / '}
                        <span className={r.alcohol === 'ดื่ม' ? 'text-amber-600 font-semibold' : 'text-slate-500'}>
                          {r.alcohol}
                        </span>
                        {' / '}
                        <span className={r.exercise === 'ไม่ออกกำลังกาย' ? 'text-rose-600 font-semibold' : 'text-sky-700 font-medium'}>
                          {r.exercise}
                        </span>
                      </td>

                      {/* Risk Score */}
                      <td className="px-3 py-3 font-bold text-slate-800">
                        {r.riskScore}
                      </td>

                      {/* Risk Level Badge */}
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${riskStyle.badge}`}>
                          {r.riskLevel}
                        </span>
                      </td>

                      {/* View Button */}
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPerson(r);
                          }}
                          className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition-all cursor-pointer"
                          title="ดูรายงานสุขภาพรายบุคคล"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-slate-50/50 border-t border-slate-100 gap-2">
          <span className="text-xs text-slate-500">
            หน้า {page} จาก {totalPages} (แสดง {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, sortedRecords.length)} จากทั้งหมด {sortedRecords.length} ราย)
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 text-slate-700">{page}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Person Detail Modal */}
      {selectedPerson && (
        <PersonDetailModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )}
    </div>
  );
};

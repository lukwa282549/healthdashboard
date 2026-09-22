import React from 'react';
import { X, User, Heart, Activity, Scale, ShieldAlert, CheckCircle2, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import { HealthRecord } from '../types';
import { getRiskLevelColor, getGlucoseBadge, getBpBadge, getBmiBadge } from '../utils/healthCalculations';

interface PersonDetailModalProps {
  person: HealthRecord | null;
  onClose: () => void;
}

export const PersonDetailModal: React.FC<PersonDetailModalProps> = ({ person, onClose }) => {
  if (!person) return null;

  const riskStyle = getRiskLevelColor(person.riskLevel);
  const glucoseBadge = getGlucoseBadge(person.glucose);
  const bpBadge = getBpBadge(person.sbp, person.dbp);
  const bmiBadge = getBmiBadge(person.bmi);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sky-100 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-800">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">
                  รหัสบุคคล: {person.id}
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${riskStyle.badge}`}>
                  เสี่ยง{person.riskLevel} (คะแนน {person.riskScore})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                วันที่คัดกรอง: {person.screeningDate} | พื้นที่: {person.area} | เดือน: {person.month}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-6">
          {/* Demographic & General info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">เพศ</span>
              <p className="text-base font-bold text-slate-800">{person.gender}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">อายุ</span>
              <p className="text-base font-bold text-slate-800">{person.age} <span className="text-xs font-normal">ปี</span></p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">ส่วนสูง / น้ำหนัก</span>
              <p className="text-sm font-bold text-slate-800">{person.height} cm / {person.weight} kg</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">ชีพจร (Pulse)</span>
              <p className="text-base font-bold text-slate-800">{person.pulse} <span className="text-xs font-normal">bpm</span></p>
            </div>
          </div>

          {/* Clinical Biomarkers with Conditional Color Badges */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-sky-600" /> ผลการตรวจประเมินทางคลินิก (Clinical Biomarkers)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* BMI */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>ดัชนีมวลกาย (BMI)</span>
                  <Scale className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  {person.bmi} <span className="text-xs font-normal text-slate-500">kg/m²</span>
                </p>
                <div className="pt-1">
                  <span className={`inline-block text-[10px] ${bmiBadge.color}`}>
                    {bmiBadge.label}
                  </span>
                </div>
              </div>

              {/* Glucose */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>ระดับน้ำตาล (FPG)</span>
                  <Activity className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  {person.glucose} <span className="text-xs font-normal text-slate-500">mg/dL</span>
                </p>
                <div className="pt-1">
                  <span className={`inline-block text-[10px] ${glucoseBadge.color}`}>
                    {glucoseBadge.label}
                  </span>
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>ความดันโลหิต (SBP/DBP)</span>
                  <Heart className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  {person.sbp} / {person.dbp} <span className="text-xs font-normal text-slate-500">mmHg</span>
                </p>
                <div className="pt-1">
                  <span className={`inline-block text-[10px] ${bpBadge.color}`}>
                    {bpBadge.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Behaviors and Screenings */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-sky-600" /> พฤติกรรมและผลคัดกรองโรค (Behaviors & Diagnosis)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-600">การสูบบุหรี่:</span>
                <span className={`font-semibold px-2 py-0.5 rounded ${person.smoking === 'สูบ' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-800'}`}>
                  {person.smoking}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-600">การดื่มแอลกอฮอล์:</span>
                <span className={`font-semibold px-2 py-0.5 rounded ${person.alcohol === 'ดื่ม' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                  {person.alcohol}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-600">การออกกำลังกาย:</span>
                <span className={`font-semibold px-2 py-0.5 rounded ${person.exercise === 'ไม่ออกกำลังกาย' ? 'bg-rose-100 text-rose-700' : person.exercise === 'บางครั้ง' ? 'bg-sky-100 text-sky-800' : 'bg-blue-100 text-blue-800'}`}>
                  {person.exercise}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-600">คัดกรองเบาหวาน:</span>
                <span className={`font-semibold px-2 py-0.5 rounded ${person.diabetesRisk.includes('เสี่ยง') ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-800'}`}>
                  {person.diabetesRisk}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center sm:col-span-2">
                <span className="text-slate-600">คัดกรองความดันโลหิตสูง:</span>
                <span className={`font-semibold px-2 py-0.5 rounded ${person.hypertensionRisk.includes('เสี่ยง') ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-800'}`}>
                  {person.hypertensionRisk}
                </span>
              </div>
            </div>
          </div>

          {/* Actionable Health Plan / Recommendations */}
          <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200">
            <h5 className="text-xs font-bold text-sky-900 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-sky-700" /> แผนการดูแลและคำแนะนำสุขภาพเฉพาะบุคคล (Care Recommendations)
            </h5>
            <ul className="text-xs text-sky-800 space-y-1.5 list-disc list-inside">
              {person.riskLevel === 'สูง' ? (
                <>
                  <li>ส่งต่อพบแพทย์/ทีมหมอครอบครัวเพื่อรับการตรวจยืนยันโรคเบาหวานและความดันโลหิตสูง</li>
                  <li>เข้ารับการปรับเปลี่ยนพฤติกรรมสุขภาพแบบเข้มข้น ลดอาหารหวาน มัน เค็ม และออกกำลังกายสม่ำเสมอ</li>
                  <li>ติดตามวัดระดับความดันโลหิตและเจาะน้ำตาลปลายนิ้วทุก 1-2 สัปดาห์</li>
                </>
              ) : person.riskLevel === 'ปานกลาง' ? (
                <>
                  <li>จัดอยู่ในกลุ่มเสี่ยงปานกลาง ควรควบคุมน้ำหนักตัวและเพิ่มการออกกำลังกายให้ได้อย่างน้อย 150 นาที/สัปดาห์</li>
                  <li>ตรวจซ้ำระดับน้ำตาลและความดันโลหิตทุก 3-6 เดือน</li>
                  <li>ลดหรืองดการสูบบุหรี่และการดื่มเครื่องดื่มแอลกอฮอล์</li>
                </>
              ) : (
                <>
                  <li>สุขภาพอยู่ในเกณฑ์ปกติ ส่งเสริมให้ออกกำลังกายสม่ำเสมอและรับประทานอาหารครบ 5 หมู่ต่อไป</li>
                  <li>นัดตรวจคัดกรองสุขภาพประจำปีอย่างต่อเนื่องทุก 1 ปี</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-all"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

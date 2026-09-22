import React from 'react';
import { RefreshCw, ExternalLink, ShieldCheck, HeartPulse, User, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SHEET_ID } from '../services/sheetService';

interface HeaderProps {
  lastUpdated: string;
  isLive: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  totalRecords: number;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isLive,
  isLoading,
  onRefresh,
  totalRecords
}) => {
  return (
    <header id="dashboard-header" className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-sky-800 to-indigo-900 text-white shadow-xl p-6 sm:p-8 mb-6">
      {/* Decorative ambient glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-300/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Title and Description */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 backdrop-blur-md border border-sky-300/30 text-sky-200 text-xs font-medium">
            <HeartPulse className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
            <span>ระบบสารสนเทศสุขภาพชุมชนและการเฝ้าระวังโรคไม่ติดต่อ (NCDs)</span>
          </div>

          <h1 id="dashboard-title" className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            แดชบอร์ดเฝ้าระวังสุขภาพและพฤติกรรมเสี่ยงชุมชน
          </h1>

          <p id="dashboard-description" className="text-sm sm:text-base text-sky-100/90 leading-relaxed">
            ติดตามผลการคัดกรองภาวะสุขภาพ ปัจจัยเสี่ยงโรคเบาหวานและความดันโลหิตสูง พร้อมวิเคราะห์พฤติกรรมการใช้ชีวิตเพื่อวางแผนส่งเสริมสุขภาพระดับปฐมภูมิ
          </p>

          {/* Author & Context Metadata */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm text-sky-100/80">
            <div className="flex items-center gap-2 bg-sky-950/40 px-3 py-1.5 rounded-lg border border-sky-400/20">
              <User className="w-4 h-4 text-sky-300" />
              <span>
                <strong className="text-white font-semibold">ผู้จัดทำ:</strong> ภัทราพร คำเจียก
              </span>
              <span className="text-sky-300/70 text-xs hidden sm:inline">(bsc67pattarapron.kha@kmpht.ac.th)</span>
            </div>

            <div className="flex items-center gap-2 bg-sky-950/40 px-3 py-1.5 rounded-lg border border-sky-400/20">
              <Calendar className="w-4 h-4 text-sky-300" />
              <span>
                <strong className="text-white font-semibold">ข้อมูลล่าสุด:</strong> {lastUpdated}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-sky-200">
              {isLive ? (
                <span className="inline-flex items-center gap-1 text-sky-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> เชื่อมต่อ Sheet สด
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300" /> สำรองข้อมูลซิงก์
                </span>
              )}
              <span className="text-white font-medium">({totalRecords} รายการ)</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Sheet Link */}
        <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-3 shrink-0">
          <a
            id="open-sheet-link"
            href={`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium border border-white/20 backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow"
            title="เปิด Google Sheets ต้นฉบับในแท็บใหม่"
          >
            <ExternalLink className="w-4 h-4 text-sky-300" />
            <span>Google Sheet</span>
          </a>

          <button
            id="refresh-data-btn"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 active:scale-95 text-sky-950 font-semibold text-xs sm:text-sm shadow-lg shadow-sky-950/20 transition-all duration-200 cursor-pointer disabled:opacity-50"
            title="ดึงข้อมูลล่าสุดจาก Google Sheets"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'กำลังซิงก์...' : 'ซิงก์ข้อมูลสด'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

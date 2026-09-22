import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HealthRecord, FilterState } from './types';
import { DEFAULT_HEALTH_RECORDS } from './data/defaultData';
import { fetchSheetData, SHEET_ID } from './services/sheetService';
import { calculateKpis } from './utils/healthCalculations';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { NavigationTabs, TabKey } from './components/NavigationTabs';
import { KpiOverview } from './components/KpiOverview';
import { RiskAnalysis } from './components/RiskAnalysis';
import { BehaviorAnalysis } from './components/BehaviorAnalysis';
import { TrendAndCorrelation } from './components/TrendAndCorrelation';
import { DataTable } from './components/DataTable';
import { AlertTriangle, CheckCircle2, HeartPulse, RefreshCw, FileText, Sparkles } from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>(DEFAULT_HEALTH_RECORDS);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('22 กันยายน 2569 เวลา 10:48 น.');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const [filters, setFilters] = useState<FilterState>({
    area: 'all',
    gender: 'all',
    riskLevel: 'all',
    month: 'all',
    searchQuery: '',
    urgentOnly: false
  });

  // Sync data from Google Sheet
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchSheetData(SHEET_ID);
      setRecords(res.data);
      setIsLive(res.isLive);
      setLastUpdated(res.lastUpdated);
    } catch (e) {
      console.error('Error fetching sheet data:', e);
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Extract unique areas and months for dropdown filters
  const areas = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.area) set.add(r.area);
    });
    return Array.from(set);
  }, [records]);

  const months = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.month) set.add(r.month);
    });
    return Array.from(set).sort();
  }, [records]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      area: 'all',
      gender: 'all',
      riskLevel: 'all',
      month: 'all',
      searchQuery: '',
      urgentOnly: false
    });
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Area
      if (filters.area !== 'all' && r.area !== filters.area) return false;
      // Gender
      if (filters.gender !== 'all' && r.gender !== filters.gender) return false;
      // Risk Level
      if (filters.riskLevel !== 'all' && r.riskLevel !== filters.riskLevel) return false;
      // Month
      if (filters.month !== 'all' && r.month !== filters.month) return false;
      // Urgent high risk only
      if (filters.urgentOnly && r.riskLevel !== 'สูง') return false;
      // Search query
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchId = r.id.toLowerCase().includes(query);
        const matchArea = r.area.toLowerCase().includes(query);
        const matchRisk = r.riskLevel.toLowerCase().includes(query);
        const matchGender = r.gender.toLowerCase().includes(query);
        if (!matchId && !matchArea && !matchRisk && !matchGender) return false;
      }
      return true;
    });
  }, [records, filters]);

  // Computed KPIs
  const kpis = useMemo(() => {
    return calculateKpis(filteredRecords);
  }, [filteredRecords]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50/40 via-blue-50/20 to-slate-50 text-slate-900 pb-16 font-['Prompt',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Header */}
        <Header
          lastUpdated={lastUpdated}
          isLive={isLive}
          isLoading={isLoading}
          onRefresh={loadData}
          totalRecords={records.length}
        />

        {/* Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          highRiskCount={kpis.highRiskCount}
        />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          areas={areas}
          months={months}
          totalFiltered={filteredRecords.length}
          totalAll={records.length}
        />

        {/* Tab Content Display */}
        <main id="main-content-section" className="space-y-8">
          {/* OVERVIEW TAB */}
          {(activeTab === 'overview' || activeTab === 'all') && (
            <section className="space-y-6">
              <KpiOverview kpis={kpis} />

              {/* Quick High Risk Alert Banner if any high risk individuals */}
              {kpis.highRiskCount > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 border border-rose-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-rose-500 text-white">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-950">
                        แจ้งเตือนกลุ่มประชากรเสี่ยงสูงเร่งด่วน ({kpis.highRiskCount} ราย / {kpis.highRiskPct}%)
                      </h4>
                      <p className="text-xs text-rose-800">
                        พบผู้รับการคัดกรองที่มีคะแนนความเสี่ยงตั้งแต่ 4 คะแนนขึ้นไป และมีค่าน้ำตาลหรือความดันโลหิตเกินเกณฑ์มาตรฐาน
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, urgentOnly: true }));
                      setActiveTab('table');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 cursor-pointer shadow-sm transition-all"
                  >
                    ดูรายชื่อกลุ่มเสี่ยงเร่งด่วน
                  </button>
                </div>
              )}

              {/* Key Insights Bento Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RiskAnalysis records={filteredRecords} />
                <BehaviorAnalysis records={filteredRecords} />
              </div>
            </section>
          )}

          {/* RISK ANALYSIS TAB */}
          {activeTab === 'risk' && (
            <section>
              <RiskAnalysis records={filteredRecords} />
            </section>
          )}

          {/* BEHAVIOR TAB */}
          {activeTab === 'behavior' && (
            <section>
              <BehaviorAnalysis records={filteredRecords} />
            </section>
          )}

          {/* TRENDS & CORRELATIONS TAB */}
          {activeTab === 'trends' && (
            <section>
              <TrendAndCorrelation records={filteredRecords} />
            </section>
          )}

          {/* DATA TABLE TAB */}
          {activeTab === 'table' && (
            <section>
              <DataTable
                records={filteredRecords}
                allRecordsCount={records.length}
              />
            </section>
          )}

          {/* ALL VIEW: Also append Trends and DataTable if 'all' is chosen */}
          {activeTab === 'all' && (
            <section className="space-y-8 mt-6">
              <TrendAndCorrelation records={filteredRecords} />
              <DataTable
                records={filteredRecords}
                allRecordsCount={records.length}
              />
            </section>
          )}
        </main>

        {/* Footer */}
        <footer id="dashboard-footer" className="mt-12 pt-6 border-t border-sky-100 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <HeartPulse className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">แดชบอร์ดเฝ้าระวังสุขภาพและพฤติกรรมเสี่ยงชุมชน</span>
            <span>• เชื่อมโยง Google Sheets ID: <code className="text-blue-700 font-mono bg-blue-50 px-1 py-0.5 rounded">{SHEET_ID.slice(0, 12)}...</code></span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span>ผู้จัดทำ: ภัทราพร คำเจียก</span>
            <span>(bsc67pattarapron.kha@kmpht.ac.th)</span>
            <span className="text-blue-600 font-medium">• วิทยาลัยแพทยศาสตร์และการสาธารณสุข</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

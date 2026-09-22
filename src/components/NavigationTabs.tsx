import React from 'react';
import { LayoutDashboard, ShieldAlert, HeartHandshake, TrendingUp, Table, Layers } from 'lucide-react';

export type TabKey = 'overview' | 'risk' | 'behavior' | 'trends' | 'table' | 'all';

interface NavigationTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  highRiskCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  highRiskCount
}) => {
  const tabs = [
    {
      id: 'overview' as TabKey,
      label: 'ภาพรวม & KPI',
      sublabel: 'Overview & KPIs',
      icon: LayoutDashboard
    },
    {
      id: 'risk' as TabKey,
      label: 'วิเคราะห์ความเสี่ยง',
      sublabel: 'Health Risk',
      icon: ShieldAlert,
      badge: highRiskCount > 0 ? `${highRiskCount} เสี่ยงสูง` : undefined
    },
    {
      id: 'behavior' as TabKey,
      label: 'พฤติกรรมสุขภาพ',
      sublabel: 'Health Behaviors',
      icon: HeartHandshake
    },
    {
      id: 'trends' as TabKey,
      label: 'แนวโน้ม & สหสัมพันธ์',
      sublabel: 'Trends & Correlations',
      icon: TrendingUp
    },
    {
      id: 'table' as TabKey,
      label: 'ทะเบียนข้อมูลเชิงลึก',
      sublabel: 'Data Registry',
      icon: Table
    },
    {
      id: 'all' as TabKey,
      label: 'แสดงทั้งหมด',
      sublabel: 'Full View',
      icon: Layers
    }
  ];

  return (
    <nav id="dashboard-navigation" className="mb-6 overflow-x-auto pb-1">
      <div className="flex items-center gap-2 p-1.5 bg-blue-950/5 backdrop-blur-sm rounded-2xl border border-sky-100 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-700/25'
                  : 'text-slate-600 hover:text-blue-800 hover:bg-sky-50/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-600'}`} />
              <div className="flex flex-col text-left">
                <span>{tab.label}</span>
                <span className={`text-[10px] font-normal leading-none ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                  {tab.sublabel}
                </span>
              </div>
              {tab.badge && (
                <span
                  className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700 border border-rose-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

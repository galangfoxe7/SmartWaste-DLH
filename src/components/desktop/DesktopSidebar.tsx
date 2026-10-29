import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Truck, 
  Boxes, 
  Route, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  Radio, 
  Building2,
  Cpu
} from 'lucide-react';
import { DesktopTab } from '../../types/smartwaste';

interface DesktopSidebarProps {
  currentTab: DesktopTab;
  onSelectTab: (tab: DesktopTab) => void;
  activeFleetCount: number;
  criticalTpsCount: number;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onSelectTab,
  activeFleetCount,
  criticalTpsCount,
}) => {
  const menuItems = [
    {
      id: 'overview' as DesktopTab,
      label: 'Dashboard Utama',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'fleet_tracking' as DesktopTab,
      label: 'Pelacakan Armada (GIS)',
      icon: Truck,
      badge: `${activeFleetCount} Aktif`,
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    },
    {
      id: 'tps_monitor' as DesktopTab,
      label: 'Monitoring TPS & Sensor',
      icon: Boxes,
      badge: criticalTpsCount > 0 ? `${criticalTpsCount} Kritis` : null,
      badgeColor: 'bg-red-950 text-red-300 border-red-800',
    },
    {
      id: 'route_optimizer' as DesktopTab,
      label: 'Optimasi Rute Cerdas',
      icon: Route,
      badge: 'AI / Heuristik',
      badgeColor: 'bg-teal-950 text-teal-300 border-teal-800',
    },
    {
      id: 'analytics_reports' as DesktopTab,
      label: 'Analitik & Target SDGs',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings' as DesktopTab,
      label: 'Konfigurasi Sistem',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand Zone */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-950">
            <ShieldCheck className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-tight uppercase">
                DLH KOTA SURABAYA
              </span>
            </div>
            <h1 className="text-sm font-extrabold text-emerald-400">
              SmartWaste Command
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">
              v2.6 Enterprise System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
          Operasional Lapangan
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-800/90 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ml-2 shrink-0 ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Live System Telemetry Status (Quiet bottom info) */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 m-2 rounded-xl">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>Konektivitas IoT DLH</span>
          </span>
          <span className="text-emerald-400 font-mono font-semibold">99.8%</span>
        </div>
        <p className="text-[10px] text-slate-500">
          286 Sensor TPS & 48 GPS Armada Terhubung ke Data Lake Surabaya
        </p>
      </div>

      {/* University & DLH Partnership */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2.5">
        <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
        <div className="truncate">
          <p className="font-semibold text-slate-300">DLH Kota Surabaya</p>
          <p className="text-[10px] text-slate-500 truncate">Riset Kolaboratif ITATS 2026</p>
        </div>
      </div>
    </aside>
  );
};

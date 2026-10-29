import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Smartphone, 
  Download, 
  Layers, 
  CloudSun, 
  Calendar, 
  ChevronRight, 
  ShieldCheck,
  Check,
  AlertTriangle
} from 'lucide-react';
import { DesktopTab, NotificationItem } from '../../types/smartwaste';
import { desktopOperator } from '../../data/mockData';

interface DesktopHeaderProps {
  currentTab: DesktopTab;
  notifications: NotificationItem[];
  onOpenMobileView: () => void;
  onOpenFigmaModal: () => void;
  onOpenFigmaCanvas: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  currentTab,
  notifications,
  onOpenMobileView,
  onOpenFigmaModal,
  onOpenFigmaCanvas,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const tabTitles: Record<DesktopTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Dashboard Pemantauan Sampah Kota',
      subtitle: 'Monitoring volume TPA Benowo, status 286 TPS, dan distribusi operasional',
    },
    fleet_tracking: {
      title: 'Pelacakan Armada Pengangkut (GIS)',
      subtitle: 'Posisi armada real-time, rute perjalanan, status penjemputan & telemetri',
    },
    tps_monitor: {
      title: 'Monitoring Kapasitas TPS & Sensor IoT',
      subtitle: 'Telemetri ultrasonik wadah sampah, riwayat pengosongan, dan status CCTV',
    },
    route_optimizer: {
      title: 'Sistem Optimasi Rute Cerdas DLH',
      subtitle: 'Algoritma multi-objektif penjadwalan dinamis berbasis volume & lalu lintas',
    },
    analytics_reports: {
      title: 'Laporan Kinerja & Dampak Target SDGs',
      subtitle: 'Efisiensi bahan bakar, reduksi emisi CO2 (SDG 13), dan tata kelola kota (SDG 11)',
    },
    settings: {
      title: 'Pengaturan Sistem & Integrasi Data Lake',
      subtitle: 'Parameter ambang batas sensor, jembatan timbang TPA, dan hak akses',
    },
  };

  const currentInfo = tabTitles[currentTab] || tabTitles.overview;

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between gap-4 shrink-0 select-none z-20">
      {/* Breadcrumb Trail */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400">Pusat Kendali DLH</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="font-semibold text-emerald-400">
          {currentInfo.title}
        </span>
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-3">
        {/* Real-time Surabaya Info */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-slate-400 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700/80">
          <div className="flex items-center gap-1.5 font-mono text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>29 Des 2026, 08:32 WIB</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span>Surabaya 31°C</span>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenMobileView}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            title="Buka Antarmuka Mobile Petugas Lapangan"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">UI Petugas Ponsel</span>
          </button>

          <button
            type="button"
            onClick={onOpenFigmaCanvas}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            title="Lihat Semua 5 Layar Mobile di Kanvas Figma"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Kanvas 5 Layar</span>
          </button>

          <button
            type="button"
            onClick={onOpenFigmaModal}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Figma</span>
          </button>
        </div>

        <div className="h-6 w-px bg-slate-800" />

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center relative border border-slate-700 transition"
            aria-label="Pemberitahuan Sistem"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 text-slate-800 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">
                  Notifikasi Dispatcher DLH
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                  {unreadCount} Belum Dibaca
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.slice(0, 4).map((item) => (
                  <div key={item.id} className="py-2.5">
                    <div className="flex items-center justify-between text-[11px] mb-0.5">
                      <span className="font-bold text-slate-900 truncate pr-2">
                        {item.title}
                      </span>
                      <span className="font-mono text-slate-400 shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowNotifMenu(false)}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
                >
                  Tutup Panel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Operator Profile Header Avatar */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 border border-emerald-600 flex items-center justify-center text-white text-xs font-bold font-mono">
            MM
          </div>
          <div className="hidden xl:block text-left text-xs">
            <p className="font-bold text-white leading-tight">
              {desktopOperator.name}
            </p>
            <p className="text-[10px] text-emerald-400 font-mono">
              Dispatcher DLH Surabaya
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

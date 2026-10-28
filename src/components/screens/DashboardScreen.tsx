import React from 'react';
import { 
  Truck, 
  MapPin, 
  AlertTriangle, 
  ChevronRight, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Fuel, 
  Flame,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { OfficerProfile, VehicleSpecs, TPSLocation, RouteStats, NotificationItem, ScreenType } from '../../types/smartwaste';

interface DashboardScreenProps {
  officer: OfficerProfile;
  vehicle: VehicleSpecs;
  tpsList: TPSLocation[];
  routeStats: RouteStats;
  notifications: NotificationItem[];
  onNavigate: (screen: ScreenType) => void;
  onSelectTPS: (tps: TPSLocation) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  officer,
  vehicle,
  tpsList,
  routeStats,
  notifications,
  onNavigate,
  onSelectTPS,
}) => {
  const currentDestination = tpsList.find((t) => t.id === routeStats.currentDestinationId) || tpsList[1];
  const criticalAlerts = notifications.filter((n) => n.severity === 'critical' || n.severity === 'warning');

  const completedCount = tpsList.filter((t) => t.taskStatus === 'completed').length;
  const totalStops = tpsList.length - 1; // excluding TPA Benowo final dump
  const volumePercentage = Math.round((vehicle.currentLoadTons / vehicle.maxLoadTons) * 100);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 pb-6">
      {/* Officer Greeting & Shift Header */}
      <div className="bg-emerald-900 text-white px-5 pt-4 pb-7 rounded-b-3xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700/80 border-2 border-emerald-400/40 flex items-center justify-center font-bold text-white text-base shadow-sm">
                AS
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-emerald-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-200">Selamat Bertugas,</span>
                <span className="text-[10px] bg-emerald-800 text-emerald-200 font-medium px-2 py-0.5 rounded-full border border-emerald-700">
                  Aktif Bertugas
                </span>
              </div>
              <h2 className="text-base font-bold text-white leading-tight">
                {officer.name}
              </h2>
              <p className="text-[11px] text-emerald-200/80 font-mono">
                NIP. {officer.nip}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-700 text-emerald-100 transition"
            aria-label="Buka Profil Petugas"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
        </div>

        {/* Assigned Vehicle Quick Ribbon */}
        <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-300" />
            <span className="font-semibold">{vehicle.id}</span>
            <span className="text-emerald-300">·</span>
            <span className="text-emerald-200 font-mono">{vehicle.plateNumber}</span>
          </div>
          <span className="text-[11px] text-emerald-200 bg-emerald-800/60 px-2 py-0.5 rounded">
            {vehicle.vehicleType}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 -mt-3 space-y-4">
        {/* KPI / Progress Metrics Strip */}
        <div className="grid grid-cols-2 gap-3">
          {/* Stops Progress */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-medium">Progres TPS Hari Ini</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {completedCount}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ {totalStops} TPS</span>
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((completedCount / totalStops) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Sisa {totalStops - completedCount} titik penjemputan
            </p>
          </div>

          {/* Volume Collected Gauge */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-medium">Muatan Truk</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {vehicle.currentLoadTons.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ {vehicle.maxLoadTons} Ton</span>
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  volumePercentage > 85 ? 'bg-red-500' : volumePercentage > 60 ? 'bg-amber-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(100, volumePercentage)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-mono">
              Terisi {volumePercentage}% kapasitas
            </p>
          </div>
        </div>

        {/* Current Active Target Card */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Tujuan Saat Ini (Rute Optimal)
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              ETA 14 mnt
            </span>
          </div>

          <div className="flex items-start justify-between mt-1">
            <div className="min-w-0 pr-2">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {currentDestination.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {currentDestination.address}
              </p>
              
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                <span className="font-mono">{currentDestination.district}</span>
                <span aria-hidden="true">·</span>
                <span className={`font-semibold font-mono ${
                  currentDestination.fillPercentage >= 80 ? 'text-red-600' : 'text-amber-600'
                }`}>
                  Volume {currentDestination.fillPercentage}%
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500">4.2 km</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectTPS(currentDestination);
                onNavigate('map');
              }}
              className="shrink-0 w-11 h-11 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-900/15 transition cursor-pointer"
              aria-label="Mulai Navigasi ke TPS"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onSelectTPS(currentDestination);
                onNavigate('vehicle_tasks');
              }}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 inline-flex items-center gap-1"
            >
              <span>Perbarui Data Penjemputan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] text-slate-400 font-mono">
              Order #{currentDestination.assignedOrder}
            </span>
          </div>
        </div>

        {/* Real-time Alerts Section */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Peringatan Operasional Lapangan
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('notifications')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
            >
              Lihat Semua ({notifications.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {criticalAlerts.slice(0, 2).map((alert) => (
              <div
                key={alert.id}
                onClick={() => onNavigate('notifications')}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  alert.severity === 'critical'
                    ? 'bg-red-50/70 border-red-200 hover:bg-red-50'
                    : 'bg-amber-50/70 border-amber-200 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {alert.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono ml-1 shrink-0">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                      {alert.message}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Stops Today Overview */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Daftar Antrean TPS Hari Ini
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('vehicle_tasks')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
            >
              Rincian Tugas
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {tpsList.slice(0, 4).map((tps) => {
              const isDone = tps.taskStatus === 'completed';
              const isCurrent = tps.taskStatus === 'in_progress';

              return (
                <div
                  key={tps.id}
                  onClick={() => {
                    onSelectTPS(tps);
                    onNavigate('map');
                  }}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : isCurrent
                        ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400/50'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : `#${tps.assignedOrder}`}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {tps.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <span>{tps.district}</span>
                        <span>·</span>
                        <span className={`font-mono ${
                          tps.fillPercentage >= 80 ? 'text-red-600 font-semibold' : 'text-slate-600'
                        }`}>
                          Kapasitas {tps.fillPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-700'
                        : isCurrent
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isDone ? 'Selesai' : isCurrent ? 'Menuju' : 'Antre'}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {tps.arrivalTimeEstimated.split(' ')[0]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Operational Shortcuts */}
        <div className="pt-1">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('map')}
              className="p-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-semibold shadow-xs transition"
            >
              <Navigation className="w-4 h-4" />
              <span>Buka Peta Navigasi</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('vehicle_tasks')}
              className="p-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold shadow-xs transition"
            >
              <Truck className="w-4 h-4 text-emerald-800" />
              <span>Status Armada A07</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

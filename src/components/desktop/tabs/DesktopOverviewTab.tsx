import React, { useState } from 'react';
import { 
  TrendingUp, 
  Truck, 
  Boxes, 
  Scale, 
  AlertTriangle, 
  Flame, 
  CheckCircle2, 
  ArrowUpRight, 
  ChevronRight, 
  Clock, 
  Navigation, 
  Layers, 
  MapPin,
  ExternalLink,
  ShieldCheck,
  Fuel,
  RefreshCw
} from 'lucide-react';
import { 
  TPSLocation, 
  VehicleSpecs, 
  TrafficAlert, 
  NotificationItem, 
  DailyTonnageRecord, 
  WasteComposition,
  DesktopTab
} from '../../../types/smartwaste';
import { dailyTonnageData, wasteCompositionData } from '../../../data/mockData';

interface DesktopOverviewTabProps {
  tpsList: TPSLocation[];
  fleetList: VehicleSpecs[];
  trafficAlerts: TrafficAlert[];
  notifications: NotificationItem[];
  onNavigateTab: (tab: DesktopTab) => void;
  onDispatchFleet: (tps: TPSLocation) => void;
}

export const DesktopOverviewTab: React.FC<DesktopOverviewTabProps> = ({
  tpsList,
  fleetList,
  trafficAlerts,
  notifications,
  onNavigateTab,
  onDispatchFleet,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(6); // latest day: 29 Des

  // Critical TPS sorted by fill percentage descending
  const topCriticalTPS = [...tpsList]
    .filter((t) => t.id !== 'TPA-BNW-00')
    .sort((a, b) => b.fillPercentage - a.fillPercentage)
    .slice(0, 5);

  const activeFleetCount = fleetList.filter((f) => f.status === 'active').length;
  const standbyFleetCount = fleetList.filter((f) => f.status === 'standby').length;
  const maintenanceFleetCount = fleetList.filter((f) => f.status === 'maintenance').length;
  const totalFleetCount = 48; // Total fleet under DLH Surabaya

  // SVG Area Chart Calculations
  const maxTonnage = 1350;
  const minTonnage = 1150;
  const chartWidth = 520;
  const chartHeight = 170;
  const points = dailyTonnageData.map((d, i) => {
    const x = (i / (dailyTonnageData.length - 1)) * chartWidth;
    const y = chartHeight - ((d.tonnage - minTonnage) / (maxTonnage - minTonnage)) * chartHeight;
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '');
  const areaD = `${pathD} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* 4 Primary KPI Summary Cards (Exactly from PDF Figure 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Sampah Masuk TPA */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">
              Total Sampah Masuk TPA
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              1.285,4
            </span>
            <span className="text-xs text-slate-400 font-semibold font-mono">TON</span>
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-bold flex items-center">
              +4.2% <TrendingUp className="w-3.5 h-3.5 ml-0.5" />
            </span>
            <span className="text-slate-400">dibanding hari kemarin</span>
          </div>
        </div>

        {/* Card 2: Sampah Diangkut Hari Ini */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">
              Sampah Diangkut Hari Ini
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              412,6
            </span>
            <span className="text-xs text-slate-400 font-semibold font-mono">TON</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
            <span>Target Harian: 580 Ton</span>
            <span className="font-mono text-blue-400 font-bold">71.1% Tercapai</span>
          </div>
        </div>

        {/* Card 3: Jumlah TPS Aktif */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">
              Jumlah TPS Terhubung
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              286
            </span>
            <span className="text-xs text-slate-400 font-semibold font-mono">TPS</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-red-400 font-semibold">
              3 TPS Kritis (&gt;80%)
            </span>
            <span className="text-emerald-400 font-mono">98.6% Online</span>
          </div>
        </div>

        {/* Card 4: Armada Beroperasi */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">
              Armada Beroperasi
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              42
            </span>
            <span className="text-xs text-slate-400 font-semibold font-mono">/ 48 Unit</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">87.5% Tingkat Utilisasi</span>
            <span className="font-mono">4 Siaga · 2 Servis</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Tonnage Trend Chart & Waste Composition Donut (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Tren Massa Sampah di TPA (2 spans) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Tren Massa Sampah Masuk di TPA Benowo (7 Hari Terakhir)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Data real-time jembatan timbang (Weighbridge) PLTSa & Sanitary Landfill Benowo
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-bold font-mono text-emerald-400">
                1.285,4 Ton
              </span>
              <p className="text-[11px] text-slate-500 font-mono">Puncak Terkini (29 Des)</p>
            </div>
          </div>

          {/* SVG Line & Area Chart */}
          <div className="relative w-full h-48 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 overflow-hidden">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
              <line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
              <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />

              {/* Area Fill */}
              <path d={areaD} fill="url(#areaGrad)" />

              {/* Line Stroke */}
              <path d={pathD} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data Points */}
              {points.map((pt, idx) => (
                <g key={idx} className="cursor-pointer" onClick={() => setSelectedDayIndex(idx)}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={selectedDayIndex === idx ? "5" : "3.5"}
                    fill={selectedDayIndex === idx ? "#34D399" : "#10B981"}
                    stroke="#0F172A"
                    strokeWidth="1.5"
                  />
                  {selectedDayIndex === idx && (
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {pt.data.tonnage} T
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Date Axis Badges */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono px-2">
            {dailyTonnageData.map((d, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                className={`py-1 px-2 rounded-lg transition ${
                  selectedDayIndex === idx
                    ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                    : 'hover:text-white'
                }`}
              >
                {d.day}
              </button>
            ))}
          </div>
        </div>

        {/* Donut Chart: Komposisi Sampah di TPA (1 span) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Komposisi Sampah TPA
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Karakteristik DLH</span>
          </div>

          {/* Circular Donut Simulation */}
          <div className="flex items-center justify-center my-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Organik: 58.2% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#1B5E20" strokeWidth="14" strokeDasharray="212 360" strokeDashoffset="0" />
                {/* Residu: 16.2% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#D97706" strokeWidth="14" strokeDasharray="59 360" strokeDashoffset="-212" />
                {/* Plastik: 14.8% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0284C7" strokeWidth="14" strokeDasharray="54 360" strokeDashoffset="-271" />
                {/* Kertas: 8.1% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#4CAF50" strokeWidth="14" strokeDasharray="29 360" strokeDashoffset="-325" />
                {/* Logam: 2.7% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#64748B" strokeWidth="14" strokeDasharray="10 360" strokeDashoffset="-354" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-white font-mono">58.2%</span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase">Organik</span>
              </div>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
            {wasteCompositionData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px]">{item.category}</span>
                </div>
                <span className="font-mono font-bold text-[11px] text-white">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Section: Top 5 Highest Volume TPS Table & Fleet Status & Traffic Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table: Top 5 TPS dengan Volume Tertinggi (2 Spans) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Top 5 TPS dengan Volume Tertinggi (Perlu Prioritas Angkut)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Peringkat real-time sensor ultrasonik level kontainer TPS Surabaya
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('tps_monitor')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Semua 286 TPS</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold font-mono text-[11px]">
                  <th className="py-2.5 px-3">No</th>
                  <th className="py-2.5 px-3">Nama & Kode TPS</th>
                  <th className="py-2.5 px-3">Kecamatan</th>
                  <th className="py-2.5 px-3">Volume Sampah</th>
                  <th className="py-2.5 px-3">Kapasitas</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {topCriticalTPS.map((tps, idx) => {
                  const isCritical = tps.fillPercentage >= 80;
                  const isWarning = tps.fillPercentage >= 50 && tps.fillPercentage < 80;
                  return (
                    <tr key={tps.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-400">
                        0{idx + 1}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{tps.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{tps.code}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {tps.district}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="font-bold text-white">{tps.currentVolumeM3}</span>
                        <span className="text-slate-500"> / {tps.capacityM3} m³</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${
                                isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${tps.fillPercentage}%` }}
                            />
                          </div>
                          <span className={`font-mono font-bold ${
                            isCritical ? 'text-red-400' : 'text-slate-300'
                          }`}>
                            {tps.fillPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isCritical
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {isCritical ? 'KRITIS' : 'WASPADA'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onDispatchFleet(tps)}
                          className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] transition shadow-xs"
                        >
                          Disposisi Armada
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Fleet Status & Real-time Traffic (1 Span) */}
        <div className="space-y-6">
          {/* Status Armada Ringkas */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Status Armada DLH (48 Unit)
              </h3>
              <button
                onClick={() => onNavigateTab('fleet_tracking')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Peta GIS
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-white">42 Beroperasi</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">On Duty Rutin</span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs font-semibold text-white">4 Standby</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Pool Menur & Benowo</span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-slate-500" />
                  <span className="text-xs font-semibold text-white">2 Pemeliharaan</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Bengkel Bratang</span>
              </div>
            </div>
          </div>

          {/* Kondisi Lalu Lintas Surabaya */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Lalu Lintas Koridor Pengangkutan
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">LIVE CCTV</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {trafficAlerts.map((traffic) => (
                <div key={traffic.id} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white truncate pr-2">
                      {traffic.streetName}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold shrink-0 ${
                      traffic.condition === 'heavy'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : traffic.condition === 'moderate'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {traffic.condition === 'heavy' ? `Macet (+${traffic.delayMinutes}m)` : traffic.condition === 'moderate' ? `Padat (+${traffic.delayMinutes}m)` : 'Lancar'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {traffic.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

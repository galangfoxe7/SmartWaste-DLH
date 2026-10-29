import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  Filter, 
  MapPin, 
  Navigation, 
  Radio, 
  Compass, 
  Gauge, 
  Fuel, 
  Weight, 
  CheckCircle2, 
  Phone, 
  Send, 
  Layers,
  ChevronRight,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { VehicleSpecs, TPSLocation, TrafficAlert } from '../../../types/smartwaste';

interface DesktopFleetMapTabProps {
  fleetList: VehicleSpecs[];
  tpsList: TPSLocation[];
  trafficAlerts: TrafficAlert[];
  onOpenMobileViewWithVehicle: (vehicle: VehicleSpecs) => void;
}

export const DesktopFleetMapTab: React.FC<DesktopFleetMapTabProps> = ({
  fleetList,
  tpsList,
  trafficAlerts,
  onOpenMobileViewWithVehicle,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('ARM-A07');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'standby' | 'maintenance'>('all');
  const [showTrafficOverlay, setShowTrafficOverlay] = useState(true);

  const selectedVehicle = fleetList.find((v) => v.id === selectedVehicleId) || fleetList[3];

  const filteredFleet = fleetList.filter((v) => {
    const matchesSearch = v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (v.currentLocationName && v.currentLocationName.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950">
      {/* Left Sidebar: Fleet List & Search Filter (380px) */}
      <div className="w-96 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
        {/* Search & Header */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Daftar Armada Pengangkut
              </h3>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-full border border-slate-700">
              {filteredFleet.length} Unit
            </span>
          </div>

          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Plat (L 6678 GH), Kode (A07), Driver..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-600 transition"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 py-1 rounded-lg font-semibold transition ${
                statusFilter === 'all' ? 'bg-emerald-900 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({fleetList.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`flex-1 py-1 rounded-lg font-semibold transition ${
                statusFilter === 'active' ? 'bg-emerald-900 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Beroperasi ({fleetList.filter((f) => f.status === 'active').length})
            </button>
            <button
              onClick={() => setStatusFilter('standby')}
              className={`flex-1 py-1 rounded-lg font-semibold transition ${
                statusFilter === 'standby' ? 'bg-emerald-900 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Siaga ({fleetList.filter((f) => f.status === 'standby').length})
            </button>
          </div>
        </div>

        {/* Fleet Scrollable Cards */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-2 space-y-1.5">
          {filteredFleet.map((vehicle) => {
            const isSelected = selectedVehicle.id === vehicle.id;
            const loadPercent = Math.round((vehicle.currentLoadTons / vehicle.maxLoadTons) * 100);

            return (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicleId(vehicle.id)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-600 ring-1 ring-emerald-500/20'
                    : 'bg-slate-900/90 border-slate-800 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold font-mono text-xs ${
                      vehicle.status === 'active'
                        ? 'bg-emerald-800 text-white'
                        : vehicle.status === 'standby'
                        ? 'bg-blue-800 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {vehicle.id.replace('ARM-', '')}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs">
                          {vehicle.id}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {vehicle.plateNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {vehicle.vehicleType}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    vehicle.status === 'active'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : vehicle.status === 'standby'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {vehicle.status === 'active' ? 'BEROPERASI' : vehicle.status === 'standby' ? 'STANDBY' : 'SERVIS'}
                  </span>
                </div>

                {/* Location & Speed */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 truncate max-w-[200px]">
                    📍 {vehicle.currentLocationName || 'Pusat Kota Surabaya'}
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {vehicle.speedKmH ? `${vehicle.speedKmH} km/h` : '0 km/h'}
                  </span>
                </div>

                {/* Load Bar */}
                <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>Muatan:</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        loadPercent > 80 ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                  <span className="font-bold text-white">
                    {vehicle.currentLoadTons} / {vehicle.maxLoadTons} T
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Center GIS Vector Map (Flexible Area) */}
      <div className="flex-1 relative flex flex-col bg-[#E5ECE5] overflow-hidden">
        {/* Top Floating Map Controls */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div className="bg-slate-900/90 backdrop-blur-md rounded-xl p-2 px-3 border border-slate-800 text-xs text-white flex items-center gap-2 shadow-md">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Pelacakan Satelit GPS DLH Surabaya · Refresh 2s</span>
          </div>

          <button
            onClick={() => setShowTrafficOverlay(!showTrafficOverlay)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md transition flex items-center gap-1.5 ${
              showTrafficOverlay
                ? 'bg-emerald-800 text-white'
                : 'bg-slate-900/90 text-slate-300 border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layer Lalu Lintas</span>
          </button>
        </div>

        {/* SVG Surabaya Vector GIS Canvas */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full object-cover select-none cursor-grab active:cursor-grabbing"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="mapWater" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9E5F2" />
              <stop offset="100%" stopColor="#A8D5EA" />
            </linearGradient>
          </defs>

          {/* Landmass */}
          <rect width="100" height="100" fill="#E8EFE8" />

          {/* Selat Madura & Coastline */}
          <path
            d="M 0,0 L 100,0 L 100,12 Q 80,18 60,10 T 30,14 Q 15,10 0,6 Z"
            fill="url(#mapWater)"
          />
          {/* Suramadu Bridge */}
          <line x1="72" y1="0" x2="72" y2="10" stroke="#64748B" strokeWidth="0.8" strokeDasharray="1,1" />

          {/* Kalimas River */}
          <path
            d="M 16,18 Q 28,30 38,45 T 40,65 Q 42,80 48,92"
            fill="none"
            stroke="#B5D9EC"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Surabaya Roads */}
          <path d="M 80,12 L 78,35 Q 76,55 78,75 L 82,95" fill="none" stroke="#CBD5E1" strokeWidth="2.2" />
          <path d="M 38,45 L 42,65 L 40,95" fill="none" stroke="#CBD5E1" strokeWidth="3.0" />
          <path d="M 16,18 Q 24,30 38,45" fill="none" stroke="#CBD5E1" strokeWidth="2.4" />
          <path d="M 20,50 L 40,55 L 70,45 L 88,48" fill="none" stroke="#CBD5E1" strokeWidth="2.0" />

          {/* Traffic Overlays */}
          {showTrafficOverlay && (
            <>
              <line x1="41" y1="68" x2="41" y2="78" stroke="#EF4444" strokeWidth="3.2" strokeLinecap="round" opacity="0.85" />
              <line x1="52" y1="56" x2="60" y2="54" stroke="#F59E0B" strokeWidth="2.6" strokeLinecap="round" opacity="0.8" />
              <line x1="78" y1="50" x2="78" y2="75" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
            </>
          )}

          {/* TPS Pins */}
          {tpsList.map((tps) => {
            const isCritical = tps.fillPercentage >= 80;
            const isDone = tps.taskStatus === 'completed';
            const color = isCritical ? '#DC2626' : isDone ? '#059669' : '#D97706';
            return (
              <g key={tps.id}>
                <circle cx={tps.coordinates.mapX} cy={tps.coordinates.mapY} r="2.2" fill={color} stroke="#FFFFFF" strokeWidth="0.6" />
                <text x={tps.coordinates.mapX} y={tps.coordinates.mapY + 0.8} fill="#FFFFFF" fontSize="1.8" fontWeight="bold" textAnchor="middle">
                  {isDone ? '✓' : `${tps.fillPercentage}%`}
                </text>
              </g>
            );
          })}

          {/* Fleet Vehicles Markers (A01 - A12) */}
          {fleetList.map((vehicle) => {
            if (!vehicle.coordinates) return null;
            const isSelected = selectedVehicle.id === vehicle.id;
            const isTruckActive = vehicle.status === 'active';
            const markerBg = isSelected ? '#0D9488' : isTruckActive ? '#064E3B' : '#475569';

            return (
              <g
                key={vehicle.id}
                onClick={() => setSelectedVehicleId(vehicle.id)}
                className="cursor-pointer transition-transform hover:scale-125"
                style={{ transformOrigin: `${vehicle.coordinates.mapX}% ${vehicle.coordinates.mapY}%` }}
              >
                {/* Ping circle if selected */}
                {isSelected && (
                  <circle
                    cx={vehicle.coordinates.mapX}
                    cy={vehicle.coordinates.mapY}
                    r="4.5"
                    fill="none"
                    stroke="#0D9488"
                    strokeWidth="0.8"
                    className="animate-ping"
                  />
                )}

                {/* Truck Disc Marker */}
                <circle
                  cx={vehicle.coordinates.mapX}
                  cy={vehicle.coordinates.mapY}
                  r="3.2"
                  fill={markerBg}
                  stroke="#FFFFFF"
                  strokeWidth="0.8"
                />

                {/* Arrow / Vehicle Indicator */}
                <polygon
                  points={`${vehicle.coordinates.mapX},${vehicle.coordinates.mapY - 1.8} ${vehicle.coordinates.mapX - 1.2},${vehicle.coordinates.mapY + 1.2} ${vehicle.coordinates.mapX},${vehicle.coordinates.mapY + 0.5} ${vehicle.coordinates.mapX + 1.2},${vehicle.coordinates.mapY + 1.2}`}
                  fill="#34D399"
                />

                {/* Truck ID Text */}
                <rect
                  x={vehicle.coordinates.mapX - 4.5}
                  y={vehicle.coordinates.mapY + 3.8}
                  width="9"
                  height="3.2"
                  rx="1"
                  fill="#0F172A"
                  opacity="0.9"
                />
                <text
                  x={vehicle.coordinates.mapX}
                  y={vehicle.coordinates.mapY + 6.0}
                  fill="#FFFFFF"
                  fontSize="2.0"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {vehicle.id.replace('ARM-', '')}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Bottom Legend Overlay */}
        <div className="absolute left-4 bottom-4 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-slate-800 text-xs text-slate-300 flex items-center gap-5 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <span>Armada Beroperasi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            <span>TPA Benowo Hauler</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600" />
            <span>TPS Kritis (&gt;80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Macet Lalu Lintas</span>
          </div>
        </div>
      </div>

      {/* Right Drawer: Selected Vehicle Telemetry & Dispatch Console (340px) */}
      <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 select-none p-5 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">
                {selectedVehicle.id}
              </span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                {selectedVehicle.plateNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedVehicle.vehicleType}
            </p>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block flex items-center gap-1">
              <Weight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Muatan Aktual</span>
            </span>
            <p className="text-sm font-bold font-mono text-white mt-1">
              {selectedVehicle.currentLoadTons} / {selectedVehicle.maxLoadTons} Ton
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
              <span>Sisa Solar</span>
            </span>
            <p className="text-sm font-bold font-mono text-white mt-1">
              {selectedVehicle.fuelPercentage}%
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-blue-400" />
              <span>Tekanan Hidrolik</span>
            </span>
            <p className="text-sm font-bold font-mono text-white mt-1">
              {selectedVehicle.hydraulicPressurePsi} PSI
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>Kecepatan</span>
            </span>
            <p className="text-sm font-bold font-mono text-white mt-1">
              {selectedVehicle.speedKmH || 0} km/h
            </p>
          </div>
        </div>

        {/* Crew Info Card */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Kru Petugas Lapangan
          </span>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white">{selectedVehicle.driverName}</p>
              <p className="text-[11px] text-slate-400">Driver Utama</p>
            </div>
            <button
              onClick={() => alert(`Memanggil HT / Telepon Driver ${selectedVehicle.driverName}`)}
              className="p-2 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition"
              title="Hubungi Driver"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span>Kernet: </span>
            <span className="text-slate-200 font-medium">{selectedVehicle.copilotName}</span>
          </div>
        </div>

        {/* Assigned Route */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Penugasan Rute
          </span>
          <p className="font-semibold text-emerald-400 leading-snug">
            {selectedVehicle.assignedRouteName || 'Rute Reguler Pengangkutan DLH'}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Lokasi: {selectedVehicle.currentLocationName || 'Surabaya'}
          </p>
        </div>

        {/* Direct Action: Open Driver's Phone View */}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={() => onOpenMobileViewWithVehicle(selectedVehicle)}
            className="w-full h-10 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition"
          >
            <Navigation className="w-4 h-4" />
            <span>Buka Layar HP Driver ({selectedVehicle.id})</span>
          </button>
          <button
            type="button"
            onClick={() => alert(`Disposisi reroute darurat berhasil dikirim ke perangkat pengemudi ${selectedVehicle.driverName}`)}
            className="w-full h-10 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Instruksi Disposisi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Navigation, 
  MapPin, 
  Clock, 
  Compass, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  ChevronUp, 
  ChevronDown, 
  Volume2, 
  Maximize2,
  RefreshCw,
  Truck,
  Eye,
  CornerDownRight,
  ShieldAlert
} from 'lucide-react';
import { TPSLocation, TrafficAlert, VehicleSpecs } from '../../types/smartwaste';

interface MapNavigationScreenProps {
  tpsList: TPSLocation[];
  selectedTps: TPSLocation | null;
  onSelectTps: (tps: TPSLocation) => void;
  vehicle: VehicleSpecs;
  trafficAlerts: TrafficAlert[];
  onOpenCollectionModal: (tps: TPSLocation) => void;
}

export const MapNavigationScreen: React.FC<MapNavigationScreenProps> = ({
  tpsList,
  selectedTps,
  onSelectTps,
  vehicle,
  trafficAlerts,
  onOpenCollectionModal,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'critical' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [isSimulatingDriving, setIsSimulatingDriving] = useState(true);
  const [truckPos, setTruckPos] = useState({ x: 50, y: 70 });
  const [showTrafficLayer, setShowTrafficLayer] = useState(true);

  // Default to first active TPS if none selected
  const activeTps = selectedTps || tpsList.find((t) => t.taskStatus === 'in_progress') || tpsList[1];

  // Simulated GPS movement along Surabaya corridor
  useEffect(() => {
    if (!isSimulatingDriving) return;
    const interval = setInterval(() => {
      setTruckPos((prev) => {
        // Subtle realistic GPS jitter/drift towards destination
        const targetX = activeTps.coordinates.mapX;
        const targetY = activeTps.coordinates.mapY;
        const dx = (targetX - prev.x) * 0.08;
        const dy = (targetY - prev.y) * 0.08;
        return {
          x: Math.round((prev.x + dx) * 10) / 10,
          y: Math.round((prev.y + dy) * 10) / 10,
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isSimulatingDriving, activeTps]);

  const filteredTPS = tpsList.filter((tps) => {
    const matchesSearch = tps.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tps.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tps.district.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'critical') return tps.fillPercentage >= 80;
    if (filterMode === 'pending') return tps.taskStatus !== 'completed';
    return true;
  });

  return (
    <div className="flex-1 relative flex flex-col bg-slate-100 overflow-hidden select-none">
      {/* Floating Top Search & Filter Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 space-y-2">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-2xl p-1.5 px-3 border border-slate-200/90 shadow-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari TPS (Keputih, Rungkut, Wonokromo)..."
            className="flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none py-1.5"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] text-slate-400 hover:text-slate-600 px-1"
            >
              ×
            </button>
          )}
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <button
            onClick={() => setShowTrafficLayer(!showTrafficLayer)}
            title="Layer Lalu Lintas Surabaya"
            className={`p-1.5 rounded-lg text-xs transition ${
              showTrafficLayer ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition shadow-xs ${
              filterMode === 'all'
                ? 'bg-emerald-900 text-white'
                : 'bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-white'
            }`}
          >
            Semua TPS ({tpsList.length})
          </button>
          <button
            onClick={() => setFilterMode('critical')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition shadow-xs flex items-center gap-1 ${
              filterMode === 'critical'
                ? 'bg-red-700 text-white'
                : 'bg-white/90 text-red-700 border border-red-200 hover:bg-red-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>Kritis &gt;80%</span>
          </button>
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition shadow-xs ${
              filterMode === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-white'
            }`}
          >
            Antrean Belum Diangkut
          </button>
        </div>
      </div>

      {/* Interactive Vector GIS Map Canvas */}
      <div className="flex-1 w-full h-full relative bg-[#E5ECE5] overflow-hidden">
        {/* SVG Base Map of Surabaya City */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full object-cover select-none cursor-grab active:cursor-grabbing"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Water gradient for Selat Madura & Kalimas */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9E5F2" />
              <stop offset="100%" stopColor="#A8D5EA" />
            </linearGradient>

            {/* Pattern for Surabaya greenery / eco parks */}
            <pattern id="parkPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#C2DEC0" opacity="0.6" />
            </pattern>
          </defs>

          {/* Background Landmass (Surabaya) */}
          <rect width="100" height="100" fill="#E8EFE8" />

          {/* North Coast / Selat Madura (Surabaya Utara & Jembatan Suramadu) */}
          <path
            d="M 0,0 L 100,0 L 100,12 Q 80,18 60,10 T 30,14 Q 15,10 0,6 Z"
            fill="url(#waterGrad)"
          />

          {/* Suramadu Bridge indication */}
          <line x1="72" y1="0" x2="72" y2="10" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="1,1" />

          {/* Kalimas River network meandering through city */}
          <path
            d="M 16,18 Q 28,30 38,45 T 40,65 Q 42,80 48,92"
            fill="none"
            stroke="#B5D9EC"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 40,65 Q 60,68 85,75"
            fill="none"
            stroke="#B5D9EC"
            strokeWidth="1.2"
          />

          {/* Surabaya Major Ring Roads & Corridors */}
          {/* Middle East Ring Road (MERR) */}
          <path
            d="M 80,12 L 78,35 Q 76,55 78,75 L 82,95"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="2.2"
          />
          {/* Jl. Ahmad Yani Corridor (South Surabaya) */}
          <path
            d="M 38,45 L 42,65 L 40,95"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="3.0"
          />
          {/* Western Expressway to TPA Benowo */}
          <path
            d="M 16,18 Q 24,30 38,45"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="2.4"
          />
          {/* East-West Connector (Jl. Mayjen Sungkono - Ngagel - Manyar - Sukolilo) */}
          <path
            d="M 20,50 L 40,55 L 70,45 L 88,48"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="2.0"
          />

          {/* Real-time Traffic Congestion Overlays */}
          {showTrafficLayer && (
            <>
              {/* Jl. Ahmad Yani Heavy Traffic (Red) */}
              <line
                x1="41"
                y1="68"
                x2="41"
                y2="78"
                stroke="#EF4444"
                strokeWidth="3.2"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Jl. Ngagel Moderate Traffic (Amber) */}
              <line
                x1="52"
                y1="56"
                x2="60"
                y2="54"
                stroke="#F59E0B"
                strokeWidth="2.6"
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* MERR Free Flowing (Green) */}
              <line
                x1="78"
                y1="50"
                x2="78"
                y2="75"
                stroke="#10B981"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.8"
              />
            </>
          )}

          {/* Optimized Route Polyline (SmartWaste Recommendation) */}
          {/* Wonokromo -> Rungkut -> Keputih -> Menur -> Gunung Anyar -> TPA Benowo */}
          <path
            d="M 38,62 Q 48,72 62,78 T 82,48 T 70,38 T 84,88"
            fill="none"
            stroke="#1B5E20"
            strokeWidth="1.8"
            strokeDasharray="2,1.5"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Active Navigation Path from Vehicle to Target TPS */}
          <line
            x1={truckPos.x}
            y1={truckPos.y}
            x2={activeTps.coordinates.mapX}
            y2={activeTps.coordinates.mapY}
            stroke="#059669"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* TPS Map Markers */}
          {filteredTPS.map((tps) => {
            const isSelected = activeTps.id === tps.id;
            const isDone = tps.taskStatus === 'completed';
            const isCritical = tps.fillPercentage >= 80;
            const isWarning = tps.fillPercentage >= 50 && tps.fillPercentage < 80;

            let markerColor = '#10B981'; // Green
            if (isCritical) markerColor = '#DC2626'; // Red
            else if (isWarning) markerColor = '#F59E0B'; // Amber
            if (isDone) markerColor = '#059669'; // Emerald
            if (tps.id === 'TPA-BNW-00') markerColor = '#0284C7'; // Blue for TPA

            return (
              <g 
                key={tps.id}
                onClick={() => onSelectTps(tps)}
                className="cursor-pointer transition-transform hover:scale-110"
                style={{ transformOrigin: `${tps.coordinates.mapX}% ${tps.coordinates.mapY}%` }}
              >
                {/* Glow ring if selected */}
                {isSelected && (
                  <circle
                    cx={tps.coordinates.mapX}
                    cy={tps.coordinates.mapY}
                    r="4.5"
                    fill="none"
                    stroke={markerColor}
                    strokeWidth="0.8"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}

                {/* Pin shadow */}
                <ellipse
                  cx={tps.coordinates.mapX}
                  cy={tps.coordinates.mapY + 1.2}
                  rx="2.2"
                  ry="1.0"
                  fill="rgba(0,0,0,0.2)"
                />

                {/* Marker Body */}
                <circle
                  cx={tps.coordinates.mapX}
                  cy={tps.coordinates.mapY}
                  r={isSelected ? "3.2" : "2.5"}
                  fill={markerColor}
                  stroke="#FFFFFF"
                  strokeWidth="0.8"
                />

                {/* Label badge */}
                <text
                  x={tps.coordinates.mapX}
                  y={tps.coordinates.mapY + 0.9}
                  fill="#FFFFFF"
                  fontSize="2.1"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {isDone ? '✓' : `${tps.fillPercentage}%`}
                </text>
              </g>
            );
          })}

          {/* Active Vehicle (Truk Kompaktor A07) GPS Icon */}
          <g
            className="transition-all duration-1000 ease-linear pointer-events-none"
            style={{ transformOrigin: `${truckPos.x}% ${truckPos.y}%` }}
          >
            {/* GPS pulse beacon */}
            <circle
              cx={truckPos.x}
              cy={truckPos.y}
              r="4.2"
              fill="#059669"
              opacity="0.25"
            />
            {/* Truck base disk */}
            <circle
              cx={truckPos.x}
              cy={truckPos.y}
              r="2.8"
              fill="#064E3B"
              stroke="#FFFFFF"
              strokeWidth="0.8"
            />
            {/* Direction Arrow */}
            <polygon
              points={`${truckPos.x},${truckPos.y - 1.8} ${truckPos.x - 1.3},${truckPos.y + 1.3} ${truckPos.x},${truckPos.y + 0.6} ${truckPos.x + 1.3},${truckPos.y + 1.3}`}
              fill="#34D399"
            />
          </g>
        </svg>

        {/* Floating Map Controls (Right Side) */}
        <div className="absolute right-3 top-24 z-10 flex flex-col gap-2">
          {/* Compass / Recenter */}
          <button
            onClick={() => setTruckPos({ x: 50, y: 70 })}
            title="Pusatkan ke Armada A07"
            className="w-9 h-9 rounded-xl bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-emerald-800 transition"
          >
            <Compass className="w-5 h-5 text-emerald-800" />
          </button>

          {/* Driving Sim toggle */}
          <button
            onClick={() => setIsSimulatingDriving(!isSimulatingDriving)}
            title="Toggle Simulasi GPS"
            className={`w-9 h-9 rounded-xl shadow-md border border-slate-200 flex items-center justify-center transition text-xs font-mono font-bold ${
              isSimulatingDriving ? 'bg-emerald-800 text-white' : 'bg-white text-slate-500'
            }`}
          >
            GPS
          </button>
        </div>

        {/* Map Legend (Bottom Left above sheet) */}
        <div className="absolute left-3 bottom-52 z-10 bg-white/90 backdrop-blur-md rounded-xl p-2 border border-slate-200/80 shadow-xs text-[10px] space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span className="text-slate-700 font-medium">Kritis (&gt;80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-700 font-medium">Waspada (50-80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-slate-700 font-medium">Normal / Selesai</span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Navigation Drawer */}
      <div 
        className={`shrink-0 bg-white border-t border-slate-200/90 rounded-t-3xl shadow-xl z-30 transition-all duration-300 ${
          isSheetExpanded ? 'h-80' : 'h-48'
        }`}
      >
        {/* Grab Handle */}
        <button
          onClick={() => setIsSheetExpanded(!isSheetExpanded)}
          className="w-full pt-2.5 pb-1 flex flex-col items-center justify-center cursor-pointer"
          aria-label={isSheetExpanded ? 'Kecilkan Panel Navigasi' : 'Perluas Panel Navigasi'}
        >
          <div className="w-10 h-1 bg-slate-300 rounded-full mb-1" />
        </button>

        <div className="px-5 pb-3 overflow-y-auto max-h-[calc(100%-24px)]">
          {/* Main Destination ETA Bar */}
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTps.fillPercentage >= 80 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {activeTps.id === 'TPA-BNW-00' ? 'Pusat Pemrosesan Akhir' : `TPS Urutan #${activeTps.assignedOrder}`}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {activeTps.code}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 truncate">
                {activeTps.name}
              </h2>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {activeTps.address}
              </p>
            </div>

            {/* ETA Box */}
            <div className="text-right shrink-0">
              <span className="text-lg font-extrabold text-emerald-800 font-mono">
                14 mnt
              </span>
              <p className="text-[11px] text-slate-500 font-mono">
                4.2 km · 28 km/h
              </p>
            </div>
          </div>

          {/* Turn-by-Turn Maneuver Pill */}
          <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <CornerDownRight className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <p className="font-semibold text-slate-800 truncate">
                Dalam 350m, Belok Kanan ke Jl. Rungkut Madya
              </p>
              <p className="text-[11px] text-slate-500">
                Menuju gerbang TPS Sukolilo
              </p>
            </div>
          </div>

          {/* Expanded Details when sheet is pulled up */}
          {isSheetExpanded && (
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Sensor Volume</span>
                <span className={`font-mono font-bold ${
                  activeTps.fillPercentage >= 80 ? 'text-red-600' : 'text-slate-800'
                }`}>
                  {activeTps.fillPercentage}% ({activeTps.currentVolumeM3} m³)
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Status CCTV TPS</span>
                <span className="font-medium text-emerald-700">
                  {activeTps.cctvActive ? 'Live Aktif' : 'Offline'}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Estimasi Timbang</span>
                <span className="font-mono font-bold text-slate-800">
                  ~1.5 Ton
                </span>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenCollectionModal(activeTps)}
              className="flex-1 h-11 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-900/15 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tiba & Catat Pengangkutan</span>
            </button>
            <button
              type="button"
              onClick={() => alert(`Menghubungkan ke Pusat Kendali DLH Surabaya untuk TPS: ${activeTps.name}`)}
              className="w-11 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center transition shrink-0"
              title="Lapor Kendala Lalu Lintas"
            >
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

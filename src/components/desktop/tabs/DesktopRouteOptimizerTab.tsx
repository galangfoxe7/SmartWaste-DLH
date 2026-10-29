import React, { useState } from 'react';
import { 
  Route, 
  Sparkles, 
  TrendingDown, 
  Fuel, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Sliders, 
  Send, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { TPSLocation, VehicleSpecs } from '../../../types/smartwaste';

interface DesktopRouteOptimizerTabProps {
  tpsList: TPSLocation[];
  fleetList: VehicleSpecs[];
}

export const DesktopRouteOptimizerTab: React.FC<DesktopRouteOptimizerTabProps> = ({
  tpsList,
  fleetList,
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [trafficAvoidanceWeight, setTrafficAvoidanceWeight] = useState(85);
  const [criticalThreshold, setCriticalThreshold] = useState(80);
  const [priorityTps, setPriorityTps] = useState('TPS Keputih Sukolilo (95%)');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleRunOptimization = () => {
    setIsOptimizing(true);
    setAppliedSuccess(false);
    setTimeout(() => {
      setIsOptimizing(false);
      setAppliedSuccess(true);
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Route className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Model Optimasi Rute Cerdas & Penjadwalan Armada DLH
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Algoritma multi-objektif berbasis GIS, sensor volume IoT, dan kondisi lalu lintas real-time Surabaya
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunOptimization}
          disabled={isOptimizing}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-emerald-950 transition cursor-pointer"
        >
          {isOptimizing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Menghitung Rute Heuristik...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Jalankan Rekomendasi Rute Optimal</span>
            </>
          )}
        </button>
      </div>

      {/* Optimization Parameters & Input Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Span: Parameter Tuning Console */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Parameter Algoritma Optimasi
            </h3>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Bobot Penghindaran Kemacetan</span>
              <span className="font-mono font-bold text-emerald-400">{trafficAvoidanceWeight}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={trafficAvoidanceWeight}
              onChange={(e) => setTrafficAvoidanceWeight(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-0.5">
              Prioritaskan jalur arteri lancar (MERR & Frontage) menghindari Jl. A. Yani
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Ambang Batas TPS Prioritas Tinggi</span>
              <span className="font-mono font-bold text-red-400">{criticalThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(Number(e.target.value))}
              className="w-full accent-red-500"
            />
            <p className="text-[11px] text-slate-500 mt-0.5">
              TPS di atas batas ini otomatis dijadwalkan pada urutan penjemputan awal
            </p>
          </div>

          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-300 block mb-1">
              Target Pemrosesan Akhir
            </span>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <p className="font-bold text-white">TPA Benowo (PLTSa & Landfill)</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Kapasitas Harian: 1.500 Ton · Jembatan Timbang Aktif</p>
            </div>
          </div>
        </div>

        {/* Right 2 Spans: Before vs After Comparison Matrix */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Evaluasi Hasil Optimasi Rute (Sebelum vs Sesudah)
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-semibold">
              Efisiensi Terverifikasi ✓
            </span>
          </div>

          {/* 3 Metric Cards Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Waktu Tempuh Rute</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-emerald-400">142 mnt</span>
                <span className="text-xs font-mono text-slate-500 line-through">215 mnt</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1.5 flex items-center">
                <TrendingDown className="w-3 h-3 mr-0.5" /> Hemat 73 menit (-34%)
              </p>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Fuel className="w-3.5 h-3.5 text-amber-400" />
                <span>Konsumsi Solar BBM</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-emerald-400">24.8 L</span>
                <span className="text-xs font-mono text-slate-500 line-through">34.2 L</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1.5 flex items-center">
                <TrendingDown className="w-3 h-3 mr-0.5" /> Hemat 9.4 Liter (-27%)
              </p>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reduksi Emisi CO2</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-emerald-400">65.0 kg</span>
                <span className="text-xs font-mono text-slate-500 line-through">89.6 kg</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1.5 flex items-center">
                <TrendingDown className="w-3 h-3 mr-0.5" /> Reduksi 24.6 kg (SDG 13)
              </p>
            </div>
          </div>

          {/* Optimized Route Stop Sequence */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-300 block mb-2">
              Urutan Kunjungan TPS Direkomendasikan Sistem:
            </span>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-mono font-bold flex items-center justify-center text-[10px]">1</span>
                <span className="font-bold text-white">TPS Wonokromo Pasar</span>
                <span className="text-slate-500 font-mono">· Selesai (1.4 Ton)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 pl-7">
                <span className="text-[10px] text-emerald-400">↓ Reroute via Jl. Jemursari (hindari macet Royal Plaza +16m)</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-mono font-bold flex items-center justify-center text-[10px]">2</span>
                <span className="font-bold text-white">TPS Rungkut Industri</span>
                <span className="text-amber-400 font-mono">· Sedang Dituju (65% Volume)</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-red-900 text-white font-mono font-bold flex items-center justify-center text-[10px]">3</span>
                <span className="font-bold text-white">TPS Keputih Sukolilo</span>
                <span className="text-red-400 font-mono font-bold">· PRIORITAS KRITIS (95% Volume)</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono font-bold flex items-center justify-center text-[10px]">4</span>
                <span className="font-semibold text-slate-300">TPS Menur Pumpungan</span>
                <span className="text-slate-500 font-mono">· Est. 10:35 WIB</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-mono font-bold flex items-center justify-center text-[10px]">5</span>
                <span className="font-bold text-blue-400">TPA Benowo Hauling</span>
                <span className="text-slate-400 font-mono">· Pembuangan Akhir PLTSa</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Instruksi rute akan langsung masuk ke tablet / smartphone pengemudi armada.
            </span>
            <button
              type="button"
              onClick={() => alert('Rute teroptimasi berhasil dikirim dan disinkronkan ke perangkat seluruh pengemudi armada!')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Rute Baru ke Armada A07</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Truck, 
  Fuel, 
  Gauge, 
  Weight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Camera, 
  ChevronRight, 
  ChevronDown,
  FileText,
  UserCheck,
  ShieldCheck,
  Sparkles,
  MapPin
} from 'lucide-react';
import { VehicleSpecs, TPSLocation, TaskStatus } from '../../types/smartwaste';

interface VehicleTaskScreenProps {
  vehicle: VehicleSpecs;
  tpsList: TPSLocation[];
  onSelectTps: (tps: TPSLocation) => void;
  onOpenCollectionModal: (tps: TPSLocation) => void;
}

export const VehicleTaskScreen: React.FC<VehicleTaskScreenProps> = ({
  vehicle,
  tpsList,
  onSelectTps,
  onOpenCollectionModal,
}) => {
  const [expandedTpsId, setExpandedTpsId] = useState<string | null>('TPS-02');
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTPS = tpsList.filter((tps) => {
    if (filterTab === 'pending') return tps.taskStatus !== 'completed';
    if (filterTab === 'completed') return tps.taskStatus === 'completed';
    return true;
  });

  const loadPercent = Math.round((vehicle.currentLoadTons / vehicle.maxLoadTons) * 100);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4 pb-8">
      {/* Vehicle Specification Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Header of Vehicle */}
        <div className="bg-emerald-900 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center">
                <Truck className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {vehicle.id}
                  </span>
                  <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.2 rounded-full border border-emerald-700 font-mono">
                    {vehicle.plateNumber}
                  </span>
                </div>
                <p className="text-xs text-emerald-200 mt-0.5">
                  {vehicle.vehicleType}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold bg-emerald-800 text-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-700">
              Kondisi Prima
            </span>
          </div>

          {/* Tonase Capacity Progress Bar */}
          <div className="mt-4 pt-3 border-t border-emerald-800">
            <div className="flex justify-between text-xs text-emerald-100 mb-1">
              <span className="font-medium">Kapasitas Muatan Sampah</span>
              <span className="font-mono font-bold">{vehicle.currentLoadTons.toFixed(1)} / {vehicle.maxLoadTons} Ton ({loadPercent}%)</span>
            </div>
            <div className="w-full bg-emerald-950/80 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  loadPercent > 80 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, loadPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Vehicle Telemetry 3-Grid */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 p-3 bg-slate-50 text-center">
          <div className="px-2">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px]">
              <Fuel className="w-3.5 h-3.5 text-amber-600" />
              <span>Solar BBM</span>
            </div>
            <p className="text-sm font-bold font-mono text-slate-800 mt-0.5">
              {vehicle.fuelPercentage}%
            </p>
          </div>

          <div className="px-2">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px]">
              <Gauge className="w-3.5 h-3.5 text-blue-600" />
              <span>Hidrolik</span>
            </div>
            <p className="text-sm font-bold font-mono text-slate-800 mt-0.5">
              {vehicle.hydraulicPressurePsi} PSI
            </p>
          </div>

          <div className="px-2">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px]">
              <Weight className="w-3.5 h-3.5 text-emerald-700" />
              <span>Odometer</span>
            </div>
            <p className="text-sm font-bold font-mono text-slate-800 mt-0.5">
              34.1k km
            </p>
          </div>
        </div>

        {/* Crew Metadata */}
        <div className="p-3 text-xs flex items-center justify-between text-slate-600 bg-white">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Driver: <strong>{vehicle.driverName}</strong></span>
          </div>
          <span className="text-slate-400">·</span>
          <span>Kernet: <strong>{vehicle.copilotName}</strong></span>
        </div>
      </div>

      {/* Task List Header with Filter Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Daftar Tugas & Rute Pengangkutan ({tpsList.length} Titik)
          </h2>
        </div>

        {/* Segmented Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl mb-3">
          <button
            onClick={() => setFilterTab('all')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({tpsList.length})
          </button>
          <button
            onClick={() => setFilterTab('pending')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterTab === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Belum Diangkut ({tpsList.filter((t) => t.taskStatus !== 'completed').length})
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterTab === 'completed' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selesai ({tpsList.filter((t) => t.taskStatus === 'completed').length})
          </button>
        </div>

        {/* Checklist of TPS Stops */}
        <div className="space-y-3">
          {filteredTPS.map((tps) => {
            const isExpanded = expandedTpsId === tps.id;
            const isCompleted = tps.taskStatus === 'completed';
            const isInProgress = tps.taskStatus === 'in_progress';
            const isCritical = tps.fillPercentage >= 80;

            return (
              <div
                key={tps.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs ${
                  isInProgress
                    ? 'border-emerald-600 ring-2 ring-emerald-600/10'
                    : isCompleted
                    ? 'border-slate-200 opacity-90'
                    : isCritical
                    ? 'border-red-300'
                    : 'border-slate-200'
                }`}
              >
                {/* Main Stop Header */}
                <div 
                  onClick={() => setExpandedTpsId(isExpanded ? null : tps.id)}
                  className="p-3.5 flex items-start justify-between cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Order Circle */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : isInProgress
                        ? 'bg-emerald-800 text-white'
                        : isCritical
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `#${tps.assignedOrder}`}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900 truncate">
                          {tps.name}
                        </h3>
                        {isInProgress && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                            Sedang Berjalan
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {tps.district} · {tps.address}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                        <span className={`font-mono font-semibold ${
                          isCritical ? 'text-red-600' : 'text-slate-700'
                        }`}>
                          Volume: {tps.fillPercentage}% ({tps.currentVolumeM3} m³)
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500 font-mono">
                          {tps.estimatedWasteType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700'
                        : isInProgress
                        ? 'bg-amber-50 text-amber-700'
                        : isCritical
                        ? 'bg-red-50 text-red-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isCompleted ? 'Selesai' : isInProgress ? 'Menuju TPS' : isCritical ? 'Kritis' : 'Menunggu'}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details & Action Bar */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block">Jadwal Kedatangan</span>
                        <span className="font-semibold text-slate-800 font-mono">
                          {tps.arrivalTimeEstimated}
                        </span>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block">Status IoT Sensor</span>
                        <span className="font-medium text-emerald-700 font-mono">
                          Baterai {tps.iotSensorBattery}% · Online
                        </span>
                      </div>
                    </div>

                    {isCompleted ? (
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                        <p className="font-semibold text-emerald-900">
                          Pengangkutan Selesai pada {tps.collectionCompletedAt}
                        </p>
                        <p className="text-emerald-700 text-[11px] mt-0.5 font-mono">
                          Volume Terangkut: {tps.collectedWeightTons || 1.4} Ton ({tps.notes || 'Catatan lengkap tersimpan'})
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onOpenCollectionModal(tps)}
                          className="flex-1 h-10 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Catat Selesai Angkut</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectTps(tps)}
                          className="px-3 h-10 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition"
                        >
                          <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                          <span>Peta</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

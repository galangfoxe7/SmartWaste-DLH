import React, { useState } from 'react';
import { 
  DesktopTab, 
  TPSLocation, 
  VehicleSpecs, 
  TrafficAlert, 
  NotificationItem, 
  RouteStats 
} from '../../types/smartwaste';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopHeader } from './DesktopHeader';
import { DesktopOverviewTab } from './tabs/DesktopOverviewTab';
import { DesktopFleetMapTab } from './tabs/DesktopFleetMapTab';
import { DesktopTPSManagerTab } from './tabs/DesktopTPSManagerTab';
import { DesktopRouteOptimizerTab } from './tabs/DesktopRouteOptimizerTab';
import { DesktopReportsTab } from './tabs/DesktopReportsTab';
import { Sliders, CheckCircle2, ShieldCheck, Database, Bell } from 'lucide-react';

interface DesktopCommandCenterProps {
  tpsList: TPSLocation[];
  fleetList: VehicleSpecs[];
  trafficAlerts: TrafficAlert[];
  notifications: NotificationItem[];
  routeStats: RouteStats;
  onOpenMobileView: () => void;
  onOpenMobileViewWithVehicle: (vehicle: VehicleSpecs) => void;
  onOpenFigmaModal: () => void;
  onOpenFigmaCanvas: () => void;
  onDispatchFleetToTps: (tps: TPSLocation) => void;
}

export const DesktopCommandCenter: React.FC<DesktopCommandCenterProps> = ({
  tpsList,
  fleetList,
  trafficAlerts,
  notifications,
  routeStats,
  onOpenMobileView,
  onOpenMobileViewWithVehicle,
  onOpenFigmaModal,
  onOpenFigmaCanvas,
  onDispatchFleetToTps,
}) => {
  const [currentTab, setCurrentTab] = useState<DesktopTab>('overview');
  const [dispatchModalTps, setDispatchModalTps] = useState<TPSLocation | null>(null);

  const activeFleetCount = fleetList.filter((f) => f.status === 'active').length;
  const criticalTpsCount = tpsList.filter((t) => t.fillPercentage >= 80).length;

  const handleOpenDispatch = (tps: TPSLocation) => {
    setDispatchModalTps(tps);
  };

  const handleConfirmDispatch = (vehicleId: string) => {
    if (dispatchModalTps) {
      alert(`Armada ${vehicleId} berhasil didisposisikan untuk segera menjemput sampah di ${dispatchModalTps.name}! Notifikasi disposisi rute terkirim ke perangkat pengemudi.`);
      onDispatchFleetToTps(dispatchModalTps);
      setDispatchModalTps(null);
    }
  };

  return (
    <div className="flex-1 flex w-full h-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <DesktopSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeFleetCount={activeFleetCount}
        criticalTpsCount={criticalTpsCount}
      />

      {/* Main Command Center Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <DesktopHeader
          currentTab={currentTab}
          notifications={notifications}
          onOpenMobileView={onOpenMobileView}
          onOpenFigmaModal={onOpenFigmaModal}
          onOpenFigmaCanvas={onOpenFigmaCanvas}
        />

        {/* Tab Content Body */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
          {currentTab === 'overview' && (
            <DesktopOverviewTab
              tpsList={tpsList}
              fleetList={fleetList}
              trafficAlerts={trafficAlerts}
              notifications={notifications}
              onNavigateTab={setCurrentTab}
              onDispatchFleet={handleOpenDispatch}
            />
          )}

          {currentTab === 'fleet_tracking' && (
            <DesktopFleetMapTab
              fleetList={fleetList}
              tpsList={tpsList}
              trafficAlerts={trafficAlerts}
              onOpenMobileViewWithVehicle={onOpenMobileViewWithVehicle}
            />
          )}

          {currentTab === 'tps_monitor' && (
            <DesktopTPSManagerTab
              tpsList={tpsList}
              fleetList={fleetList}
              onDispatchFleet={handleOpenDispatch}
            />
          )}

          {currentTab === 'route_optimizer' && (
            <DesktopRouteOptimizerTab
              tpsList={tpsList}
              fleetList={fleetList}
            />
          )}

          {currentTab === 'analytics_reports' && (
            <DesktopReportsTab />
          )}

          {currentTab === 'settings' && (
            <div className="p-8 max-w-4xl mx-auto space-y-6 overflow-y-auto">
              <div>
                <h2 className="text-base font-bold text-white">
                  Konfigurasi Sistem & Integrasi Data Lake DLH Surabaya
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Pengaturan parameter ambang batas sensor, API jembatan timbang TPA Benowo, dan notifikasi
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Koneksi Data Lake Pemkot Surabaya</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Endpoint GIS Geolocation</span>
                    <span className="font-mono text-emerald-400 font-semibold">https://gis.dlh.surabaya.go.id/v2/fleet</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">MQTT Broker IoT Sensor TPS</span>
                    <span className="font-mono text-emerald-400 font-semibold">mqtt.smartwaste.surabaya.id:8883 (SSL)</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Hak Akses & Pengamanan Perangkat</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Semua transaksi penimbangan sampah dan bukti foto penjemputan dienkripsi secara end-to-end sesuai standar audit DLH Kota Surabaya & Perwali Pengelolaan Persampahan.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Fleet Dispatch Modal */}
      {dispatchModalTps && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-5 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white">
              Disposisi Armada ke {dispatchModalTps.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Level Keterisian: <strong className="text-red-400">{dispatchModalTps.fillPercentage}%</strong> ({dispatchModalTps.currentVolumeM3} m³) · {dispatchModalTps.district}
            </p>

            <div className="mt-4 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">
                Pilih Armada Kompaktor Terdekat:
              </span>
              {fleetList.slice(0, 3).map((v) => (
                <div
                  key={v.id}
                  onClick={() => handleConfirmDispatch(v.id)}
                  className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{v.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{v.plateNumber}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Driver: {v.driverName} · {v.currentLocationName}</p>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                  >
                    Tugaskan
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setDispatchModalTps(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

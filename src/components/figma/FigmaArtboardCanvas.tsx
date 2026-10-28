import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Smartphone, 
  ArrowRight, 
  Eye, 
  Download,
  Share2,
  Copy,
  Info
} from 'lucide-react';
import { ScreenType, OfficerProfile, VehicleSpecs, TPSLocation, RouteStats, NotificationItem } from '../../types/smartwaste';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { MapNavigationScreen } from '../screens/MapNavigationScreen';
import { VehicleTaskScreen } from '../screens/VehicleTaskScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { HeaderBar } from '../common/HeaderBar';
import { BottomTabBar } from '../navigation/BottomTabBar';

interface FigmaArtboardCanvasProps {
  officer: OfficerProfile;
  vehicle: VehicleSpecs;
  tpsList: TPSLocation[];
  routeStats: RouteStats;
  notifications: NotificationItem[];
  onOpenPhoneView: (screen: ScreenType) => void;
  onOpenCollectionModal: (tps: TPSLocation) => void;
  onSelectTps: (tps: TPSLocation) => void;
}

export const FigmaArtboardCanvas: React.FC<FigmaArtboardCanvasProps> = ({
  officer,
  vehicle,
  tpsList,
  routeStats,
  notifications,
  onOpenPhoneView,
  onOpenCollectionModal,
  onSelectTps,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);

  const artboards = [
    {
      id: 'login' as ScreenType,
      name: '01_Login_Screen',
      description: 'Halaman autentikasi NIP petugas & sandi dinas DLH',
      component: (
        <div className="w-[390px] h-[844px] bg-slate-50 flex flex-col overflow-hidden rounded-[32px] border-4 border-slate-800 shadow-2xl">
          <HeaderBar title="Masuk Petugas Lapangan" showSystemBar={true} />
          <LoginScreen onLoginSuccess={() => onOpenPhoneView('dashboard')} />
        </div>
      ),
    },
    {
      id: 'dashboard' as ScreenType,
      name: '02_Dashboard_Home',
      description: 'Beranda tugas aktif, ringkasan progres, dan status muatan',
      component: (
        <div className="w-[390px] h-[844px] bg-slate-50 flex flex-col overflow-hidden rounded-[32px] border-4 border-slate-800 shadow-2xl">
          <HeaderBar vehicle={vehicle} showSystemBar={true} />
          <DashboardScreen
            officer={officer}
            vehicle={vehicle}
            tpsList={tpsList}
            routeStats={routeStats}
            notifications={notifications}
            onNavigate={(s) => onOpenPhoneView(s)}
            onSelectTPS={(tps) => onSelectTps(tps)}
          />
          <BottomTabBar currentScreen="dashboard" onSelectScreen={(s) => onOpenPhoneView(s)} />
        </div>
      ),
    },
    {
      id: 'map' as ScreenType,
      name: '03_Map_Navigation',
      description: 'Peta rute optimal, pin TPS color-coded, dan drawer ETA',
      component: (
        <div className="w-[390px] h-[844px] bg-slate-50 flex flex-col overflow-hidden rounded-[32px] border-4 border-slate-800 shadow-2xl">
          <HeaderBar title="Peta Rute Surabaya" vehicle={vehicle} showSystemBar={true} />
          <MapNavigationScreen
            tpsList={tpsList}
            selectedTps={tpsList[1]}
            onSelectTps={(tps) => onSelectTps(tps)}
            vehicle={vehicle}
            trafficAlerts={[]}
            onOpenCollectionModal={(tps) => onOpenCollectionModal(tps)}
          />
          <BottomTabBar currentScreen="map" onSelectScreen={(s) => onOpenPhoneView(s)} />
        </div>
      ),
    },
    {
      id: 'vehicle_tasks' as ScreenType,
      name: '04_Vehicle_TPS_Detail',
      description: 'Rincian armada A07, checklist penjemputan, dan update status',
      component: (
        <div className="w-[390px] h-[844px] bg-slate-50 flex flex-col overflow-hidden rounded-[32px] border-4 border-slate-800 shadow-2xl">
          <HeaderBar title="Armada & Penjemputan" vehicle={vehicle} showSystemBar={true} />
          <VehicleTaskScreen
            vehicle={vehicle}
            tpsList={tpsList}
            onSelectTps={(tps) => onSelectTps(tps)}
            onOpenCollectionModal={(tps) => onOpenCollectionModal(tps)}
          />
          <BottomTabBar currentScreen="vehicle_tasks" onSelectScreen={(s) => onOpenPhoneView(s)} />
        </div>
      ),
    },
    {
      id: 'notifications' as ScreenType,
      name: '05_Alerts_Notifications',
      description: 'Disposisi command center, peringatan TPS penuh & lalu lintas',
      component: (
        <div className="w-[390px] h-[844px] bg-slate-50 flex flex-col overflow-hidden rounded-[32px] border-4 border-slate-800 shadow-2xl">
          <HeaderBar title="Notifikasi DLH" vehicle={vehicle} showSystemBar={true} />
          <NotificationsScreen
            notifications={notifications}
            onMarkAllRead={() => {}}
            onNavigateToMap={() => onOpenPhoneView('map')}
          />
          <BottomTabBar currentScreen="notifications" onSelectScreen={(s) => onOpenPhoneView(s)} />
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
      {/* Top Canvas Toolbar */}
      <div className="shrink-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">
              Figma Canvas Artboard Grid (5 Screens)
            </h2>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 font-mono">
            390 × 844 px Frames
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.1))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              title="Perkecil Kanvas"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.2, z + 0.1))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              title="Perbesar Kanvas"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setZoomLevel(0.85)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            Reset Zoom
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 overflow-auto p-12 bg-pattern bg-slate-900 flex items-start gap-12">
        <div 
          className="flex gap-12 transition-transform duration-200 origin-top-left"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {artboards.map((artboard, idx) => (
            <div key={artboard.id} className="flex flex-col shrink-0">
              {/* Artboard Frame Label */}
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {artboard.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      (390 × 844)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {artboard.description}
                  </p>
                </div>

                <button
                  onClick={() => onOpenPhoneView(artboard.id)}
                  className="px-2.5 py-1 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  title="Buka Interaktif di Phone Simulator"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Uji Interaktif</span>
                </button>
              </div>

              {/* The Mobile Artboard */}
              {artboard.component}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

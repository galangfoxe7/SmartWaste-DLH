import React, { useState } from 'react';
import { 
  ScreenType, 
  OfficerProfile, 
  VehicleSpecs, 
  TPSLocation, 
  NotificationItem, 
  RouteStats 
} from './types/smartwaste';
import { 
  initialOfficer, 
  initialVehicle, 
  dlhFleetList,
  initialTPSList, 
  initialTrafficAlerts, 
  initialNotifications, 
  initialRouteStats 
} from './data/mockData';
import { MobilePhoneFrame } from './components/layout/MobilePhoneFrame';
import { HeaderBar } from './components/common/HeaderBar';
import { BottomTabBar } from './components/navigation/BottomTabBar';
import { LoginScreen } from './components/screens/LoginScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { MapNavigationScreen } from './components/screens/MapNavigationScreen';
import { VehicleTaskScreen } from './components/screens/VehicleTaskScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { CollectionModal } from './components/common/CollectionModal';
import { FigmaExportModal } from './components/figma/FigmaExportModal';
import { FigmaArtboardCanvas } from './components/figma/FigmaArtboardCanvas';
import { DesktopCommandCenter } from './components/desktop/DesktopCommandCenter';
import { 
  Monitor, 
  Smartphone, 
  Layers, 
  Download, 
  Shield, 
  RefreshCw,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // App View Mode: 'desktop' (Command Center) vs 'phone' (Driver Simulator) vs 'figma_canvas' (5 screens side-by-side)
  const [viewMode, setViewMode] = useState<'desktop' | 'phone' | 'figma_canvas'>('desktop');
  
  // Active screen in Phone mode
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  
  // App Operational State
  const [officer, setOfficer] = useState<OfficerProfile>(initialOfficer);
  const [vehicle, setVehicle] = useState<VehicleSpecs>(initialVehicle);
  const [fleetList, setFleetList] = useState<VehicleSpecs[]>(dlhFleetList);
  const [tpsList, setTpsList] = useState<TPSLocation[]>(initialTPSList);
  const [trafficAlerts, setTrafficAlerts] = useState(initialTrafficAlerts);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [routeStats, setRouteStats] = useState<RouteStats>(initialRouteStats);
  const [selectedTps, setSelectedTps] = useState<TPSLocation | null>(null);

  // Modals
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [collectionModalTps, setCollectionModalTps] = useState<TPSLocation | null>(null);
  const [isFigmaModalOpen, setIsFigmaModalOpen] = useState(false);

  // Unread notification count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Handle Collection Completion from Modal
  const handleCollectionSubmit = (tpsId: string, collectedWeightTons: number, notes: string) => {
    // 1. Update TPS status
    setTpsList((prev) =>
      prev.map((item) => {
        if (item.id === tpsId) {
          return {
            ...item,
            taskStatus: 'completed',
            status: 'collected',
            fillPercentage: 10,
            currentVolumeM3: 1.2,
            collectionCompletedAt: '08:25 WIB',
            collectedWeightTons,
            notes,
            lastEmptiedAt: 'Hari ini, 08:25 WIB',
          };
        }
        return item;
      })
    );

    // 2. Update Vehicle Current Load
    const newLoad = Math.min(vehicle.maxLoadTons, Math.round((vehicle.currentLoadTons + collectedWeightTons) * 10) / 10);
    setVehicle((prev) => ({
      ...prev,
      currentLoadTons: newLoad,
    }));

    // Update Fleet list for that vehicle
    setFleetList((prev) =>
      prev.map((v) => (v.id === vehicle.id ? { ...v, currentLoadTons: newLoad } : v))
    );

    // 3. Add dispatch confirmation notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Penjemputan ${collectionModalTps?.name || 'TPS'} Berhasil`,
      message: `Muatan ${collectedWeightTons} Ton berhasil diangkut dan dipadatkan. Data disinkronkan ke DLH Cloud.`,
      timestamp: 'Baru saja',
      severity: 'info',
      category: 'fleet',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // 4. Update route next stop
    setRouteStats((prev) => ({
      ...prev,
      completedStops: prev.completedStops + 1,
      currentTonsCollected: prev.currentTonsCollected + collectedWeightTons,
      currentDestinationId: 'TPS-03', // Next: TPS Keputih Sukolilo
    }));
  };

  const openCollectionForTps = (tps: TPSLocation) => {
    setCollectionModalTps(tps);
    setIsCollectionModalOpen(true);
  };

  const handleResetData = () => {
    setVehicle(initialVehicle);
    setFleetList(dlhFleetList);
    setTpsList(initialTPSList);
    setNotifications(initialNotifications);
    setRouteStats(initialRouteStats);
    setCurrentScreen('dashboard');
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleOpenMobileViewWithVehicle = (v: VehicleSpecs) => {
    setVehicle(v);
    setOfficer((prev) => ({
      ...prev,
      name: v.driverName,
      role: `Pengemudi ${v.id}`,
    }));
    setViewMode('phone');
    setCurrentScreen('dashboard');
  };

  const handleDispatchFleetToTps = (tps: TPSLocation) => {
    setSelectedTps(tps);
    setTpsList((prev) =>
      prev.map((item) =>
        item.id === tps.id ? { ...item, taskStatus: 'in_progress', arrivalTimeEstimated: '10 mnt (Segera Tiba)' } : item
      )
    );
    const newNotif: NotificationItem = {
      id: `NOTIF-DSP-${Date.now()}`,
      title: `Disposisi Baru: ${tps.name}`,
      message: `Pusat Kendali DLH menugaskan armada ke ${tps.name} (${tps.district}) karena kapasitas mencapai ${tps.fillPercentage}%.`,
      timestamp: 'Baru saja',
      severity: 'critical',
      category: 'capacity',
      relatedTpsId: tps.id,
      isRead: false,
      actionRequired: true,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Main Master Navigation Bar */}
      <header className="shrink-0 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 z-40">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md">
            <Shield className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white tracking-tight">
                SmartWaste Surabaya
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 font-mono font-medium px-2 py-0.5 rounded border border-emerald-800">
                DLH Enterprise Suite
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Sistem Cerdas Optimasi Rute, Jadwal, & Pengendalian Armada Persampahan Surabaya
            </p>
          </div>
        </div>

        {/* View Mode Switcher: Desktop vs Mobile vs Figma */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setViewMode('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'desktop'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pusat Kendali Dekstop</span>
            <span className="sm:hidden">Dekstop</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('phone')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'phone'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">UI Petugas Ponsel (390×844)</span>
            <span className="sm:hidden">Ponsel</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('figma_canvas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              viewMode === 'figma_canvas'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Kanvas Figma (5 Layar)</span>
            <span className="md:hidden">Figma</span>
          </button>
        </div>

        {/* Right Action: Export Figma */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFigmaModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ke Figma</span>
          </button>
        </div>
      </header>

      {/* Screen Navigation Quick Bar (Visible in Phone View for fast switching) */}
      {viewMode === 'phone' && (
        <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs text-slate-400 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Layar Ponsel:
            </span>
            {(['login', 'dashboard', 'map', 'vehicle_tasks', 'notifications', 'profile'] as ScreenType[]).map((scr) => (
              <button
                key={scr}
                type="button"
                onClick={() => setCurrentScreen(scr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  currentScreen === scr
                    ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {scr === 'login' && '1. Login'}
                {scr === 'dashboard' && '2. Dashboard'}
                {scr === 'map' && '3. Peta Rute'}
                {scr === 'vehicle_tasks' && '4. Armada & TPS'}
                {scr === 'notifications' && `5. Notifikasi (${unreadCount})`}
                {scr === 'profile' && '6. Profil'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleResetData}
            title="Reset Data Simulasi"
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 pl-3 shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {viewMode === 'desktop' ? (
          <DesktopCommandCenter
            tpsList={tpsList}
            fleetList={fleetList}
            trafficAlerts={trafficAlerts}
            notifications={notifications}
            routeStats={routeStats}
            onOpenMobileView={() => setViewMode('phone')}
            onOpenMobileViewWithVehicle={handleOpenMobileViewWithVehicle}
            onOpenFigmaModal={() => setIsFigmaModalOpen(true)}
            onOpenFigmaCanvas={() => setViewMode('figma_canvas')}
            onDispatchFleetToTps={handleDispatchFleetToTps}
          />
        ) : viewMode === 'figma_canvas' ? (
          <FigmaArtboardCanvas
            officer={officer}
            vehicle={vehicle}
            tpsList={tpsList}
            routeStats={routeStats}
            notifications={notifications}
            onOpenPhoneView={(screen) => {
              setCurrentScreen(screen);
              setViewMode('phone');
            }}
            onOpenCollectionModal={openCollectionForTps}
            onSelectTps={(tps) => {
              setSelectedTps(tps);
              setCurrentScreen('map');
              setViewMode('phone');
            }}
          />
        ) : (
          <div className="flex-1 flex justify-center items-center overflow-auto bg-gradient-to-b from-slate-900 to-slate-950">
            <MobilePhoneFrame activeScreen={currentScreen}>
              {currentScreen === 'login' ? (
                <>
                  <HeaderBar title="Masuk Petugas Lapangan" showSystemBar={true} />
                  <LoginScreen onLoginSuccess={() => setCurrentScreen('dashboard')} />
                </>
              ) : currentScreen === 'dashboard' ? (
                <>
                  <HeaderBar vehicle={vehicle} showSystemBar={true} />
                  <DashboardScreen
                    officer={officer}
                    vehicle={vehicle}
                    tpsList={tpsList}
                    routeStats={routeStats}
                    notifications={notifications}
                    onNavigate={(screen) => setCurrentScreen(screen)}
                    onSelectTPS={(tps) => {
                      setSelectedTps(tps);
                    }}
                  />
                  <BottomTabBar
                    currentScreen={currentScreen}
                    onSelectScreen={setCurrentScreen}
                    unreadCount={unreadCount}
                  />
                </>
              ) : currentScreen === 'map' ? (
                <>
                  <HeaderBar
                    title="Peta Rute & TPS"
                    subtitle="Surabaya Timur - Armada A07"
                    vehicle={vehicle}
                    showSystemBar={true}
                  />
                  <MapNavigationScreen
                    tpsList={tpsList}
                    selectedTps={selectedTps}
                    onSelectTps={setSelectedTps}
                    vehicle={vehicle}
                    trafficAlerts={trafficAlerts}
                    onOpenCollectionModal={openCollectionForTps}
                  />
                  <BottomTabBar
                    currentScreen={currentScreen}
                    onSelectScreen={setCurrentScreen}
                    unreadCount={unreadCount}
                  />
                </>
              ) : currentScreen === 'vehicle_tasks' ? (
                <>
                  <HeaderBar
                    title="Armada & Penjemputan"
                    subtitle="Truk Kompaktor 6m³ (L 6678 GH)"
                    vehicle={vehicle}
                    showSystemBar={true}
                  />
                  <VehicleTaskScreen
                    vehicle={vehicle}
                    tpsList={tpsList}
                    onSelectTps={(tps) => {
                      setSelectedTps(tps);
                      setCurrentScreen('map');
                    }}
                    onOpenCollectionModal={openCollectionForTps}
                  />
                  <BottomTabBar
                    currentScreen={currentScreen}
                    onSelectScreen={setCurrentScreen}
                    unreadCount={unreadCount}
                  />
                </>
              ) : currentScreen === 'notifications' ? (
                <>
                  <HeaderBar
                    title="Notifikasi & Disposisi"
                    subtitle="Pusat Kendali DLH Surabaya"
                    vehicle={vehicle}
                    showSystemBar={true}
                  />
                  <NotificationsScreen
                    notifications={notifications}
                    onMarkAllRead={handleMarkAllRead}
                    onNavigateToMap={() => setCurrentScreen('map')}
                  />
                  <BottomTabBar
                    currentScreen={currentScreen}
                    onSelectScreen={setCurrentScreen}
                    unreadCount={unreadCount}
                  />
                </>
              ) : (
                <>
                  <HeaderBar
                    title="Profil Petugas DLH"
                    vehicle={vehicle}
                    showSystemBar={true}
                  />
                  <ProfileScreen
                    officer={officer}
                    vehicle={vehicle}
                    onLogout={() => setCurrentScreen('login')}
                  />
                  <BottomTabBar
                    currentScreen={currentScreen}
                    onSelectScreen={setCurrentScreen}
                    unreadCount={unreadCount}
                  />
                </>
              )}
            </MobilePhoneFrame>
          </div>
        )}
      </main>

      {/* Interactive Field Collection Task Modal */}
      <CollectionModal
        tps={collectionModalTps}
        isOpen={isCollectionModalOpen}
        onClose={() => {
          setIsCollectionModalOpen(false);
          setCollectionModalTps(null);
        }}
        onSubmit={handleCollectionSubmit}
      />

      {/* Figma Integration & Tokens Export Modal */}
      <FigmaExportModal
        isOpen={isFigmaModalOpen}
        onClose={() => setIsFigmaModalOpen(false)}
      />
    </div>
  );
}

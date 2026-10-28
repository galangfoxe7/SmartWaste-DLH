import React from 'react';
import { Home, MapPin, Truck, Bell, User } from 'lucide-react';
import { ScreenType } from '../../types/smartwaste';

interface BottomTabBarProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  unreadCount?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentScreen,
  onSelectScreen,
  unreadCount = 2,
}) => {
  const tabs = [
    {
      id: 'dashboard' as ScreenType,
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'map' as ScreenType,
      label: 'Peta Rute',
      icon: MapPin,
    },
    {
      id: 'vehicle_tasks' as ScreenType,
      label: 'Armada & TPS',
      icon: Truck,
    },
    {
      id: 'notifications' as ScreenType,
      label: 'Notifikasi',
      icon: Bell,
      badge: unreadCount,
    },
    {
      id: 'profile' as ScreenType,
      label: 'Profil',
      icon: User,
    },
  ];

  return (
    <nav 
      aria-label="Navigasi Bawah"
      className="shrink-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 flex items-center justify-around z-30 shadow-sm"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectScreen(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] rounded-xl transition-all relative ${
              isActive
                ? 'text-emerald-800 font-semibold'
                : 'text-slate-500 hover:text-slate-800 font-normal'
            }`}
          >
            <div className="relative">
              <Icon 
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                }`} 
              />
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-emerald-800' : 'text-slate-500'}`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};

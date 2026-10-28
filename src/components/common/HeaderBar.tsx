import React from 'react';
import { Wifi, BatteryMedium, Shield, ChevronLeft } from 'lucide-react';
import { VehicleSpecs } from '../../types/smartwaste';

interface HeaderBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  vehicle?: VehicleSpecs;
  showSystemBar?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  vehicle,
  showSystemBar = true,
}) => {
  return (
    <header className="shrink-0 bg-emerald-900 text-white select-none z-20">
      {/* Mobile OS Status Bar */}
      {showSystemBar && (
        <div className="flex items-center justify-between px-5 pt-2 pb-1 text-xs text-emerald-100 font-mono text-[11px] opacity-90">
          <span>08:14</span>
          <div className="w-20 h-4 bg-emerald-950/60 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <span>4G</span>
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* App Bar Zone */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Kembali"
              className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-white hover:bg-emerald-800/80 active:scale-95 transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-4 h-4 text-emerald-200" />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-200">
                DLH SURABAYA
              </span>
              {vehicle && (
                <span className="text-[10px] bg-emerald-800/90 text-emerald-100 px-1.5 py-0.5 rounded font-mono font-medium border border-emerald-700">
                  {vehicle.id}
                </span>
              )}
            </div>
            <h1 className="text-sm font-bold text-white truncate leading-tight">
              {title || 'SmartWaste Surabaya'}
            </h1>
            {subtitle && (
              <p className="text-[11px] text-emerald-200/90 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5">
          {rightAction || (
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-800/80 text-emerald-100 border border-emerald-600/50">
                GPS Aktif
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

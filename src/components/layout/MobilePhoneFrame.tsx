import React from 'react';
import { ScreenType } from '../../types/smartwaste';

interface MobilePhoneFrameProps {
  children: React.ReactNode;
  activeScreen: ScreenType;
}

export const MobilePhoneFrame: React.FC<MobilePhoneFrameProps> = ({
  children,
}) => {
  return (
    <div className="relative flex justify-center items-center py-4 sm:py-8 px-2">
      {/* Device Body (iPhone 15 Pro / Modern Android Dimensions: 390 x 844 px) */}
      <div className="relative w-[390px] h-[844px] max-w-[100vw] max-h-[92vh] bg-slate-900 rounded-[50px] p-[11px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)] border-[4px] border-slate-700/80 flex flex-col overflow-hidden select-none">
        {/* Hardware Side Buttons Simulation */}
        <div className="hidden sm:block absolute -left-[7px] top-[115px] w-[3px] h-[26px] bg-slate-600 rounded-l-sm" />
        <div className="hidden sm:block absolute -left-[7px] top-[160px] w-[3px] h-[50px] bg-slate-600 rounded-l-sm" />
        <div className="hidden sm:block absolute -left-[7px] top-[225px] w-[3px] h-[50px] bg-slate-600 rounded-l-sm" />
        <div className="hidden sm:block absolute -right-[7px] top-[180px] w-[3px] h-[75px] bg-slate-600 rounded-r-sm" />

        {/* Screen Display Area */}
        <div className="relative flex-1 bg-slate-50 rounded-[40px] overflow-hidden flex flex-col">
          {/* Dynamic Island Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-2.5 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-950 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* Render Active Mobile Content */}
          <div className="flex-1 flex flex-col overflow-hidden pt-1">
            {children}
          </div>

          {/* iOS / Android Home Indicator Bar */}
          <div className="shrink-0 h-4 bg-white/80 backdrop-blur-xs flex items-center justify-center pointer-events-none z-30">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

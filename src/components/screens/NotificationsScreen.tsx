import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Bell, 
  Clock, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { NotificationItem, ScreenType } from '../../types/smartwaste';

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onNavigateToMap: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  onMarkAllRead,
  onNavigateToMap,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'reroute' | 'capacity'>('all');
  const [localItems, setLocalItems] = useState(notifications);

  const handleToggleRead = (id: string) => {
    setLocalItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: !item.isRead } : item))
    );
  };

  const filtered = localItems.filter((item) => {
    if (activeFilter === 'critical') return item.severity === 'critical';
    if (activeFilter === 'reroute') return item.category === 'reroute';
    if (activeFilter === 'capacity') return item.category === 'capacity';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4 pb-8">
      {/* Header and Mark All Read */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Peringatan & Disposisi DLH
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Informasi real-time dari Command Center DLH Surabaya
          </p>
        </div>

        <button
          type="button"
          onClick={onMarkAllRead}
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Tandai Semua</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-xs ${
            activeFilter === 'all'
              ? 'bg-emerald-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua ({localItems.length})
        </button>
        <button
          onClick={() => setActiveFilter('critical')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-xs flex items-center gap-1 ${
            activeFilter === 'critical'
              ? 'bg-red-700 text-white'
              : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Darurat ({localItems.filter((i) => i.severity === 'critical').length})</span>
        </button>
        <button
          onClick={() => setActiveFilter('reroute')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-xs ${
            activeFilter === 'reroute'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Reroute / Lalin
        </button>
        <button
          onClick={() => setActiveFilter('capacity')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-xs ${
            activeFilter === 'capacity'
              ? 'bg-emerald-800 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Kapasitas TPS
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isCritical = item.severity === 'critical';
          const isWarning = item.severity === 'warning';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-4 transition-all shadow-xs ${
                !item.isRead ? 'border-emerald-600/60 ring-1 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${
                  isCritical 
                    ? 'bg-red-100 text-red-700' 
                    : isWarning 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isCritical ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : isWarning ? (
                    <Flame className="w-5 h-5" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  {/* Contextual Action Button if reroute or capacity */}
                  {item.actionRequired && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={onNavigateToMap}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Terapkan ke Navigasi Rute</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleRead(item.id)}
                        className="text-[11px] text-slate-500 hover:text-slate-800"
                      >
                        {item.isRead ? 'Tandai belum' : 'Selesai'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

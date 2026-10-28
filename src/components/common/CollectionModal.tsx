import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Weight, 
  Camera, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Truck,
  Image as ImageIcon
} from 'lucide-react';
import { TPSLocation } from '../../types/smartwaste';

interface CollectionModalProps {
  tps: TPSLocation | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tpsId: string, weightTons: number, notes: string) => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  tps,
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen || !tps) return null;

  const [weight, setWeight] = useState<number>(1.5);
  const [cleanlinessChecked, setCleanlinessChecked] = useState(true);
  const [compactionChecked, setCompactionChecked] = useState(true);
  const [photoTaken, setPhotoTaken] = useState(true);
  const [notes, setNotes] = useState('Semua kontainer terangkut, area TPS disemprot disinfektan.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(tps.id, weight, notes);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Pencatatan Penjemputan TPS
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {tps.name}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {tps.code} · {tps.district}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Weight Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tonase Muatan Terangkut (Ton)
            </label>
            <div className="relative flex items-center">
              <Weight className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="6.0"
                required
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
              <span className="absolute right-3.5 text-xs text-slate-400 font-semibold font-mono">
                TON
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Volume terukur IoT: {tps.currentVolumeM3} m³ (~{(tps.currentVolumeM3 * 0.12).toFixed(1)} ton residu)
            </p>
          </div>

          {/* Photo Verification Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Bukti Foto Kontainer & TPS
            </label>
            <div className="relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 h-28 flex items-center justify-center">
              {photoTaken ? (
                <div className="w-full h-full relative bg-slate-800">
                  {/* Simulated Container Photo Graphic */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent flex flex-col justify-end p-2.5 text-white">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span>TPS Cleaned & Compacted</span>
                      <span className="text-emerald-400">GEO-VERIFIED ✓</span>
                    </div>
                    <p className="text-[11px] font-bold truncate">Surabaya DLH Verification Photo #9842</p>
                  </div>
                  <div className="w-full h-full flex items-center justify-center opacity-40">
                    <Truck className="w-16 h-16 text-emerald-400" />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPhotoTaken(true)}
                  className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-800"
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs font-medium">Ambil Foto Kontainer</span>
                </button>
              )}
            </div>
          </div>

          {/* SOP Checkboxes */}
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={cleanlinessChecked}
                onChange={(e) => setCleanlinessChecked(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-slate-300"
              />
              <span>Area sekitar TPS telah disapu & bersih</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={compactionChecked}
                onChange={(e) => setCompactionChecked(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-slate-300"
              />
              <span>Mekanisme hidrolik pemadatan berjalan aman</span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Lapangan (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Akses lancar, sampah kering"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-700"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-24 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-emerald-900/15 transition cursor-pointer"
            >
              {isSubmitting ? (
                <span>Menyimpan ke DLH Cloud...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kirim Bukti Pengangkutan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

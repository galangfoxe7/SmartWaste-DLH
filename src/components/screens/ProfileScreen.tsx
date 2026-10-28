import React from 'react';
import { 
  User, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Clock, 
  Award, 
  ExternalLink, 
  LogOut, 
  FileSpreadsheet,
  Globe,
  Truck,
  HeartHandshake
} from 'lucide-react';
import { OfficerProfile, VehicleSpecs } from '../../types/smartwaste';

interface ProfileScreenProps {
  officer: OfficerProfile;
  vehicle: VehicleSpecs;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  officer,
  vehicle,
  onLogout,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4 pb-8">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center">
        <div className="relative inline-block mx-auto mb-3">
          <div className="w-20 h-20 rounded-full bg-emerald-800 text-white font-bold text-2xl flex items-center justify-center border-4 border-emerald-100 shadow-md">
            AS
          </div>
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        <h2 className="text-base font-bold text-slate-900">
          {officer.name}
        </h2>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          NIP. {officer.nip}
        </p>

        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{officer.role}</span>
        </div>

        {/* Shift Details Grid */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-left text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Unit Kerja</span>
            <span className="font-semibold text-slate-800">{officer.unit}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Wilayah Pelayanan</span>
            <span className="font-semibold text-slate-800">{officer.zone}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Jadwal Shift</span>
            <span className="font-semibold text-slate-800">{officer.shift}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Kontak Darurat</span>
            <span className="font-semibold text-slate-800 font-mono">{officer.phone}</span>
          </div>
        </div>
      </div>

      {/* Institutional Partnership & SDG Alignment */}
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-emerald-300" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            Dinas Lingkungan Hidup & ITATS 2026
          </h3>
        </div>
        <p className="text-xs text-emerald-100 leading-relaxed">
          SmartWaste Surabaya merupakan implementasi sistem cerdas optimasi rute armada pengangkutan sampah untuk kota Surabaya berkelanjutan.
        </p>
        <div className="mt-3 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-[11px] text-emerald-200">
          <span>SDG 11: Kota Berkelanjutan</span>
          <span>·</span>
          <span>SDG 12: Konsumsi Bijak</span>
          <span>·</span>
          <span>SDG 13: Iklim</span>
        </div>
      </div>

      {/* Logout Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onLogout}
          className="w-full h-11 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Akun Petugas</span>
        </button>
      </div>
    </div>
  );
};

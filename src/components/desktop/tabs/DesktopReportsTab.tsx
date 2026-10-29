import React from 'react';
import { 
  BarChart3, 
  Download, 
  Globe, 
  Leaf, 
  TrendingUp, 
  FileSpreadsheet, 
  ShieldCheck, 
  Award,
  Zap
} from 'lucide-react';
import { dailyTonnageData } from '../../../data/mockData';

export const DesktopReportsTab: React.FC = () => {
  const handleDownloadReport = () => {
    alert('Mengunduh Laporan Rekapitulasi Kinerja Pengangkutan DLH Surabaya (Format PDF / SDGs Report 2026)');
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Laporan Analitik Kinerja & Capaian Target SDGs Kota Surabaya
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dokumentasi efisiensi operasional pengangkutan sampah dan kontribusi indikator keberlanjutan
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadReport}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Unduh Laporan Audit (PDF)</span>
        </button>
      </div>

      {/* SDGs Contribution 3 Cards (From Proposal Page 8) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SDG 11 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-amber-400 font-mono">
                SDG 11 · KOTA BERKELANJUTAN
              </span>
              <Globe className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Layanan Perkotaan & Sanitasi Lingkungan
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Mendukung Surabaya bebas penumpukan sampah liar dengan cakupan layanan pengangkutan terjadwal di 286 TPS seluruh kelurahan.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Cakupan Layanan:</span>
            <span className="font-mono font-bold text-emerald-400">98.4% Kota</span>
          </div>
        </div>

        {/* SDG 12 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-teal-400 font-mono">
                SDG 12 · KONSUMSI BIJAK
              </span>
              <Leaf className="w-4 h-4 text-teal-400" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Pengelolaan Rantai Pasok Sampah
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Pemantauan komposisi sampah dari sumber hulu (TPS) hingga hilir (PLTSa Benowo untuk pembangkit listrik tenaga sampah ramah lingkungan).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Konversi Energi PLTSa:</span>
            <span className="font-mono font-bold text-teal-400">12 MW / Hari</span>
          </div>
        </div>

        {/* SDG 13 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-emerald-400 font-mono">
                SDG 13 · AKSI IKLIM
              </span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Reduksi Emisi Bahan Bakar Armada
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Pemilihan rute optimal berbasis AI memangkas perjalanan berulang dan kemacetan, menekan konsumsi solar truk hingga 27%.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Estimasi Reduksi Emisi:</span>
            <span className="font-mono font-bold text-emerald-400">-184 Ton CO2/Thn</span>
          </div>
        </div>
      </div>

      {/* Daily Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-white mb-3">
          Rekapitulasi Penimbangan & Ritase Harian TPA Benowo
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Total Massa Sampah (Ton)</th>
                <th className="py-2.5 px-3">Jumlah Ritase Truk</th>
                <th className="py-2.5 px-3">Rata-rata Muatan per Truk</th>
                <th className="py-2.5 px-3">Status Verifikasi DLH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {dailyTonnageData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-white">{row.day} 2026</td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{row.tonnage} Ton</td>
                  <td className="py-3 px-3 font-mono">{row.trips} Ritase</td>
                  <td className="py-3 px-3 font-mono">{(row.tonnage / row.trips).toFixed(2)} Ton/Rit</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                      TERVERIFIKASI ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

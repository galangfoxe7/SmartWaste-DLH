import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Battery, 
  Video, 
  Clock, 
  Truck, 
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Plus
} from 'lucide-react';
import { TPSLocation, VehicleSpecs } from '../../../types/smartwaste';

interface DesktopTPSManagerTabProps {
  tpsList: TPSLocation[];
  fleetList: VehicleSpecs[];
  onDispatchFleet: (tps: TPSLocation) => void;
}

export const DesktopTPSManagerTab: React.FC<DesktopTPSManagerTabProps> = ({
  tpsList,
  fleetList,
  onDispatchFleet,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'warning' | 'normal'>('all');

  const districts = ['all', 'Kec. Sukolilo', 'Kec. Wonokromo', 'Kec. Rungkut', 'Kec. Tegalsari', 'Kec. Gubeng', 'Kec. Tandes', 'Kec. Gunung Anyar'];

  const filteredTPS = tpsList.filter((tps) => {
    const matchesSearch = tps.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tps.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tps.address.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (districtFilter !== 'all' && tps.district !== districtFilter) return false;
    if (statusFilter === 'critical' && tps.fillPercentage < 80) return false;
    if (statusFilter === 'warning' && (tps.fillPercentage < 50 || tps.fillPercentage >= 80)) return false;
    if (statusFilter === 'normal' && tps.fillPercentage >= 50) return false;
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Kode TPS', 'Nama TPS', 'Kecamatan', 'Kapasitas (m3)', 'Volume Saat Ini (m3)', 'Persentase (%)', 'Status IoT', 'Baterai (%)', 'Terakhir Dikosongkan'];
    const rows = filteredTPS.map((t) => [
      t.code,
      `"${t.name}"`,
      `"${t.district}"`,
      t.capacityM3,
      t.currentVolumeM3,
      t.fillPercentage,
      t.status,
      t.iotSensorBattery,
      `"${t.lastEmptiedAt || '-'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartwaste-surabaya-tps-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-5 overflow-y-auto">
      {/* Header & Metric Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Monitoring Kapasitas 286 TPS & Sensor IoT Kota Surabaya
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Integrasi sensor ultrasonik level sampah dan pengawasan visual Tempat Penampungan Sementara
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ekspor Data CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari TPS (Keputih, Rungkut, Wonokromo, Jagir)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-600 transition"
          />
        </div>

        {/* District Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Wilayah:</span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d === 'all' ? 'Semua Kecamatan Surabaya' : d}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              statusFilter === 'all' ? 'bg-emerald-900 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua ({tpsList.length})
          </button>
          <button
            onClick={() => setStatusFilter('critical')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              statusFilter === 'critical' ? 'bg-red-900 text-white' : 'text-red-400 hover:text-red-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Kritis (&gt;80%)</span>
          </button>
          <button
            onClick={() => setStatusFilter('warning')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              statusFilter === 'warning' ? 'bg-amber-900 text-white' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            Waspada (50-80%)
          </button>
          <button
            onClick={() => setStatusFilter('normal')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              statusFilter === 'normal' ? 'bg-emerald-900 text-white' : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            Normal / Terangkut
          </button>
        </div>
      </div>

      {/* Dense Enterprise Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold font-mono text-[11px]">
                <th className="py-3 px-4">Kode & Nama TPS</th>
                <th className="py-3 px-4">Wilayah Kecamatan</th>
                <th className="py-3 px-4">Volume / Kapasitas</th>
                <th className="py-3 px-4">Level Keterisian</th>
                <th className="py-3 px-4">Status Sensor & Baterai</th>
                <th className="py-3 px-4">Pengawasan CCTV</th>
                <th className="py-3 px-4">Terakhir Dikosongkan</th>
                <th className="py-3 px-4 text-right">Tindakan Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredTPS.map((tps) => {
                const isCritical = tps.fillPercentage >= 80;
                const isWarning = tps.fillPercentage >= 50 && tps.fillPercentage < 80;
                const isBenowo = tps.id === 'TPA-BNW-00';

                return (
                  <tr key={tps.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{tps.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{tps.code} · {tps.address}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      {tps.district}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-white text-xs">{tps.currentVolumeM3}</span>
                      <span className="text-slate-500"> / {tps.capacityM3} m³</span>
                      <div className="text-[10px] text-slate-400">{tps.estimatedWasteType}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, tps.fillPercentage)}%` }}
                          />
                        </div>
                        <span className={`font-mono font-bold text-xs ${
                          isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {tps.fillPercentage}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                        <Battery className={`w-3.5 h-3.5 ${tps.iotSensorBattery > 70 ? 'text-emerald-400' : 'text-amber-400'}`} />
                        <span>{tps.iotSensorBattery}%</span>
                        <span className="text-emerald-400 font-semibold ml-1">Aktif</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        tps.cctvActive
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        <Video className="w-3 h-3" />
                        <span>{tps.cctvActive ? 'Live Online' : 'No Stream'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {tps.lastEmptiedAt || 'Kemarin'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {!isBenowo && (
                        <button
                          type="button"
                          onClick={() => onDispatchFleet(tps)}
                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Disposisi Truk</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Code, 
  ExternalLink, 
  Sparkles, 
  FileCode,
  Palette
} from 'lucide-react';
import { FIGMA_DESIGN_TOKENS } from '../../data/mockData';

interface FigmaExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FigmaExportModal: React.FC<FigmaExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'tokens' | 'instructions' | 'specs'>('tokens');
  const [copiedTokens, setCopiedTokens] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);

  const tokensString = JSON.stringify(FIGMA_DESIGN_TOKENS, null, 2);

  const handleCopyTokens = () => {
    navigator.clipboard.writeText(tokensString);
    setCopiedTokens(true);
    setTimeout(() => setCopiedTokens(false), 2000);
  };

  const handleDownloadTokens = () => {
    const blob = new Blob([tokensString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartwaste-surabaya-figma-tokens.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  Figma Integration & Design Tokens
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 font-mono">
                  v1.0 Ready
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                Export SmartWaste Surabaya ke Figma
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3">
          <button
            onClick={() => setActiveTab('tokens')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'tokens'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Figma Tokens (JSON)</span>
          </button>

          <button
            onClick={() => setActiveTab('instructions')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'instructions'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Panduan Impor Figma</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'specs'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Spesifikasi UI (390x844)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'tokens' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Token desain ini kompatibel dengan plugin <strong>Tokens Studio for Figma</strong> dan standar Design Tokens W3C.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyTokens}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition shadow-xs"
                  >
                    {copiedTokens ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTokens ? 'Tersalin!' : 'Salin JSON'}</span>
                  </button>
                  <button
                    onClick={handleDownloadTokens}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh .json</span>
                  </button>
                </div>
              </div>

              {/* JSON code viewer */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <pre className="p-4 bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto max-h-64 leading-relaxed">
                  {tokensString}
                </pre>
              </div>

              {/* Quick swatch preview */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Palet Warna Resmi DLH SmartWaste Surabaya:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#1B5E20] shadow-xs shrink-0" />
                    <div className="min-w-0 text-[11px]">
                      <p className="font-bold text-slate-800 truncate">Forest Primary</p>
                      <p className="font-mono text-slate-500">#1B5E20</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#2E7D32] shadow-xs shrink-0" />
                    <div className="min-w-0 text-[11px]">
                      <p className="font-bold text-slate-800 truncate">Emerald Brand</p>
                      <p className="font-mono text-slate-500">#2E7D32</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#D32F2F] shadow-xs shrink-0" />
                    <div className="min-w-0 text-[11px]">
                      <p className="font-bold text-slate-800 truncate">Kritis / Penuh</p>
                      <p className="font-mono text-slate-500">#D32F2F</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#ED6C02] shadow-xs shrink-0" />
                    <div className="min-w-0 text-[11px]">
                      <p className="font-bold text-slate-800 truncate">Peringatan</p>
                      <p className="font-mono text-slate-500">#ED6C02</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-1">
                  Cara Mengimpor Desain ke Figma:
                </h4>
                <p className="text-emerald-800 leading-relaxed">
                  Ada 3 cara mudah untuk mentransfer seluruh 5 layar SmartWaste Surabaya ini ke dokumen kerja Figma Anda:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">1</span>
                    <span>Menggunakan Plugin "html.to.design" (Sangat Disarankan)</span>
                  </h5>
                  <p className="text-slate-600 mt-1 pl-7">
                    Buka Figma &rarr; Buka Plugin <strong>html.to.design</strong> &rarr; Masukkan URL aplikasi preview ini. Plugin akan mengonversi kelima layar secara otomatis menjadi layer, auto-layout, dan teks Figma yang 100% editable!
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">2</span>
                    <span>Menggunakan "Tokens Studio for Figma"</span>
                  </h5>
                  <p className="text-slate-600 mt-1 pl-7">
                    Buka plugin <strong>Tokens Studio</strong> &rarr; Pilih "Load from JSON" &rarr; Salin tab <strong>Figma Tokens</strong> di atas. Semua warna, radius, dan tipografi langsung terdaftar sebagai Color & Text Styles.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">3</span>
                    <span>Tampilan Kanvas Multi-Artboard (Semua Layar)</span>
                  </h5>
                  <p className="text-slate-600 mt-1 pl-7">
                    Gunakan tombol switch mode <strong>"Tampilan Figma Kanvas (5 Layar)"</strong> di toolbar atas untuk melihat semua 5 frame sejajar berdampingan berukuran standar 390x844 iPhone / Pixel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-3 text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-medium">
                    <th className="py-2">Properti UI</th>
                    <th className="py-2">Nilai Standar</th>
                    <th className="py-2">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2 font-semibold">Frame Dimensions</td>
                    <td className="py-2 font-mono">390 × 844 px</td>
                    <td className="py-2 text-slate-500">Standar iPhone 15 Pro & modern Android</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Primary Color</td>
                    <td className="py-2 font-mono">#1B5E20 / #2E7D32</td>
                    <td className="py-2 text-slate-500">Eco-friendly DLH Surabaya Green</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Background Base</td>
                    <td className="py-2 font-mono">#F8F9FA / #F1F5F9</td>
                    <td className="py-2 text-slate-500">Outdoor high-contrast light mode</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Touch Target</td>
                    <td className="py-2 font-mono">Min 44 × 44 px</td>
                    <td className="py-2 text-slate-500">Ergonomis untuk sarung tangan petugas</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Card Radius</td>
                    <td className="py-2 font-mono">16px (rounded-2xl)</td>
                    <td className="py-2 text-slate-500">Material Design 3 & iOS HIG balance</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Bottom Sheet Radius</td>
                    <td className="py-2 font-mono">24px (rounded-t-3xl)</td>
                    <td className="py-2 text-slate-500">Drawer geser rute & navigasi</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            SmartWaste Surabaya UI Specification © 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

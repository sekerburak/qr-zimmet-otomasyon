import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../services/api'; // Projenizin ortak API servisi

interface Asset {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
}

export function QrOperations() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        // JWT Token içeren ortak API istemcisi ile istek atıyoruz
        const response = await api.get('/assets');
        const rawData = response.data;

        // Backend yanıtının dizi veya obje olma durumunu güvenli şekilde ayıklıyoruz:
        let assetList: Asset[] = [];
        if (Array.isArray(rawData)) {
          assetList = rawData;
        } else if (rawData && Array.isArray(rawData.data)) {
          assetList = rawData.data;
        } else if (rawData && Array.isArray(rawData.assets)) {
          assetList = rawData.assets;
        }

        setAssets(assetList);
        if (assetList.length > 0) {
          setSelectedAsset(assetList[0]);
        }
      } catch (err: any) {
        console.error("Demirbaşlar çekilirken hata oluştu:", err);
        setError("Veriler yüklenirken bir sorun oluştu. (Lütfen giriş yaptığınızdan emin olun)");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-ink-300">
        <span>Demirbaş verileri yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl p-6 text-center text-red-400 bg-red-500/10 rounded-xl border border-red-500/20 my-8">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-50">QR Kod Etiket İşlemleri</h1>
        <p className="mt-1 text-sm text-ink-400">Demirbaş seçip QR kod etiketini görüntüleyebilir ve yazdırabilirsiniz.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* SOL: Demirbaş Seçim Listesi */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-night-900/60 p-5 backdrop-blur-md">
          <h2 className="mb-4 text-base font-semibold text-ink-100">
            Demirbaş Listesi ({assets.length})
          </h2>

          {assets.length === 0 ? (
            <p className="text-sm text-ink-400 py-4">Veritabanında henüz kayıtlı demirbaş bulunamadı.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-ink-400">
                    <th className="pb-3 pt-1 px-3">Kod</th>
                    <th className="pb-3 pt-1 px-3">Cihaz Adı</th>
                    <th className="pb-3 pt-1 px-3">Seri No</th>
                    <th className="pb-3 pt-1 px-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {assets.map((asset) => (
                    <tr 
                      key={asset.id} 
                      className={`transition-colors ${selectedAsset?.id === asset.id ? 'bg-signal-500/10' : 'hover:bg-white/5'}`}
                    >
                      <td className="py-3 px-3 font-mono font-medium text-signal-400">{asset.id}</td>
                      <td className="py-3 px-3 font-medium text-ink-100">{asset.name}</td>
                      <td className="py-3 px-3 font-mono text-xs text-ink-400">{asset.serialNumber || '-'}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedAsset(asset)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            selectedAsset?.id === asset.id 
                              ? 'bg-signal-500 text-white shadow-[0_0_12px_-2px_rgba(59,130,246,0.5)]' 
                              : 'bg-white/5 text-ink-300 hover:bg-white/10'
                          }`}
                        >
                          {selectedAsset?.id === asset.id ? 'Seçili' : 'QR Önizle'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SAĞ: QR Etiket Önizleme Kartı */}
        <div className="rounded-2xl border border-white/10 bg-night-900/60 p-6 text-center backdrop-blur-md flex flex-col items-center justify-between">
          {selectedAsset ? (
            <div className="w-full flex flex-col items-center">
              <span className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-4">Etiket Önizleme</span>
              
              {/* Etiket Basım Alanı */}
              <div className="w-full rounded-xl bg-white p-5 text-night-950 shadow-xl flex flex-col items-center border border-white/20">
                <QRCodeSVG 
                  value={JSON.stringify({ id: selectedAsset.id, sn: selectedAsset.serialNumber })} 
                  size={150}
                  level="H"
                />
                <div className="mt-4 font-bold text-base text-gray-900">{selectedAsset.name}</div>
                <div className="font-mono text-sm font-semibold text-blue-600">{selectedAsset.id}</div>
                <div className="font-mono text-[11px] text-gray-500 mt-0.5">SN: {selectedAsset.serialNumber || 'N/A'}</div>
              </div>

              <button
                onClick={handlePrint}
                className="mt-6 w-full rounded-xl bg-signal-500 py-2.5 text-sm font-semibold text-white transition-all hover:bg-signal-400 active:scale-95 shadow-[0_0_16px_-4px_rgba(59,130,246,0.5)]"
              >
                🖨️ Etiketi Yazdır
              </button>
            </div>
          ) : (
            <p className="text-sm text-ink-500 my-auto">Lütfen bir demirbaş seçin.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QrOperations;
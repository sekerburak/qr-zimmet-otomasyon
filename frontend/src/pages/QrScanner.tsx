import { useEffect, useState, type FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, ScanBarcode } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ScannerControls } from "../components/qr/ScannerControls";
import { ScannerOverlay } from "../components/qr/ScannerOverlay";
import { StatusPanel } from "../components/qr/StatusPanel";
import { LastScanCard } from "../components/qr/LastScanCard";
import { useQrScanner } from "../components/qr/useQrScanner";
import { useHtml5Qrcode } from "../components/qr/useHtml5Qrcode";
import { SCANNER_ELEMENT_ID, ScannerState } from "../components/qr/qr-scanner.constants";
import { useToast } from "../components/ui/Toast";
import "../components/qr/qr-scanner.css";

export function QRScanner() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [manualUuid, setManualUuid] = useState("");
  const { status, result, lastScan, scannedUuid, scannedAt, isLoading, setStatus, handleDecoded, resetScan } = useQrScanner();
  const scannedUuidRef = useRef(scannedUuid);

  useEffect(() => {
    scannedUuidRef.current = scannedUuid;
  }, [scannedUuid]);

  const onDecoded = async (value: string) => {
    await html5QrCode.stop();
    await handleDecoded(value, () => {
      setTimeout(() => {
        if (scannedUuidRef.current) {
          navigate(`/assets/${scannedUuidRef.current}`);
        }
      }, 1000);
    });
  };

  const html5QrCode = useHtml5Qrcode({
    onStatusChange: setStatus,
    onDecoded,
    onError: (message) => {
      showToast("error", message);
    },
  });
useEffect(() => {
  return () => {
    html5QrCode.stop().catch(() => {});
  };
}, [html5QrCode.stop]);

  async function handleStart() {
    resetScan();
    await html5QrCode.start();
  }

  async function handleStop() {
    await html5QrCode.stop();
  }

  async function handleRestart() {
    resetScan();
    await html5QrCode.stop();
    await html5QrCode.start();
  }

  async function handleSwitchCamera() {
    await html5QrCode.switchCamera();
    showToast("info", "Kamera değiştirildi");
  }

  function handleManualSubmit(e: FormEvent) {
    e.preventDefault();
    if (!manualUuid.trim()) return;
    onDecoded(manualUuid);
  }

  const cameraActive = status === ScannerState.SCANNING || status === ScannerState.CAMERA_ACTIVE || status === ScannerState.CAMERA_LOADING;
  const isSuccess = status === ScannerState.SUCCESS;
  const isError =
    status === ScannerState.ERROR ||
    status === ScannerState.NO_CAMERA ||
    status === ScannerState.PERMISSION_DENIED ||
    status === ScannerState.NOT_SUPPORTED;
  const cameraBorderClass = isSuccess
    ? "border-ok/30 scanner-glow-success"
    : isError
    ? "border-danger/30 scanner-glow-error"
    : cameraActive
    ? "border-signal-400/40 scanner-glow-active"
    : "border-signal-500/20 scanner-glow";

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-50">QR Tarama</h1>
        <p className="mt-1 text-sm text-ink-400">Demirbaş üzerindeki QR kodunu kameraya gösterin.</p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="scanner-card-enter overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.005]">
          <CardHeader className="mb-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg border border-signal-500/20 bg-signal-500/10 text-signal-400 shadow-[0_0_16px_-4px_rgba(59,130,246,0.4)]">
                <ScanBarcode size={18} />
              </div>
              <div>
                <CardTitle className="text-base">Kamera Görüntüsü</CardTitle>
                <p className="text-xs text-ink-500">Canlı QR tarama alanı</p>
              </div>
            </div>
          </CardHeader>

          <div
            className={`relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden rounded-2xl border transition-all duration-300 ${cameraBorderClass}`}
          >
            <div id={SCANNER_ELEMENT_ID} className={`h-full w-full ${cameraActive ? "block" : "hidden"}`} />

            {!cameraActive && !isSuccess && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-5 rounded-2xl bg-night-950/60">
                <div className="relative grid h-24 w-24 place-items-center rounded-2xl border border-signal-500/20 bg-white/5 text-signal-400 shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)]">
                  <QrCode size={38} />
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-ink-200">Kamera hazır</p>
                  <p className="mt-1 max-w-[240px] text-xs text-ink-500">
                    Kamerayı başlatın ve demirbaş etiketini kare içine hizalayın
                  </p>
                </div>
              </div>
            )}

            <ScannerOverlay status={status} />
          </div>

          <div className="mt-6 space-y-5">
            <ScannerControls
              status={status}
              cameraCount={html5QrCode.cameras.length}
              onStart={handleStart}
              onStop={handleStop}
              onRestart={handleRestart}
              onSwitch={handleSwitchCamera}
            />

            <div className="my-4 flex items-center gap-3 text-xs text-ink-600">
              <div className="h-px flex-1 bg-white/5" />
              veya UUID ile ara
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                value={manualUuid}
                onChange={(e) => setManualUuid(e.target.value)}
                placeholder="QR UUID girin veya kamerayla okutun"
                className="input-dark flex-1 font-mono placeholder:font-body"
              />
              <Button type="submit" variant="secondary" loading={isLoading}>
                <QrCode size={15} /> Tara
              </Button>
            </form>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <StatusPanel status={status} />
          <LastScanCard scan={lastScan || result} scannedAt={scannedAt} scannedUuid={scannedUuid} />
        </div>
      </div>
    </div>

  );
}export default QRScanner;

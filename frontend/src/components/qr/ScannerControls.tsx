import { Camera, ScanLine, RefreshCcw, SwitchCamera, CameraOff } from "lucide-react";
import { Button } from "../ui/Button";
import type { ScannerStatus } from "./qr-scanner.constants";

interface ScannerControlsProps {
  status: ScannerStatus;
  cameraCount: number;
  onStart: () => void;
  onStop: () => void;
  onRestart: () => void;
  onSwitch: () => void;
}

export function ScannerControls({
  status,
  cameraCount,
  onStart,
  onStop,
  onRestart,
  onSwitch,
}: ScannerControlsProps) {
  const isActive = status === "SCANNING" || status === "CAMERA_ACTIVE" || status === "CAMERA_LOADING";
  const isError = status === "ERROR" || status === "NO_CAMERA" || status === "PERMISSION_DENIED" || status === "NOT_SUPPORTED";

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {!isActive ? (
        <Button onClick={onStart} className="flex-1 min-w-[160px] shadow-[0_0_20px_-6px_rgba(59,130,246,0.5)]">
          <Camera size={17} /> Kamerayı Başlat
        </Button>
      ) : (
        <Button variant="secondary" onClick={onStop} className="flex-1 min-w-[160px]">
          <CameraOff size={17} /> Kamerayı Durdur
        </Button>
      )}

      {(isError || status === "READY" || status === "IDLE") && (
        <Button variant="secondary" onClick={onRestart} className="min-w-[120px]">
          <RefreshCcw size={16} /> Yeniden Tara
        </Button>
      )}

      {cameraCount > 1 && isActive && (
        <Button variant="ghost" size="sm" onClick={onSwitch} title="Kamera Değiştir" className="gap-1.5">
          <SwitchCamera size={16} /> Değiştir
        </Button>
      )}
    </div>
  );
}

import {
  ScanLine,
  Camera,
  CameraOff,
  Loader2,
  Search,
  CheckCircle2,
  XCircle,
  MonitorX,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

export enum ScannerState {
  IDLE = "IDLE",
  READY = "READY",
  CAMERA_LOADING = "CAMERA_LOADING",
  CAMERA_ACTIVE = "CAMERA_ACTIVE",
  SCANNING = "SCANNING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  NO_CAMERA = "NO_CAMERA",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  NOT_SUPPORTED = "NOT_SUPPORTED",
}

export type ScannerStatus = ScannerState;

export interface ScannerStatusMeta {
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  glowClass: string;
  pulse?: boolean;
  spin?: boolean;
}

export const SCANNER_STATUS_META: Record<ScannerStatus, ScannerStatusMeta> = {
  [ScannerState.IDLE]: {
    label: "Hazır",
    title: "Sistem Hazır",
    description: "Taramayı başlatmak için kamerayı açın",
    icon: ScanLine,
    colorClass: "text-signal-400",
    bgClass: "bg-signal-500/10",
    borderClass: "border-signal-500/20",
    glowClass: "shadow-signal-500/25",
  },
  [ScannerState.READY]: {
    label: "Hazır",
    title: "Kamera Hazır",
    description: "QR taraması için kamerayı başlatın",
    icon: Camera,
    colorClass: "text-signal-400",
    bgClass: "bg-signal-500/10",
    borderClass: "border-signal-500/20",
    glowClass: "shadow-signal-500/25",
  },
  [ScannerState.CAMERA_LOADING]: {
    label: "Kamera Açılıyor",
    title: "Kamera Başlatılıyor",
    description: "Cihaz kameraları taranıyor ve hazırlanıyor...",
    icon: Loader2,
    colorClass: "text-beacon-400",
    bgClass: "bg-beacon-500/10",
    borderClass: "border-beacon-500/20",
    glowClass: "shadow-beacon-500/25",
    spin: true,
  },
  [ScannerState.CAMERA_ACTIVE]: {
    label: "Kamera Aktif",
    title: "Kamera Aktif",
    description: "Kamera görüntüsü canlı, QR bekleniyor",
    icon: Camera,
    colorClass: "text-signal-400",
    bgClass: "bg-signal-500/10",
    borderClass: "border-signal-500/20",
    glowClass: "shadow-signal-500/25",
    pulse: true,
  },
  [ScannerState.SCANNING]: {
    label: "QR Aranıyor",
    title: "QR Kod Aranıyor",
    description: "QR kodu kare içine hizalayın",
    icon: Search,
    colorClass: "text-signal-400",
    bgClass: "bg-signal-500/10",
    borderClass: "border-signal-500/20",
    glowClass: "shadow-signal-500/25",
    pulse: true,
  },
  [ScannerState.SUCCESS]: {
    label: "QR Bulundu",
    title: "Tarama Başarılı",
    description: "Demirbaş bilgileri alınıyor, yönlendiriliyorsunuz...",
    icon: CheckCircle2,
    colorClass: "text-ok",
    bgClass: "bg-ok/10",
    borderClass: "border-ok/20",
    glowClass: "shadow-ok/30",
  },
  [ScannerState.ERROR]: {
    label: "Tarama Hatası",
    title: "Geçersiz QR",
    description: "QR okunamadı, lütfen tekrar deneyin",
    icon: XCircle,
    colorClass: "text-danger",
    bgClass: "bg-danger/10",
    borderClass: "border-danger/20",
    glowClass: "shadow-danger/25",
  },
  [ScannerState.NO_CAMERA]: {
    label: "Kamera Bulunamadı",
    title: "Kamera Yok",
    description: "Cihazda kullanılabilir kamera bulunamadı",
    icon: CameraOff,
    colorClass: "text-warn",
    bgClass: "bg-warn/10",
    borderClass: "border-warn/20",
    glowClass: "shadow-warn/20",
  },
  [ScannerState.PERMISSION_DENIED]: {
    label: "İzin Yok",
    title: "Kamera İzni Reddedildi",
    description: "Tarayıcı ayarlarından kamera erişimine izin verin",
    icon: ShieldAlert,
    colorClass: "text-danger",
    bgClass: "bg-danger/10",
    borderClass: "border-danger/20",
    glowClass: "shadow-danger/25",
  },
  [ScannerState.NOT_SUPPORTED]: {
    label: "Desteklenmiyor",
    title: "Desteklenmeyen Tarayıcı",
    description: "Kameraya erişim bu tarayıcıda desteklenmiyor",
    icon: MonitorX,
    colorClass: "text-warn",
    bgClass: "bg-warn/10",
    borderClass: "border-warn/20",
    glowClass: "shadow-warn/20",
  },
};

export const SCANNER_ELEMENT_ID = "qr-reader";

export function extractUuid(rawValue: string): string {
  const trimmed = rawValue.trim();
  const parts = trimmed.split("/");
  return parts[parts.length - 1];
}

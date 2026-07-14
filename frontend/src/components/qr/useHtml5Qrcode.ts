import { useEffect, useRef, useCallback, useState } from "react";
import { Html5Qrcode, type CameraDevice } from "html5-qrcode";
import { SCANNER_ELEMENT_ID, ScannerState } from "./qr-scanner.constants";
import type { ScannerStatus } from "./qr-scanner.constants";

export interface UseHtml5QrcodeOptions {
  onStatusChange: (status: ScannerStatus) => void;
  onDecoded: (value: string) => void;
  onError: (message: string) => void;
}

export interface UseHtml5QrcodeResult {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  switchCamera: () => Promise<void>;
  cameras: CameraDevice[];
  activeCameraIndex: number;
}

export function useHtml5Qrcode({ onStatusChange, onDecoded, onError }: UseHtml5QrcodeOptions): UseHtml5QrcodeResult {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const camerasRef = useRef<CameraDevice[]>([]);
  const activeIndexRef = useRef(0);
  const runningRef = useRef(false);
  const [tick, setTick] = useState(0);

  const decodedRef = useRef(false);

  // Dışarıdan gelen callback'ler her render'da yeni referans olabilir
  // (caller tarafında useCallback ile sarılmamışsa). Bunları ref'e alıp
  // start/stop/switchCamera'nın identity'sini bu callback'lerden bağımsız
  // tutuyoruz. Böylece dışarıdaki bir düzeltme unutulsa bile döngü oluşmaz.
  const onStatusChangeRef = useRef(onStatusChange);
  const onDecodedRef = useRef(onDecoded);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
    onDecodedRef.current = onDecoded;
    onErrorRef.current = onError;
  }, [onStatusChange, onDecoded, onError]);

  const stop = useCallback(async () => {
    if (!scannerRef.current || !runningRef.current) {
      onStatusChangeRef.current(ScannerState.READY);
      return;
    }
    try {
      await scannerRef.current.stop();
    } catch {
      // ignore
    } finally {
      runningRef.current = false;
      decodedRef.current = false;
      onStatusChangeRef.current(ScannerState.READY);
    }
  }, []);

  const start = useCallback(async () => {
      decodedRef.current = false;
    if (!Html5Qrcode.getCameras) {
      onStatusChangeRef.current(ScannerState.NOT_SUPPORTED);
      return;
    }

    onStatusChangeRef.current(ScannerState.CAMERA_LOADING);

    try {
      const devices = await Html5Qrcode.getCameras();
      camerasRef.current = devices;

      if (devices.length === 0) {
        onStatusChangeRef.current(ScannerState.NO_CAMERA);
        return;
      }

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(SCANNER_ELEMENT_ID);
      }

      const activeDevice = devices[activeIndexRef.current] ?? devices[0];

      await scannerRef.current.start(
        activeDevice.id,
        { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1 },
       async (decodedText) => {

    if (decodedRef.current) return;

    decodedRef.current = true;

    runningRef.current = false;

    try {
        await scannerRef.current?.stop();
    } catch {}

    onDecodedRef.current(decodedText);
},
        () => {
          onStatusChangeRef.current(ScannerState.SCANNING);
        }
      );

      runningRef.current = true;
      onStatusChangeRef.current(ScannerState.CAMERA_ACTIVE);
      // Kısa süre sonra SCANNING'e geç, kullanıcı deneyimi için
      setTimeout(() => {
        if (runningRef.current) onStatusChangeRef.current(ScannerState.SCANNING);
      }, 600);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("Permission") || message.includes("denied")) {
        onStatusChangeRef.current(ScannerState.PERMISSION_DENIED);
      } else if (message.includes("NotFound") || message.includes("device")) {
        onStatusChangeRef.current(ScannerState.NO_CAMERA);
      } else {
        onErrorRef.current("Kameraya erişilemedi");
        onStatusChangeRef.current(ScannerState.ERROR);
      }
    }
    // Bilerek boş: start artık hiçbir dış callback'e bağımlı değil,
    // her zaman aynı fonksiyon referansını korur.
  }, []);

  const switchCamera = useCallback(async () => {
    if (camerasRef.current.length <= 1) return;
    activeIndexRef.current = (activeIndexRef.current + 1) % camerasRef.current.length;
    await stop();
    await start();
    setTick((n) => n + 1);
  }, [start, stop]);

  useEffect(() => {
    return () => {
      stop().catch(() => {});
    };
    // stop artık stabil (dependency: []), bu efekt sadece unmount'ta çalışır.
  }, [stop]);

  return {
    start,
    stop,
    switchCamera,
    cameras: camerasRef.current,
    activeCameraIndex: activeIndexRef.current,
  };
}
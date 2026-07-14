import { useCallback } from "react";
import { useToast } from "../../components/ui/Toast";
import { lookupByUuid } from "../../api/qr.api";
import { getErrorMessage } from "../../api/axios";
import { extractUuid, ScannerState } from "./qr-scanner.constants";
import type { QrLookupResult } from "../../types/asset";
import type { ScannerStatus } from "./qr-scanner.constants";
import { useSetState } from "./useSetState";

export interface UseQrScannerResult {
  status: ScannerStatus;
  result: QrLookupResult | null;
  lastScan: QrLookupResult | null;
  scannedUuid: string | null;
  scannedAt: Date | null;
  error: string | null;
  isLoading: boolean;
  setStatus: (status: ScannerStatus) => void;
  handleDecoded: (rawValue: string, onSuccess?: (asset: QrLookupResult) => void) => Promise<void>;
  resetScan: () => void;
  clearError: () => void;
}

interface ScannerStateShape {
  status: ScannerStatus;
  result: QrLookupResult | null;
  lastScan: QrLookupResult | null;
  scannedUuid: string | null;
  scannedAt: Date | null;
  error: string | null;
  isLoading: boolean;
}

export function useQrScanner(): UseQrScannerResult {
  const { showToast } = useToast();
  const [state, setState] = useSetState<ScannerStateShape>({
    status: ScannerState.IDLE,
    result: null,
    lastScan: null,
    scannedUuid: null,
    scannedAt: null,
    error: null,
    isLoading: false,
  });

  const clearError = useCallback(() => setState({ error: null }), [setState]);

  const resetScan = useCallback(() => {
    setState({
      result: null,
      scannedUuid: null,
      error: null,
      status: ScannerState.READY,
      isLoading: false,
    });
  }, [setState]);

  const setStatus = useCallback(
    (status: ScannerStatus) => {
      setState({ status });
    },
    [setState]
  );

  const handleDecoded = useCallback(
    async (rawValue: string, onSuccess?: (asset: QrLookupResult) => void) => {
      const uuid = extractUuid(rawValue);
      if (!uuid) return;

      setState({ status: ScannerState.SUCCESS, isLoading: true, error: null });

      try {
        const data = await lookupByUuid(uuid);
        setState({
          result: data,
          lastScan: data,
          scannedUuid: uuid,
          scannedAt: new Date(),
          isLoading: false,
        });
        showToast("success", "QR başarıyla okundu");
        onSuccess?.(data);
      } catch (err) {
        const message = getErrorMessage(err, "Bu QR ile eşleşen demirbaş bulunamadı");
        setState({
          error: message,
          status: ScannerState.ERROR,
          isLoading: false,
          result: null,
          scannedUuid: null,
        });
        showToast("error", message);
      }
    },
    [setState, showToast]
  );

  return {
    status: state.status,
    result: state.result,
    lastScan: state.lastScan,
    scannedUuid: state.scannedUuid,
    scannedAt: state.scannedAt,
    error: state.error,
    isLoading: state.isLoading,
    setStatus,
    handleDecoded,
    resetScan,
    clearError,
  };
}

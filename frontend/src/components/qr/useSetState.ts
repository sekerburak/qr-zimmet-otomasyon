import { useState, useCallback } from "react";

export function useSetState<T extends object>(initial: T): [T, (patch: Partial<T>) => void] {
  const [state, setState] = useState<T>(initial);
  const patchState = useCallback((patch: Partial<T>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);
  return [state, patchState];
}

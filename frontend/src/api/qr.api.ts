import { api } from "./axios";
import type { QrLookupResult } from "../types/asset";

/** GET /api/qr/:uuid — QR okutunca ya da uuid elle girilince çağrılır. Auth gerektirmez. */
export async function lookupByUuid(uuid: string): Promise<QrLookupResult> {
  const { data } = await api.get<{ message: string; data: QrLookupResult }>(`/qr/${uuid}`);
  return data.data;
}

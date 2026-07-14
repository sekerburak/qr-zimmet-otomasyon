import { api } from "./axios";
import type { Assignment } from "../types/asset";

export async function assignAsset(assetId: number, userId: number): Promise<{ message: string; assignment: Assignment }> {
  const { data } = await api.post("/assignments", { assetId, userId });
  return data;
}

export async function returnAssignment(assignmentId: number): Promise<{ message: string; assignment: Assignment }> {
  const { data } = await api.patch(`/assignments/${assignmentId}/return`);
  return data;
}

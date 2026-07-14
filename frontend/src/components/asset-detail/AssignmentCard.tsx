import { useState, type FormEvent } from "react";
import { UserRound, PackageCheck, Mail, CalendarDays, ArrowLeftRight, Undo2 } from "lucide-react";
import type { QrLookupResult } from "../../types/asset";
import { Card, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { formatDate } from "../../utils/format";

interface AssignmentCardProps {
  asset: QrLookupResult;
  canManage: boolean;
  submitting: boolean;
  onAssign: (userId: number) => Promise<void>;
  onReturn: () => Promise<void>;
  onReassign: (userId: number) => Promise<void>;
}

type FormMode = "idle" | "assign" | "reassign";

/**
 * Brief; zimmetli durumda "Teslim Eden / Teslim Alan / Beklenen İade Tarihi"
 * alanlarını da istiyordu. Assignment tipinde (types/asset.ts) sadece
 * assignedDate/returnDate/status/user var — bu üç alan backend şemasında yok.
 * Aynı şekilde kullanıcı için "Bilgi İşlem" gibi bir departman alanı da User
 * tipinde tanımlı değil (sadece id/name/email/role var). Kural 12 backend
 * değişikliğini yasakladığı için bunlar sahte veriyle doldurulmadı; yalnızca
 * gerçekten dönen alanlar (isim, e-posta, zimmet tarihi) gösteriliyor.
 *
 * Kullanıcı seçimi hâlâ sayısal ID ile yapılıyor çünkü GET /users endpoint'i
 * yok (bkz. pages/Users.tsx) — aranabilir bir kullanıcı seçici için önce bir
 * listeleme endpoint'i gerekiyor. Bu, prompttaki gibi "her şeyi olabildiğince
 * kurumsal göster" değil, "olmayan veriyi uydurma" tercihi; en azından alan
 * artık en azından net bir etiket ve yardım metniyle sunuluyor.
 */
export function AssignmentCard({ asset, canManage, submitting, onAssign, onReturn, onReassign }: AssignmentCardProps) {
  const [formMode, setFormMode] = useState<FormMode>("idle");
  const [userId, setUserId] = useState("");

  const activeAssignment = asset.assignments?.find((a) => a.status === "ACTIVE");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const id = Number(userId);
    if (!id) return;
    if (formMode === "reassign") {
      await onReassign(id);
    } else {
      await onAssign(id);
    }
    setUserId("");
    setFormMode("idle");
  }

  return (
    <Card>
      <CardTitle className="mb-4">Zimmet Durumu</CardTitle>

      {activeAssignment ? (
        <div className="rounded-xl border border-info/20 bg-info/[0.06] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-info/15 text-info">
              <UserRound size={19} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-50">
                {activeAssignment.user?.name || `Kullanıcı #${activeAssignment.userId}`}
              </p>
              {activeAssignment.user?.email && (
                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-ink-500">
                  <Mail size={11} /> {activeAssignment.user.email}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 border-t border-white/[0.06] pt-3 text-xs text-ink-400">
            <CalendarDays size={13} />
            <span>Zimmet Tarihi: {formatDate(activeAssignment.assignedDate)}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-ok/20 bg-ok/[0.06] p-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ok/15 text-ok">
            <PackageCheck size={19} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-50">Depoda</p>
            <p className="mt-0.5 text-xs text-ink-500">Bu demirbaş herhangi bir kullanıcıya zimmetli değil.</p>
          </div>
        </div>
      )}

      {canManage && (
        <div className="mt-4 border-t border-white/[0.06] pt-4">
          {formMode === "idle" && (
            <div className="flex flex-wrap gap-2">
              {activeAssignment ? (
                <>
                  <Button variant="secondary" loading={submitting} onClick={onReturn} className="flex-1">
                    <Undo2 size={14} /> İade Al
                  </Button>
                  <Button variant="ghost" onClick={() => setFormMode("reassign")} className="flex-1 border border-white/10">
                    <ArrowLeftRight size={14} /> Yeniden Zimmetle
                  </Button>
                </>
              ) : (
                <Button onClick={() => setFormMode("assign")} className="w-full">
                  Zimmetle
                </Button>
              )}
            </div>
          )}

          {formMode !== "idle" && (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <label className="block text-xs font-medium text-ink-400">
                {formMode === "reassign" ? "Yeni zimmet sahibinin kullanıcı ID'si" : "Zimmetlenecek kullanıcının ID'si"}
              </label>
              <div className="flex gap-2">
                <input
                  autoFocus
                  required
                  type="number"
                  min={1}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Örn. 14"
                  className="input-dark flex-1"
                />
                <Button type="submit" loading={submitting}>
                  {formMode === "reassign" ? "Devret" : "Zimmetle"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setFormMode("idle")}>
                  Vazgeç
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </Card>
  );
}

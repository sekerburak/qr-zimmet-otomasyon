import { Skeleton } from "../ui/Skeleton";
import { Card } from "../ui/Card";

export function AssetDetailSkeleton() {
  return (
    <div className="space-y-5">
      <Card className="p-6 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <div className="space-y-2.5">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <Skeleton className="h-24 w-full lg:w-56" />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <Skeleton className="mb-4 h-4 w-32" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </Card>
        <Card>
          <Skeleton className="mb-4 h-4 w-32" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </Card>
        <Card>
          <Skeleton className="mb-4 h-4 w-24" />
          <Skeleton className="mx-auto h-48 w-48 rounded-2xl" />
        </Card>
        <Card>
          <Skeleton className="mb-4 h-4 w-32" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

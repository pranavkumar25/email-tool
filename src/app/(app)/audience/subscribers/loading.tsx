import { Skeleton } from "@/components/ui";

export default function SubscribersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[92px] rounded-xl" />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-full max-w-md" />
        <Skeleton className="h-9 w-44" />
      </div>

      <div className="overflow-hidden rounded-xl border border-line">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[61px] rounded-none" />
        ))}
      </div>
    </div>
  );
}

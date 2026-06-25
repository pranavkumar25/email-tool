import { Skeleton } from "@/components/ui";

export default function FormsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[92px] rounded-xl" />
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-line">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[69px] rounded-none" />
        ))}
      </div>
    </div>
  );
}

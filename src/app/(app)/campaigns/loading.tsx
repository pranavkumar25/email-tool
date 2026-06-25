import { Skeleton } from "@/components/ui";

export default function CampaignsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-full max-w-xs" />
        <Skeleton className="h-8 w-64" />
      </div>

      <div className="overflow-hidden rounded-xl border border-line">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[49px] rounded-none" />
        ))}
      </div>
    </div>
  );
}

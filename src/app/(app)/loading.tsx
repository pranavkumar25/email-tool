import { Skeleton } from "@/components/ui";

/** Default instant skeleton for signed-in pages (covers settings, new, etc.). */
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

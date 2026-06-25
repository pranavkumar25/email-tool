"use client";

import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteSegmentAction } from "../actions";

export function DeleteSegmentButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  async function onDelete() {
    if (!confirm(`Delete the segment “${name}”?`)) return;
    await deleteSegmentAction(id);
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={onDelete}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-faint opacity-0 transition-all hover:bg-canvas hover:text-rose-600 group-hover:opacity-100"
      aria-label={`Delete ${name}`}
    >
      <TrashIcon className="h-4 w-4" strokeWidth={2} />
    </button>
  );
}

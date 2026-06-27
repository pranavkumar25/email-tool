import * as React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

/** Shared input styling so every field looks identical across the app. */
export const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink shadow-xs placeholder:text-faint transition-colors focus:border-accent-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-[13px] font-medium text-ink", className)}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputClass, "min-h-[96px]", className)} {...props} />;
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(inputClass, "pr-8", className)} {...props} />;
}

/** Label + control + optional hint/error, vertically stacked. */
export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="ml-0.5 text-signal-500">*</span>}
        </Label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-signal-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-faint">{hint}</p>
      ) : null}
    </div>
  );
}

export function SearchInput({
  className,
  wrapperClassName,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  wrapperClassName?: string;
}) {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
      <input
        className={cn(inputClass, "h-9 pl-9", className)}
        type="search"
        {...props}
      />
    </div>
  );
}

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Checkbox({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-4 w-4 cursor-pointer rounded border-line-strong text-accent accent-accent-600 focus:ring-accent-500",
        className,
      )}
      {...props}
    />
  );
});

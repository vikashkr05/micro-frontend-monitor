import { clsx } from "clsx";
import type { ModuleStatus } from "../types";

const map: Record<ModuleStatus, { label: string; classes: string; dot: string }> = {
  healthy:  { label: "Healthy",  classes: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300", dot: "bg-emerald-400 animate-pulse" },
  degraded: { label: "Degraded", classes: "bg-amber-500/15 border-amber-500/40 text-amber-300",   dot: "bg-amber-400" },
  failing:  { label: "Failing",  classes: "bg-rose-500/15 border-rose-500/40 text-rose-300",       dot: "bg-rose-400 animate-pulse" },
  unknown:  { label: "Unknown",  classes: "bg-slate-500/15 border-slate-500/40 text-slate-400",    dot: "bg-slate-500" },
};

export default function StatusBadge({ status }: { status: ModuleStatus }) {
  const { label, classes, dot } = map[status];
  return (
    <span className={clsx("inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border", classes)}>
      <span className={clsx("w-1.5 h-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}

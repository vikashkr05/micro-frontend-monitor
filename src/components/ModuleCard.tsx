import { clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, GitBranch, Zap } from "lucide-react";
import type { MFEModule } from "../types";
import StatusBadge from "./StatusBadge";
import MiniSparkline from "./MiniSparkline";

interface Props {
  module: MFEModule;
  selected: boolean;
  onClick: () => void;
}

export default function ModuleCard({ module: m, selected, onClick }: Props) {
  const hasDrift = m.currentVersion !== m.latestVersion;

  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left rounded-xl border p-4 transition-all hover:border-slate-500",
        selected
          ? "border-indigo-500 bg-indigo-500/10"
          : "border-[#2d3148] bg-[#131624]"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="font-semibold text-white text-sm">{m.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{m.team}</p>
        </div>
        <StatusBadge status={m.status} />
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
        <span className="flex items-center gap-1">
          <GitBranch size={11} />
          v{m.currentVersion}
          {hasDrift && (
            <span className="text-amber-400 ml-1 flex items-center gap-0.5">
              <AlertTriangle size={10} />
              v{m.latestVersion} avail
            </span>
          )}
        </span>
        <span className="flex items-center gap-1">
          <Zap size={11} />
          {m.loadTimeMs > 0 ? `${m.loadTimeMs} ms` : "—"}
        </span>
      </div>

      <MiniSparkline history={m.loadHistory} />

      <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
        <span>Error rate: <span className={clsx(
          "font-semibold",
          m.errorRate > 0.2 ? "text-rose-400" : m.errorRate > 0.05 ? "text-amber-400" : "text-emerald-400"
        )}>{(m.errorRate * 100).toFixed(1)}%</span></span>
        <span>Deployed {formatDistanceToNow(m.lastDeployedAt, { addSuffix: true })}</span>
      </div>
    </button>
  );
}

import { clsx } from "clsx";
import { CheckCircle2, XCircle } from "lucide-react";
import type { LoadEvent } from "../types";

export default function EventFeed({ events }: { events: LoadEvent[] }) {
  return (
    <div className="bg-[#131624] rounded-xl border border-[#2d3148] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#2d3148]">
        <h3 className="text-sm font-semibold text-slate-300">Live Load Events</h3>
      </div>
      <div className="divide-y divide-[#1e2235] max-h-64 overflow-y-auto">
        {[...events].reverse().map((e) => (
          <div key={e.id} className="flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-white/5">
            {e.success
              ? <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              : <XCircle size={14} className="text-rose-400 shrink-0" />
            }
            <span className="text-slate-300 font-medium w-32 truncate">{e.moduleName}</span>
            <span className="text-slate-500 font-mono">{e.route}</span>
            <span className={clsx("ml-auto font-semibold", e.success ? "text-slate-300" : "text-rose-400")}>
              {e.loadTimeMs} ms
            </span>
            <span className="text-slate-600 w-16 text-right">
              {new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

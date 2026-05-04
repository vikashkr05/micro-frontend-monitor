import { useState, useEffect } from "react";
import { Layers, Activity, AlertTriangle, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { MODULES, generateLoadEvents, getStatusCounts, versionDriftCount } from "./lib/mock-data";
import type { LoadEvent, MFEModule } from "./types";
import ModuleCard from "./components/ModuleCard";
import ModuleDetail from "./components/ModuleDetail";
import EventFeed from "./components/EventFeed";

export default function App() {
  const [selected, setSelected] = useState<MFEModule>(MODULES[0]);
  const [events, setEvents] = useState<LoadEvent[]>(generateLoadEvents(30));
  const [live, setLive] = useState(true);

  // Simulate new load events
  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      setEvents((prev) => {
        const mod = MODULES[Math.floor(Math.random() * MODULES.length)];
        const success = Math.random() > mod.errorRate;
        const newEvent: LoadEvent = {
          id: `evt-${Date.now()}`,
          moduleId: mod.id,
          moduleName: mod.name,
          timestamp: Date.now(),
          loadTimeMs: success ? mod.loadTimeMs + Math.floor(Math.random() * 30 - 10) : Math.floor(Math.random() * 1500 + 400),
          success,
          error: success ? undefined : "ChunkLoadError: Loading chunk failed",
          route: ["/", "/dashboard", "/users", "/billing"][Math.floor(Math.random() * 4)],
        };
        return [...prev.slice(-49), newEvent];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [live]);

  const counts = getStatusCounts(MODULES);
  const drift = versionDriftCount(MODULES);

  return (
    <div className="min-h-screen bg-[#0a0d18] text-slate-200">
      {/* Header */}
      <header className="border-b border-[#2d3148] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="text-indigo-400" size={22} />
          <div>
            <h1 className="text-base font-bold text-white">Micro-Frontend Monitor</h1>
            <p className="text-xs text-slate-500">Module Federation · Version Drift · Load Health</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Summary chips */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={12} />{counts.healthy} healthy</span>
            <span className="flex items-center gap-1 text-amber-400"><AlertTriangle size={12} />{counts.degraded} degraded</span>
            <span className="flex items-center gap-1 text-rose-400"><XCircle size={12} />{counts.failing} failing</span>
            <span className="flex items-center gap-1 text-slate-400"><HelpCircle size={12} />{counts.unknown} unknown</span>
          </div>
          {drift > 0 && (
            <span className="text-xs bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-full flex items-center gap-1">
              <AlertTriangle size={11} /> {drift} version{drift > 1 ? "s" : ""} behind
            </span>
          )}
          <button
            onClick={() => setLive((v) => !v)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              live
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-slate-700/50 border-slate-600 text-slate-400"
            }`}
          >
            <Activity size={12} />
            {live ? "Live" : "Paused"}
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Left — module grid */}
        <aside className="w-80 border-r border-[#2d3148] overflow-y-auto p-4 space-y-3 shrink-0">
          <p className="text-xs uppercase tracking-widest text-slate-500 px-1 pb-1">
            {MODULES.length} Modules
          </p>
          {MODULES.map((m) => (
            <ModuleCard
              key={m.id}
              module={m}
              selected={selected.id === m.id}
              onClick={() => setSelected(m)}
            />
          ))}
        </aside>

        {/* Right — detail + feed */}
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          <ModuleDetail module={selected} />
          <EventFeed events={events} />
        </main>
      </div>
    </div>
  );
}

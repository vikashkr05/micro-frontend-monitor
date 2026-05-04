import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Box, GitBranch, Users, Zap } from "lucide-react";
import type { MFEModule } from "../types";
import StatusBadge from "./StatusBadge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

export default function ModuleDetail({ module: m }: { module: MFEModule }) {
  const hasDrift = m.currentVersion !== m.latestVersion;
  const chartData = m.loadHistory.slice(-15).map((h, i) => ({
    i,
    ms: h.loadTimeMs,
    ok: h.success,
  }));

  return (
    <div className="bg-[#131624] rounded-xl border border-[#2d3148] p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">{m.name}</h2>
          <p className="text-sm text-slate-400 mt-0.5">Team: {m.team}</p>
        </div>
        <StatusBadge status={m.status} />
      </div>

      {/* Version drift warning */}
      {hasDrift && (
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2.5 text-sm text-amber-300">
          <AlertTriangle size={16} className="shrink-0" />
          Version drift detected — running <strong>v{m.currentVersion}</strong>, latest is <strong>v{m.latestVersion}</strong>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Zap, label: "Avg Load", value: m.loadTimeMs > 0 ? `${m.loadTimeMs} ms` : "—" },
          { icon: AlertTriangle, label: "Error Rate", value: `${(m.errorRate * 100).toFixed(1)}%`,
            danger: m.errorRate > 0.1 },
          { icon: GitBranch, label: "Deployed", value: formatDistanceToNow(m.lastDeployedAt, { addSuffix: true }) },
        ].map(({ icon: Icon, label, value, danger }) => (
          <div key={label} className="bg-[#1a1d2e] rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Icon size={11} />
              {label}
            </div>
            <p className={`text-sm font-semibold ${danger ? "text-rose-400" : "text-white"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Load time bar chart */}
      {chartData.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Load Time — Last 15 Events</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3148" />
              <XAxis dataKey="i" hide />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} unit="ms" />
              <Tooltip
                contentStyle={{ background: "#1a1d2e", border: "1px solid #2d3148", borderRadius: 8, fontSize: 11 }}
                formatter={(v: number) => [`${v} ms`, "Load time"]}
                labelFormatter={() => ""}
              />
              <Bar dataKey="ms" radius={[3, 3, 0, 0]}>
                {chartData.map((d) => (
                  <Cell key={d.i} fill={d.ok ? "#6366f1" : "#f43f5e"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-600 mt-1"><span className="text-indigo-400">■</span> success  <span className="text-rose-400">■</span> failure</p>
        </div>
      )}

      {/* Exposed components */}
      <div>
        <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
          <Box size={11} /> Exposed Components
        </p>
        <div className="flex flex-wrap gap-2">
          {m.exposedComponents.map((c) => (
            <span key={c} className="text-xs bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Consumers */}
      {m.consumers.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
            <Users size={11} /> Consumed By
          </p>
          <div className="flex flex-wrap gap-2">
            {m.consumers.map((c) => (
              <span key={c} className="text-xs bg-slate-700/50 border border-slate-600 text-slate-300 px-2 py-0.5 rounded-full">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

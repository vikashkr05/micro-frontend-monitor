import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

interface HistoryEntry { timestamp: number; loadTimeMs: number; success: boolean }

export default function MiniSparkline({ history }: { history: HistoryEntry[] }) {
  if (!history.length) return <div className="h-8 flex items-center text-xs text-slate-600">No data</div>;

  const data = history.map((h) => ({ v: h.success ? h.loadTimeMs : null }));

  return (
    <div className="h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke="#6366f1"
            strokeWidth={1.5}
            dot={false}
            connectNulls={false}
          />
          <Tooltip
            contentStyle={{ background: "#1a1d2e", border: "1px solid #2d3148", borderRadius: 6, fontSize: 11 }}
            formatter={(v: number) => [`${v} ms`, "Load"]}
            labelFormatter={() => ""}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";

export default function RiskCharts({ xValues, rValues, rPrimeValues, xUnsafeStart, threshold }) {
  const chartData = xValues.map((x, idx) => ({
    x: Number(x.toFixed(2)),
    r: Number(rValues[idx]?.toFixed(2) || 0),
    rPrime: Number(rPrimeValues[idx]?.toFixed(2) || 0),
  }));

  const maxX = Math.max(...xValues);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 shadow-2xl shadow-cyan-500/20">
          <p className="text-white font-bold mb-2 text-sm">x = {label}</p>
          {payload.map((entry, idx) => (
            <p
              key={idx}
              className="text-xs font-medium"
              style={{ color: entry.color }}
            >
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const rColor = "#22d3ee"; // cyan-400
  const rPrimeColor = "#c084fc"; // purple-400
  const unsafeColor = "rgba(239, 68, 68, 0.12)"; // red with opacity

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></span>
        <h3 className="text-lg font-bold text-white uppercase tracking-wide">Risk Growth Visualization</h3>
      </div>
      
      {/* R(x) Chart */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-300 pl-1">R(x) - Risk Function</h4>
        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
            >
              <defs>
                <linearGradient id="rGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={rColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={rColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
              <XAxis
                dataKey="x"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickFormatter={(value) => value.toFixed(1)}
                label={{ 
                  value: "Attack Surface Score (x)", 
                  position: "insideBottom", 
                  offset: -10, 
                  fill: "#cbd5e1", 
                  fontSize: 12,
                  fontWeight: 500
                }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                label={{ 
                  value: "Risk R(x)", 
                  angle: -90, 
                  position: "insideLeft", 
                  fill: "#cbd5e1", 
                  fontSize: 12,
                  fontWeight: 500
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: rColor, strokeWidth: 1, strokeDasharray: '5 5' }} />
              <Legend
                wrapperStyle={{ color: "#cbd5e1", fontSize: 12, paddingTop: '10px' }}
                iconType="line"
              />
              {xUnsafeStart != null && (
                <>
                  <ReferenceArea
                    x1={xUnsafeStart}
                    x2={maxX}
                    stroke="none"
                    fill={unsafeColor}
                  />
                  <ReferenceLine
                    x={xUnsafeStart}
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ 
                      value: `Unsafe at x=${xUnsafeStart.toFixed(1)}`, 
                      position: "top", 
                      fill: "#f87171", 
                      fontSize: 11,
                      fontWeight: 600
                    }}
                  />
                </>
              )}
              <Line
                type="monotone"
                dataKey="r"
                stroke={rColor}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, fill: rColor, strokeWidth: 2, stroke: '#1e293b' }}
                name="R(x)"
                fill="url(#rGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* R'(x) Chart */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-300 pl-1">R'(x) - Rate of Risk Growth</h4>
        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
            >
              <defs>
                <linearGradient id="rPrimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={rPrimeColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={rPrimeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
              <XAxis
                dataKey="x"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickFormatter={(value) => value.toFixed(1)}
                label={{ 
                  value: "Attack Surface Score (x)", 
                  position: "insideBottom", 
                  offset: -10, 
                  fill: "#cbd5e1", 
                  fontSize: 12,
                  fontWeight: 500
                }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                label={{ 
                  value: "R'(x)", 
                  angle: -90, 
                  position: "insideLeft", 
                  fill: "#cbd5e1", 
                  fontSize: 12,
                  fontWeight: 500
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: rPrimeColor, strokeWidth: 1, strokeDasharray: '5 5' }} />
              <Legend
                wrapperStyle={{ color: "#cbd5e1", fontSize: 12, paddingTop: '10px' }}
                iconType="line"
              />
              {threshold != null && (
                <ReferenceLine
                  y={threshold}
                  stroke="#fbbf24"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ 
                    value: `Threshold = ${threshold}`, 
                    position: "right", 
                    fill: "#fcd34d", 
                    fontSize: 11,
                    fontWeight: 600
                  }}
                />
              )}
              {xUnsafeStart != null && (
                <>
                  <ReferenceArea
                    x1={xUnsafeStart}
                    x2={maxX}
                    stroke="none"
                    fill={unsafeColor}
                  />
                  <ReferenceLine
                    x={xUnsafeStart}
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </>
              )}
              <Line
                type="monotone"
                dataKey="rPrime"
                stroke={rPrimeColor}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, fill: rPrimeColor, strokeWidth: 2, stroke: '#1e293b' }}
                name="R'(x)"
                fill="url(#rPrimeGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
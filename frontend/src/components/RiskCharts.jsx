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
  // Combine data for charts (keep x numeric for ReferenceArea)
  const chartData = xValues.map((x, idx) => ({
    x: Number(x.toFixed(2)),
    r: Number(rValues[idx]?.toFixed(2) || 0),
    rPrime: Number(rPrimeValues[idx]?.toFixed(2) || 0),
  }));

  const maxX = Math.max(...xValues);
  const minX = Math.min(...xValues);

  // Custom tooltip with dark theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 border border-white/20 rounded-lg p-3 shadow-xl backdrop-blur-sm">
          <p className="text-white font-semibold mb-2">x = {label}</p>
          {payload.map((entry, idx) => (
            <p
              key={idx}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Dark theme colors
  const rColor = "#60a5fa"; // blue-400
  const rPrimeColor = "#f472b6"; // pink-400
  const unsafeColor = "rgba(239, 68, 68, 0.15)"; // red-500 with opacity

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg space-y-6">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Risk Growth Visualization</h3>
      
      {/* R(x) Chart - Risk Function */}
      <div>
        <h4 className="text-xs font-medium text-gray-400 mb-3">R(x) - Risk Function</h4>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="x"
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              tickFormatter={(value) => value.toFixed(1)}
              label={{ value: "Attack Surface Score (x)", position: "insideBottom", offset: -5, fill: "#d1d5db", fontSize: 12 }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              label={{ value: "Risk R(x)", angle: -90, position: "insideLeft", fill: "#d1d5db", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: "#d1d5db", fontSize: 12 }}
              iconType="line"
            />
            {xUnsafeStart != null && (
              <>
                <ReferenceArea
                  x1={xUnsafeStart}
                  x2={maxX}
                  stroke="none"
                  fill={unsafeColor}
                  label={{ value: "Unsafe Zone", position: "top", fill: "#ef4444", fontSize: 11 }}
                />
                <ReferenceLine
                  x={xUnsafeStart}
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: `Unsafe at x=${xUnsafeStart.toFixed(1)}`, position: "top", fill: "#ef4444", fontSize: 11 }}
                />
              </>
            )}
            <Line
              type="monotone"
              dataKey="r"
              stroke={rColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: rColor }}
              name="R(x)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* R'(x) Chart - Rate of Change */}
      <div>
        <h4 className="text-xs font-medium text-gray-400 mb-3">R'(x) - Rate of Risk Growth</h4>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="x"
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              tickFormatter={(value) => value.toFixed(1)}
              label={{ value: "Attack Surface Score (x)", position: "insideBottom", offset: -5, fill: "#d1d5db", fontSize: 12 }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              label={{ value: "R'(x)", angle: -90, position: "insideLeft", fill: "#d1d5db", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: "#d1d5db", fontSize: 12 }}
              iconType="line"
            />
            {threshold != null && (
              <ReferenceLine
                y={threshold}
                stroke="#fbbf24"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{ value: `Threshold = ${threshold}`, position: "right", fill: "#fbbf24", fontSize: 11 }}
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
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: rPrimeColor }}
              name="R'(x)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ScoreCard({ score, xUnsafeStart }) {
  const getSeverity = (score) => {
    if (score < 25) return { label: "Low", color: "bg-green-500/20 text-green-400 border-green-500/30" };
    if (score < 50) return { label: "Medium", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
    if (score < 75) return { label: "High", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" };
    return { label: "Critical", color: "bg-red-500/20 text-red-400 border-red-500/30" };
  };

  const severity = getSeverity(score);

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-5xl font-extrabold bg-gradient-to-br from-blue-300 to-purple-300 bg-clip-text text-transparent">
            {score.toFixed(1)}
          </div>
          <div>
            <div className="font-semibold text-white">Attack Surface Score</div>
            <div className="text-xs text-gray-400 mt-1">Range: 0–100</div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${severity.color}`}>
          {severity.label}
        </span>
      </div>
      {xUnsafeStart != null && (
        <div className="text-sm text-gray-400 mt-3 pt-3 border-t border-white/5">
          Unsafe growth starts at x ≈ <span className="text-white font-semibold">{xUnsafeStart.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
}

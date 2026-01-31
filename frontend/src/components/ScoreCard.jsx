export default function ScoreCard({ score, xUnsafeStart }) {
  const getSeverity = (score) => {
    if (score < 25) return { 
      label: "Low", 
      color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      glow: "shadow-emerald-500/20"
    };
    if (score < 50) return { 
      label: "Medium", 
      color: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
      glow: "shadow-yellow-500/20"
    };
    if (score < 75) return { 
      label: "High", 
      color: "bg-orange-500/15 text-orange-300 border-orange-500/30",
      glow: "shadow-orange-500/20"
    };
    return { 
      label: "Critical", 
      color: "bg-red-500/15 text-red-300 border-red-500/30",
      glow: "shadow-red-500/20"
    };
  };

  const severity = getSeverity(score);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 blur-2xl opacity-30 animate-pulse" style={{ animationDuration: '3s' }}></div>
              <div className="relative text-6xl font-black bg-gradient-to-br from-cyan-300 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {score.toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-white mb-1">Attack Surface Score</div>
              <div className="text-sm text-gray-400">Range: 0–100</div>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${severity.color} ${severity.glow} shadow-lg transition-all duration-300`}>
            {severity.label}
          </span>
        </div>
        
        {xUnsafeStart != null && (
          <div className="pt-4 border-t border-slate-700/30">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Unsafe growth starts at x ≈ <span className="text-white font-semibold ml-1">{xUnsafeStart.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
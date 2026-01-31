export default function Recommendations({ recommendations }) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></span>
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">Recommendations</h3>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400 py-3 px-4 bg-slate-800/30 rounded-lg">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No major issues detected.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></span>
        <h3 className="text-lg font-bold text-white uppercase tracking-wide">Recommendations</h3>
      </div>
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div 
            key={idx} 
            className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/20 border border-cyan-500/10 hover:border-cyan-500/20 transition-all duration-200 group"
          >
            <svg className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
              {rec}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
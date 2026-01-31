import ScoreCard from "./ScoreCard";
import DriversList from "./DriversList";
import Recommendations from "./Recommendations";
import RiskCharts from "./RiskCharts";

export default function ResultsPanel({ result }) {
  if (!result) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></span>
          Results
        </h2>
        <div className="py-12 px-6 rounded-xl border-2 border-dashed border-slate-700/50 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
            Run an assessment to see score, drivers, and recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></span>
          Results
        </h2>
        <div className="space-y-6">
          <ScoreCard score={result.x_score} xUnsafeStart={result.x_unsafe_start} />
          <RiskCharts
            xValues={result.x_values}
            rValues={result.r_values}
            rPrimeValues={result.r_prime_values}
            xUnsafeStart={result.x_unsafe_start}
            threshold={result.threshold}
          />
          <DriversList drivers={result.drivers} />
          <Recommendations recommendations={result.recommendations} />
        </div>
      </div>
    </div>
  );
}
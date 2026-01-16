import ScoreCard from "./ScoreCard";
import DriversList from "./DriversList";
import Recommendations from "./Recommendations";
import RiskCharts from "./RiskCharts";

export default function ResultsPanel({ result }) {
  if (!result) {
    return (
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-6">Results</h2>
        <div className="py-8 px-4 rounded-xl border border-dashed border-white/20 text-center text-gray-400">
          Run an assessment to see score, drivers, and recommendations.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-white mb-6">Results</h2>
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
  );
}

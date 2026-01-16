export default function Recommendations({ recommendations }) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Recommendations</h3>
        <div className="text-sm text-gray-400 py-2">No major issues detected.</div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg">
      <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Recommendations</h3>
      <ul className="space-y-2.5">
        {recommendations.map((rec, idx) => (
          <li key={idx} className="text-sm text-gray-300 pl-4 border-l-2 border-blue-500/30">
            {rec}
          </li>
        ))}
      </ul>
    </div>
  );
}

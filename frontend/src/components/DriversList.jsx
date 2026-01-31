export default function DriversList({ drivers }) {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></span>
        <h3 className="text-lg font-bold text-white uppercase tracking-wide">Top Drivers</h3>
      </div>
      <div className="space-y-1">
        {drivers.slice(0, 8).map((driver, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-slate-800/30 transition-colors duration-200 group"
          >
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{driver.factor}</span>
            <span className={`text-sm font-bold tabular-nums ${
              driver.points >= 0 
                ? 'text-emerald-400 group-hover:text-emerald-300' 
                : 'text-red-400 group-hover:text-red-300'
            } transition-colors`}>
              {driver.points >= 0 ? '+' : ''}{driver.points.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function DriversList({ drivers }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg">
      <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Top Drivers</h3>
      <ul className="space-y-2">
        {drivers.slice(0, 8).map((driver, idx) => (
          <li key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <span className="text-sm text-gray-300">{driver.factor}</span>
            <span className={`text-sm font-semibold ${driver.points >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {driver.points >= 0 ? '+' : ''}{driver.points.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

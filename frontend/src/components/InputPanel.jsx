function Field({ label, name, type = "number", value, onChange, step }) {
  return (
    <label className="block group">
      <div className="text-xs font-medium text-gray-400 mb-2 transition-colors group-focus-within:text-cyan-400">{label}</div>
      <input
        className="w-full px-4 py-2.5 rounded-xl border border-slate-700/50 bg-slate-900/50 text-white placeholder-gray-500 outline-none focus:border-cyan-500/50 focus:bg-slate-900/70 transition-all duration-200 backdrop-blur-sm"
        name={name}
        type={type}
        value={value}
        step={step}
        onChange={onChange}
      />
    </label>
  );
}

export default function InputPanel({ form, onChange, onSubmit, onReset, loading, error }) {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/20">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></span>
        Inputs
      </h2>

      <div className="space-y-6">
        <label className="block group">
          <div className="text-xs font-medium text-gray-400 mb-2 transition-colors group-focus-within:text-cyan-400">Assessment name</div>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700/50 bg-slate-900/50 text-white placeholder-gray-500 outline-none focus:border-cyan-500/50 focus:bg-slate-900/70 transition-all duration-200 backdrop-blur-sm"
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Public endpoints" name="public_endpoints" value={form.public_endpoints} onChange={onChange} />
          <Field label="Admin endpoints" name="admin_endpoints" value={form.admin_endpoints} onChange={onChange} />
          <Field label="3rd-party integrations" name="third_party_integrations" value={form.third_party_integrations} onChange={onChange} />
          <Field label="Monthly active users" name="monthly_active_users" value={form.monthly_active_users} onChange={onChange} />
          <Field label="Privileged accounts" name="privileged_accounts" value={form.privileged_accounts} onChange={onChange} />
          <Field label="MFA adoption (%)" name="mfa_adoption_pct" value={form.mfa_adoption_pct} onChange={onChange} step="0.1" />
          <Field label="Failed login rate (%)" name="failed_login_rate_pct" value={form.failed_login_rate_pct} onChange={onChange} step="0.1" />
          <Field label="Monthly requests" name="monthly_requests" value={form.monthly_requests} onChange={onChange} />
          <Field label="Unique countries" name="unique_countries" value={form.unique_countries} onChange={onChange} />
          <Field label="Traffic concentration (%)" name="traffic_concentration_pct" value={form.traffic_concentration_pct} onChange={onChange} step="0.1" />
          <Field label="Open critical vulns" name="open_critical_vulns" value={form.open_critical_vulns} onChange={onChange} />
          <Field label="Mean patch time (days)" name="mean_patch_time_days" value={form.mean_patch_time_days} onChange={onChange} />
        </div>

        <div className="flex gap-5 flex-wrap pt-2">
          <label className="text-gray-300 text-sm flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              name="waf_enabled"
              checked={form.waf_enabled}
              onChange={onChange}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-cyan-500 focus:ring-2 focus:ring-cyan-500/50 cursor-pointer transition-all"
            />
            <span className="group-hover:text-white transition-colors">WAF enabled</span>
          </label>
          <label className="text-gray-300 text-sm flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              name="rate_limiting_enabled"
              checked={form.rate_limiting_enabled}
              onChange={onChange}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-cyan-500 focus:ring-2 focus:ring-cyan-500/50 cursor-pointer transition-all"
            />
            <span className="group-hover:text-white transition-colors">Rate limiting enabled</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            className="flex-1 px-5 py-3 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-white font-semibold hover:from-cyan-500/30 hover:to-purple-500/30 hover:border-cyan-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running...
              </span>
            ) : (
              "Run assessment"
            )}
          </button>
          <button
            className="px-5 py-3 rounded-xl border border-slate-700/50 bg-slate-900/50 text-gray-300 font-semibold hover:bg-slate-800/50 hover:text-white hover:border-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onReset}
            disabled={loading}
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2">
          Backend must be running on <code className="text-cyan-400 bg-slate-900/70 px-2 py-1 rounded border border-slate-700/30">localhost:8000</code>
        </div>
      </div>
    </div>
  );
}


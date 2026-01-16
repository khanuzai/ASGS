function Field({ label, name, type = "number", value, onChange, step }) {
  return (
    <label className="block">
      <div className="text-xs text-gray-400 mb-1.5">{label}</div>
      <input
        className="w-full px-3 py-2 rounded-lg border border-white/12 bg-black/35 text-white outline-none focus:border-white/28 transition-colors"
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
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-white mb-6">Inputs</h2>

      <label className="block mb-4">
        <div className="text-xs text-gray-400 mb-1.5">Assessment name</div>
        <input
          className="w-full px-3 py-2 rounded-lg border border-white/12 bg-black/35 text-white outline-none focus:border-white/28 transition-colors"
          name="name"
          type="text"
          value={form.name}
          onChange={onChange}
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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

      <div className="flex gap-4 mb-4 flex-wrap">
        <label className="text-gray-300 text-sm flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="waf_enabled"
            checked={form.waf_enabled}
            onChange={onChange}
            className="w-4 h-4 rounded border-white/12 bg-black/35 text-blue-500 focus:ring-2 focus:ring-blue-500/50"
          />
          WAF enabled
        </label>
        <label className="text-gray-300 text-sm flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="rate_limiting_enabled"
            checked={form.rate_limiting_enabled}
            onChange={onChange}
            className="w-4 h-4 rounded border-white/12 bg-black/35 text-blue-500 focus:ring-2 focus:ring-blue-500/50"
          />
          Rate limiting enabled
        </label>
      </div>

      <div className="flex gap-3">
        <button
          className="flex-1 px-4 py-2.5 rounded-xl border border-white/14 bg-white/10 text-white font-semibold hover:bg-white/14 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Running..." : "Run assessment"}
        </button>
        <button
          className="px-4 py-2.5 rounded-xl border border-white/14 bg-transparent text-white font-semibold hover:bg-white/5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={onReset}
          disabled={loading}
        >
          Reset
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl border border-red-500/35 bg-red-500/10 text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        Backend must be running on <code className="text-gray-400 bg-black/30 px-1.5 py-0.5 rounded">localhost:8000</code>.
      </div>
    </div>
  );
}

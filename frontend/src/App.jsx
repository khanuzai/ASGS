import { useMemo, useState } from "react";
import { createAssessment } from "./services/api";
import InputPanel from "./components/InputPanel";
import ResultsPanel from "./components/ResultsPanel";

const DEFAULTS = {
  name: "Demo SaaS",
  public_endpoints: 120,
  admin_endpoints: 6,
  third_party_integrations: 12,
  monthly_active_users: 80000,
  privileged_accounts: 40,
  mfa_adoption_pct: 55,
  failed_login_rate_pct: 2.5,
  monthly_requests: 12000000,
  unique_countries: 18,
  traffic_concentration_pct: 65,
  open_critical_vulns: 1,
  mean_patch_time_days: 21,
  waf_enabled: false,
  rate_limiting_enabled: true,
};

export default function App() {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    // booleans
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
      return;
    }

    // name field string
    if (name === "name") {
      setForm((f) => ({ ...f, [name]: value }));
      return;
    }

    // numeric fields
    const asNum = value === "" ? "" : Number(value);
    setForm((f) => ({ ...f, [name]: asNum }));
  };

  const payload = useMemo(() => {
    // ensure numbers are numbers (no empty strings)
    const p = { ...form };
    for (const k of Object.keys(p)) {
      if (typeof p[k] === "number" && Number.isNaN(p[k])) p[k] = 0;
      if (p[k] === "") p[k] = 0;
    }
    return p;
  }, [form]);

  const submit = async () => {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = await createAssessment(payload);
      setResult(data);
    } catch (err) {
      setError(err?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(DEFAULTS);
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Attack Surface Growth Simulator</h1>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
              Enter system metrics → get an explainable score, drivers, and recommendations.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-white/8 border border-white/12 font-bold text-sm shrink-0">
            ASGS
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <InputPanel
              form={form}
              onChange={onChange}
              onSubmit={submit}
              onReset={reset}
              loading={loading}
              error={error}
            />
          </div>
          <div>
            <ResultsPanel result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}

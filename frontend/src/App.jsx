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

    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
      return;
    }

    if (name === "name") {
      setForm((f) => ({ ...f, [name]: value }));
      return;
    }

    const asNum = value === "" ? "" : Number(value);
    setForm((f) => ({ ...f, [name]: asNum }));
  };

  const payload = useMemo(() => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100 flex flex-col">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <header className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Attack Surface Growth Simulator
            </h1>
            <p className="text-base text-gray-400 max-w-2xl leading-relaxed">
              Enter system metrics → get an explainable score, drivers, and recommendations.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 font-bold text-sm tracking-wider text-cyan-300 shrink-0 shadow-lg shadow-cyan-500/10">
            ASGS
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
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

      {/* Footer */}
      <footer className="relative mt-16 py-6 border-t border-slate-800/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm">
            Made by{" "}
            <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-semibold">
              Abdullah Khan
            </span>
            {" "}in 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
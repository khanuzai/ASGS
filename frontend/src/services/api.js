const API_BASE = "http://localhost:8000";

export async function createAssessment(payload) {
  const res = await fetch(`${API_BASE}/assessments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.detail ? JSON.stringify(data.detail) : JSON.stringify(data);
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return res.json();
}

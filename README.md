# 🛡️ Attack Surface Growth Simulator (ASGS)

ASGS is a full-stack cybersecurity risk modeling platform that quantifies how a system’s **attack surface expands as complexity scales**.

Rather than scanning live infrastructure, ASGS models structural risk using normalized system metrics and mathematically derives how security exposure accelerates as organizations grow.

It is designed to answer:

> **At what point does growth begin to create disproportionate security risk?**

---

## 🚀 Live Demo

*(Add deployed URL here once deployed)*

---

## 🎯 Problem

As companies scale:
- More endpoints are exposed
- User bases grow
- Privileged accounts increase
- Integrations multiply
- Patch velocity slows
- Traffic patterns diversify

Security risk does **not** grow linearly.

ASGS models this nonlinear growth and identifies:
- Inflection points  
- Unsafe growth regions  
- Primary risk drivers  
- Control effectiveness  

---

## 🧠 Core Concepts

### 1️⃣ Attack Surface Score (0–100)

Weighted composite score across five security dimensions:

- **Exposure**
- **Identity**
- **Traffic**
- **Vulnerabilities**
- **Controls**

All raw inputs are normalized and clamped into comparable ranges before aggregation.

---

### 2️⃣ Nonlinear Risk Growth Modeling

ASGS computes a quadratic risk function:

R(x) = ax² + bx + c

And its derivative:

R′(x)

This enables detection of:

- Risk acceleration zones  
- Unsafe growth thresholds  
- Points where marginal risk exceeds safe limits  

---

### 3️⃣ Explainable Driver Breakdown

Each factor contributes weighted points to the total risk score.

Drivers are:
- Ranked by magnitude  
- Labeled as increasing or decreasing risk  
- Fully transparent  

This ensures the model remains explainable — not a black box.

---

## 🏗 Architecture

### Backend
- **Python**
- **FastAPI**
- **Pydantic validation**
- **SQLAlchemy ORM**
- **SQLite (development)**
- Custom weighted scoring engine

### Frontend
- **React**
- **Vite**
- **TailwindCSS**
- **Recharts**
- Real-time visualization of:
  - Risk curve `R(x)`
  - Risk derivative `R′(x)`
  - Threshold indicators
  - Ranked driver breakdown

---

## 📊 Features

- Attack surface scoring engine (0–100 scale)
- Weighted risk decomposition across 5 categories
- Derivative-based unsafe growth detection
- Ranked driver contribution analysis
- Actionable security recommendations
- Interactive parameter tuning
- Real-time chart updates
- Local persistence via SQLite
- Swagger API documentation

---

## 🔐 Inputs Modeled

- Public endpoints  
- Admin endpoints  
- Third-party integrations  
- Monthly active users  
- Privileged accounts  
- MFA adoption rate  
- Failed login rate  
- Monthly requests  
- Geographic distribution  
- Open critical vulnerabilities  
- Mean patch time  
- Security controls (WAF, rate limiting)  

---

## 📈 Example Insight

A moderate score (e.g., 32.4) may appear safe.

However, derivative analysis can reveal:

> Unsafe growth begins at x ≈ 73.3

Meaning scaling beyond that threshold creates disproportionate security acceleration.

ASGS shifts security thinking from reactive patching to proactive growth governance.

---

## 🧪 API Documentation

Interactive Swagger docs available at:

/docs

Core endpoints:

- `POST /assessments`
- `POST /simulate`
- `GET /health`

---

## 🛠 Local Development

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
--- 

Frontend:

cd frontend
npm install
npm run dev

--- 

🔐 Security Note

ASGS is a structural risk modeling tool.
It does not perform vulnerability scanning or real-time intrusion detection.

Scores are analytical indicators intended for architectural reasoning and educational use.

--- 

👤 Author

Built by a waterloo CS student :)))




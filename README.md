# Attack Surface Growth Simulator (ASGS)

ASGS is a cybersecurity risk modeling project that analyzes how a system’s
attack surface grows as complexity increases.

Instead of scanning live systems, ASGS uses a mathematical and heuristic
model to reason about risk growth based on system characteristics such as:
- exposed endpoints
- user scale
- authentication posture
- traffic patterns
- vulnerability management
- security controls

The goal is to identify **unsafe growth regions** where adding users,
features, or integrations causes disproportionate increases in security risk.

---

## Current Status (Backend Complete)

- FastAPI backend
- Attack surface scoring engine (0–100 scale)
- Risk category decomposition (exposure, identity, traffic, vulnerabilities, controls)
- Driver-level breakdown explaining what increases or reduces risk
- Actionable security recommendations
- SQLite (local) for development
- No external APIs or secrets

API documentation available via Swagger:



---

## Architecture

- **Backend:** Python, FastAPI, SQLAlchemy
- **Scoring Engine:** Normalized metrics + weighted risk model
- **Storage:** SQLite (local, non-production)
- **Frontend:** *In progress*

---

## Planned Features

- Interactive React frontend
- Risk visualization and charts
- Growth simulation over time
- Unsafe growth zone detection
- Model tuning and scenario comparison

---

## Disclaimer

ASGS is a **risk modeling and reasoning tool**, not a vulnerability scanner.
Scores are indicative and intended for educational and analytical use.

---

## Author

Built by a CS student focused on cybersecurity, risk modeling, and systems design.

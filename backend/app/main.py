from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import json
import numpy as np

# Local imports - adjust based on your actual structure
try:
    from .db import init_db, get_db
    from .models import Assessment
    from .schemas import AssessmentCreate, AssessmentOut
except ImportError:
    from db import init_db, get_db
    from models import Assessment
    from schemas import AssessmentCreate, AssessmentOut

app = FastAPI(
    title="Attack Surface Growth Simulator API",
    description="API for modeling cybersecurity risk growth as system complexity increases",
    version="1.0.0"
)

# CORS configuration - IMPORTANT: Update this with your actual frontend URL after deploying
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.vercel.app",  # If deploying frontend to Vercel
        "https://*.netlify.app",  # If deploying frontend to Netlify
        "*"  # Remove this in production and specify exact domains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Attack Surface Growth Simulator API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}


def calculate_attack_surface_score(inputs: AssessmentCreate) -> float:
    """Calculate attack surface score from inputs."""
    # Normalize and weight different categories
    endpoint_score = (inputs.public_endpoints * 0.3 + inputs.admin_endpoints * 0.7) / 20
    integration_score = inputs.third_party_integrations * 0.8
    user_score = (inputs.monthly_active_users / 10000) * 0.3
    
    # Security posture (inverse)
    mfa_penalty = (100 - inputs.mfa_adoption_pct) * 0.4
    failed_login_penalty = inputs.failed_login_rate_pct * 2.0
    
    # Traffic & scale
    traffic_score = (inputs.monthly_requests / 100000) * 0.2
    geo_score = inputs.unique_countries * 0.5
    concentration_penalty = inputs.traffic_concentration_pct * 0.15
    
    # Vulnerability management
    vuln_score = inputs.open_critical_vulns * 3.0
    patch_penalty = inputs.mean_patch_time_days * 0.3
    
    # Security controls (reduction)
    control_reduction = 0
    if inputs.waf_enabled:
        control_reduction += 5
    if inputs.rate_limiting_enabled:
        control_reduction += 3
    
    total = (
        endpoint_score + integration_score + user_score +
        mfa_penalty + failed_login_penalty +
        traffic_score + geo_score + concentration_penalty +
        vuln_score + patch_penalty - control_reduction
    )
    
    # Clamp to 0-100
    return max(0, min(100, total))


def calculate_drivers(inputs: AssessmentCreate, x_score: float) -> List[dict]:
    """Calculate top drivers of the attack surface score."""
    drivers = []
    
    # Calculate contributions
    endpoint_contrib = (inputs.public_endpoints * 0.3 + inputs.admin_endpoints * 0.7) / 20
    drivers.append({"factor": "API endpoints", "points": endpoint_contrib})
    
    integration_contrib = inputs.third_party_integrations * 0.8
    drivers.append({"factor": "3rd-party integrations", "points": integration_contrib})
    
    mfa_contrib = -(100 - inputs.mfa_adoption_pct) * 0.4
    drivers.append({"factor": "MFA adoption", "points": mfa_contrib})
    
    vuln_contrib = inputs.open_critical_vulns * 3.0
    drivers.append({"factor": "Critical vulnerabilities", "points": vuln_contrib})
    
    patch_contrib = inputs.mean_patch_time_days * 0.3
    drivers.append({"factor": "Patch time", "points": patch_contrib})
    
    failed_login_contrib = inputs.failed_login_rate_pct * 2.0
    drivers.append({"factor": "Failed login rate", "points": failed_login_contrib})
    
    if inputs.waf_enabled:
        drivers.append({"factor": "WAF enabled", "points": -5.0})
    
    if inputs.rate_limiting_enabled:
        drivers.append({"factor": "Rate limiting", "points": -3.0})
    
    # Sort by absolute impact
    drivers.sort(key=lambda d: abs(d["points"]), reverse=True)
    return drivers


def generate_recommendations(inputs: AssessmentCreate, x_score: float) -> List[str]:
    """Generate security recommendations based on inputs."""
    recs = []
    
    if inputs.mfa_adoption_pct < 70:
        recs.append(f"Increase MFA adoption from {inputs.mfa_adoption_pct}% to at least 90% to significantly reduce account takeover risk.")
    
    if inputs.open_critical_vulns > 0:
        recs.append(f"Address {inputs.open_critical_vulns} critical vulnerabilities immediately to prevent exploitation.")
    
    if inputs.mean_patch_time_days > 14:
        recs.append(f"Reduce mean patch time from {inputs.mean_patch_time_days} days to under 14 days to minimize exposure windows.")
    
    if not inputs.waf_enabled:
        recs.append("Deploy a Web Application Firewall (WAF) to protect against common attack vectors.")
    
    if not inputs.rate_limiting_enabled:
        recs.append("Implement rate limiting to prevent brute force attacks and API abuse.")
    
    if inputs.failed_login_rate_pct > 1.5:
        recs.append(f"Investigate high failed login rate ({inputs.failed_login_rate_pct}%) - possible credential stuffing attacks.")
    
    if inputs.admin_endpoints > inputs.public_endpoints * 0.1:
        recs.append("Review and minimize admin endpoint exposure - consider isolating on separate subdomain with stricter access controls.")
    
    return recs


def compute_risk_function(x_score: float):
    """Compute risk function R(x) = a*x^2 + b*x + c and derivatives."""
    # Quadratic risk model coefficients
    a = 0.012
    b = 0.5
    c = 2.0
    threshold = 2.9
    
    # Generate x values
    x_min = max(0, x_score - 30)
    x_max = min(100, x_score + 30)
    x_values = np.linspace(x_min, x_max, 100)
    
    # Calculate R(x) and derivatives
    r_values = a * x_values**2 + b * x_values + c
    r_prime_values = 2 * a * x_values + b
    r_double_prime_values = np.full_like(x_values, 2 * a)
    
    # Find where unsafe growth starts (R'(x) > threshold)
    x_unsafe_start = None
    for i, (x, rp) in enumerate(zip(x_values, r_prime_values)):
        if rp > threshold:
            x_unsafe_start = float(x)
            break
    
    return {
        "expression_r": f"{a}*x^2 + {b}*x + {c}",
        "expression_r_prime": f"{2*a}*x + {b}",
        "expression_r_double_prime": f"{2*a}",
        "x_values": x_values.tolist(),
        "r_values": r_values.tolist(),
        "r_prime_values": r_prime_values.tolist(),
        "r_double_prime_values": r_double_prime_values.tolist(),
        "threshold": threshold,
        "x_unsafe_start": x_unsafe_start
    }


@app.post("/assessments", response_model=AssessmentOut, status_code=201)
def create_assessment(inputs: AssessmentCreate, db: Session = Depends(get_db)):
    """Create a new attack surface assessment."""
    
    # Calculate score
    x_score = calculate_attack_surface_score(inputs)
    
    # Calculate drivers
    drivers = calculate_drivers(inputs, x_score)
    
    # Generate recommendations
    recommendations = generate_recommendations(inputs, x_score)
    
    # Compute risk function
    risk_data = compute_risk_function(x_score)
    
    # Save to database
    assessment = Assessment(
        name=inputs.name,
        inputs_json=inputs.model_dump_json(),
        x_score=x_score,
        drivers_json=json.dumps(drivers),
        recommendations_json=json.dumps(recommendations)
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    
    # Return full response
    return AssessmentOut(
        id=assessment.id,
        name=assessment.name,
        created_at=assessment.created_at,
        x_score=x_score,
        drivers=drivers,
        recommendations=recommendations,
        **risk_data
    )


@app.get("/assessments", response_model=List[AssessmentOut])
def list_assessments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all assessments."""
    assessments = db.query(Assessment).offset(skip).limit(limit).all()
    
    results = []
    for assessment in assessments:
        drivers = json.loads(assessment.drivers_json)
        recommendations = json.loads(assessment.recommendations_json)
        risk_data = compute_risk_function(assessment.x_score)
        
        results.append(AssessmentOut(
            id=assessment.id,
            name=assessment.name,
            created_at=assessment.created_at,
            x_score=assessment.x_score,
            drivers=drivers,
            recommendations=recommendations,
            **risk_data
        ))
    
    return results


@app.get("/assessments/{assessment_id}", response_model=AssessmentOut)
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    """Get a specific assessment by ID."""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    drivers = json.loads(assessment.drivers_json)
    recommendations = json.loads(assessment.recommendations_json)
    risk_data = compute_risk_function(assessment.x_score)
    
    return AssessmentOut(
        id=assessment.id,
        name=assessment.name,
        created_at=assessment.created_at,
        x_score=assessment.x_score,
        drivers=drivers,
        recommendations=recommendations,
        **risk_data
    )


@app.delete("/assessments/{assessment_id}")
def delete_assessment(assessment_id: int, db: Session = Depends(get_db)):
    """Delete an assessment."""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    db.delete(assessment)
    db.commit()
    return {"message": "Assessment deleted successfully"}

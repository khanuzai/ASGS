import json
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models import Assessment
from ..schemas import AssessmentCreate, AssessmentOut
from ..services.scoring_engine import (
    normalize_inputs,
    compute_category_scores,
    compute_attack_surface_score,
    compute_driver_breakdown,
    generate_recommendations,
)
from ..services.math_engine import build_expressions, evaluate_range, compute_unsafe_start

router = APIRouter(prefix="/assessments", tags=["assessments"])

# Default risk coefficients
DEFAULT_A = 0.015
DEFAULT_B = 0.8
DEFAULT_C = 5.0
DEFAULT_THRESHOLD = 3.0

# Fixed simulation range
X_MIN = 0.0
X_MAX = 100.0
POINTS = 200


@router.post("", response_model=AssessmentOut, status_code=status.HTTP_201_CREATED)
def create_assessment(assessment_data: AssessmentCreate, db: Session = Depends(get_db)):
    """Create a new attack surface assessment."""
    # Convert Pydantic model to dict for scoring engine
    payload = assessment_data.model_dump()
    
    # Normalize inputs
    norm = normalize_inputs(payload)
    
    # Compute category scores
    category_scores = compute_category_scores(norm)
    
    # Compute attack surface score
    x_score = compute_attack_surface_score(category_scores)
    
    # Compute driver breakdown
    drivers = compute_driver_breakdown(category_scores, norm)
    drivers_list = [dict(driver) for driver in drivers]
    
    # Generate recommendations
    recommendations = generate_recommendations(payload, norm)
    
    # Build expressions using default risk coefficients
    expr_r, expr_r_prime, expr_r_double_prime = build_expressions(
        DEFAULT_A, DEFAULT_B, DEFAULT_C
    )
    
    # Evaluate range
    x_values, r_values, r_prime_values, r_double_prime_values = evaluate_range(
        X_MIN, X_MAX, POINTS, DEFAULT_A, DEFAULT_B, DEFAULT_C
    )
    
    # Compute unsafe zone start
    x_unsafe_start = compute_unsafe_start(
        X_MIN, X_MAX, DEFAULT_A, DEFAULT_B, DEFAULT_THRESHOLD
    )
    
    # Create assessment record
    db_assessment = Assessment(
        name=assessment_data.name,
        inputs_json=json.dumps(payload),
        x_score=x_score,
        drivers_json=json.dumps(drivers_list),
        recommendations_json=json.dumps(recommendations),
    )
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    
    # Build response
    return AssessmentOut(
        id=db_assessment.id,
        name=db_assessment.name,
        created_at=db_assessment.created_at,
        x_score=db_assessment.x_score,
        drivers=drivers_list,
        recommendations=recommendations,
        threshold=DEFAULT_THRESHOLD,
        x_unsafe_start=x_unsafe_start,
        expression_r=expr_r,
        expression_r_prime=expr_r_prime,
        expression_r_double_prime=expr_r_double_prime,
        x_values=x_values.tolist(),
        r_values=r_values.tolist(),
        r_prime_values=r_prime_values.tolist(),
        r_double_prime_values=r_double_prime_values.tolist(),
    )


@router.get("", response_model=List[dict])
def list_assessments(db: Session = Depends(get_db)):
    """List the most recent 20 assessments (metadata only)."""
    assessments = (
        db.query(Assessment)
        .order_by(Assessment.created_at.desc())
        .limit(20)
        .all()
    )
    
    result = []
    for assessment in assessments:
        # Parse JSON fields
        drivers = json.loads(assessment.drivers_json)
        recommendations = json.loads(assessment.recommendations_json)
        
        result.append({
            "id": assessment.id,
            "name": assessment.name,
            "created_at": assessment.created_at,
            "x_score": assessment.x_score,
            "drivers": drivers,
            "recommendations": recommendations,
        })
    
    return result

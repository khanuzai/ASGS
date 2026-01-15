from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import RiskModel, Simulation
from ..schemas import SimulationRequest, SimulationResponse
from ..services.math_engine import build_expressions, evaluate_range, compute_unsafe_start

router = APIRouter(prefix="/simulate", tags=["simulate"])


@router.post("", response_model=SimulationResponse, status_code=status.HTTP_201_CREATED)
def create_simulation(sim_data: SimulationRequest, db: Session = Depends(get_db)):
    """Create a simulation run for a risk model."""
    # Verify risk model exists
    risk_model = db.query(RiskModel).filter(RiskModel.id == sim_data.risk_model_id).first()
    if not risk_model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Risk model with ID {sim_data.risk_model_id} not found"
        )
    
    # Build symbolic expressions
    expr_r, expr_r_prime, expr_r_double_prime = build_expressions(
        risk_model.a, risk_model.b, risk_model.c
    )
    
    # Evaluate over range
    x_values, r_values, r_prime_values, r_double_prime_values = evaluate_range(
        sim_data.x_min,
        sim_data.x_max,
        sim_data.points,
        risk_model.a,
        risk_model.b,
        risk_model.c
    )
    
    # Compute unsafe zone start
    x_unsafe_start = compute_unsafe_start(
        sim_data.x_min,
        sim_data.x_max,
        risk_model.a,
        risk_model.b,
        sim_data.threshold
    )
    
    # Create simulation record
    db_simulation = Simulation(
        risk_model_id=sim_data.risk_model_id,
        x_min=sim_data.x_min,
        x_max=sim_data.x_max,
        points=sim_data.points,
        threshold=sim_data.threshold,
        x_unsafe_start=x_unsafe_start
    )
    db.add(db_simulation)
    db.commit()
    db.refresh(db_simulation)
    
    # Build response
    return SimulationResponse(
        id=db_simulation.id,
        risk_model_id=db_simulation.risk_model_id,
        x_min=db_simulation.x_min,
        x_max=db_simulation.x_max,
        points=db_simulation.points,
        threshold=db_simulation.threshold,
        x_unsafe_start=db_simulation.x_unsafe_start,
        created_at=db_simulation.created_at,
        expression_r=expr_r,
        expression_r_prime=expr_r_prime,
        expression_r_double_prime=expr_r_double_prime,
        x_values=x_values.tolist(),
        r_values=r_values.tolist(),
        r_prime_values=r_prime_values.tolist(),
        r_double_prime_values=r_double_prime_values.tolist()
    )
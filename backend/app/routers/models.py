from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models import RiskModel
from ..schemas import RiskModelCreate, RiskModelUpdate, RiskModelResponse

router = APIRouter(prefix="/models", tags=["models"])


@router.post("", response_model=RiskModelResponse, status_code=status.HTTP_201_CREATED)
def create_model(model_data: RiskModelCreate, db: Session = Depends(get_db)):
    """Create a new risk model."""
    db_model = RiskModel(**model_data.model_dump())
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    return db_model


@router.get("", response_model=List[RiskModelResponse])
def list_models(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all risk models."""
    models = db.query(RiskModel).offset(skip).limit(limit).all()
    return models


@router.get("/{model_id}", response_model=RiskModelResponse)
def get_model(model_id: int, db: Session = Depends(get_db)):
    """Get a specific risk model by ID."""
    model = db.query(RiskModel).filter(RiskModel.id == model_id).first()
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Risk model with ID {model_id} not found"
        )
    return model


@router.put("/{model_id}", response_model=RiskModelResponse)
def update_model(model_id: int, model_data: RiskModelUpdate, db: Session = Depends(get_db)):
    """Update a risk model."""
    model = db.query(RiskModel).filter(RiskModel.id == model_id).first()
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Risk model with ID {model_id} not found"
        )
    
    # Update only provided fields
    update_data = model_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(model, field, value)
    
    db.commit()
    db.refresh(model)
    return model


@router.delete("/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_model(model_id: int, db: Session = Depends(get_db)):
    """Delete a risk model."""
    model = db.query(RiskModel).filter(RiskModel.id == model_id).first()
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Risk model with ID {model_id} not found"
        )
    
    db.delete(model)
    db.commit()
    return None
from sqlalchemy import Column, Integer, Float, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .db import Base


class RiskModel(Base):
    """Risk model: R(x) = a*x^2 + b*x + c"""
    __tablename__ = "risk_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    a = Column(Float, nullable=False)  # Coefficient for x^2
    b = Column(Float, nullable=False)  # Coefficient for x
    c = Column(Float, nullable=False)  # Constant term
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to simulations
    simulations = relationship("Simulation", back_populates="risk_model", cascade="all, delete-orphan")


class Simulation(Base):
    """Simulation run for a risk model"""
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    risk_model_id = Column(Integer, ForeignKey("risk_models.id"), nullable=False)
    x_min = Column(Float, nullable=False)
    x_max = Column(Float, nullable=False)
    points = Column(Integer, nullable=False)  # Number of evaluation points
    threshold = Column(Float, nullable=False)  # Threshold for unsafe zone (R'(x) > threshold)
    x_unsafe_start = Column(Float, nullable=True)  # Computed unsafe zone start (None if no unsafe zone)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to risk model
    risk_model = relationship("RiskModel", back_populates="simulations")


class Assessment(Base):
    """Attack surface assessment result"""
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    inputs_json = Column(Text, nullable=False)
    x_score = Column(Float, nullable=False)
    drivers_json = Column(Text, nullable=False)
    recommendations_json = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
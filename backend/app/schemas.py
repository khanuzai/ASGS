from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime


# Risk Model Schemas
class RiskModelBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    a: float = Field(..., description="Coefficient for x^2")
    b: float = Field(..., description="Coefficient for x")
    c: float = Field(..., description="Constant term")

    @field_validator('a', 'b', 'c')
    @classmethod
    def validate_finite(cls, v: float) -> float:
        if not isinstance(v, (int, float)):
            raise ValueError("Must be a number")
        if not (-1e10 <= v <= 1e10):
            raise ValueError("Value out of reasonable range [-1e10, 1e10]")
        return float(v)


class RiskModelCreate(RiskModelBase):
    pass


class RiskModelUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    a: Optional[float] = Field(None, description="Coefficient for x^2")
    b: Optional[float] = Field(None, description="Coefficient for x")
    c: Optional[float] = Field(None, description="Constant term")

    @field_validator('a', 'b', 'c')
    @classmethod
    def validate_finite(cls, v: Optional[float]) -> Optional[float]:
        if v is not None:
            if not isinstance(v, (int, float)):
                raise ValueError("Must be a number")
            if not (-1e10 <= v <= 1e10):
                raise ValueError("Value out of reasonable range [-1e10, 1e10]")
            return float(v)
        return v


class RiskModelResponse(RiskModelBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Simulation Schemas
class SimulationRequest(BaseModel):
    risk_model_id: int = Field(..., gt=0)
    x_min: float = Field(..., description="Minimum complexity value")
    x_max: float = Field(..., gt=0, description="Maximum complexity value")
    points: int = Field(..., ge=2, le=10000, description="Number of evaluation points")
    threshold: float = Field(..., description="Threshold for unsafe zone (R'(x) > threshold)")

    @field_validator('x_min', 'x_max', 'threshold')
    @classmethod
    def validate_finite(cls, v: float) -> float:
        if not isinstance(v, (int, float)):
            raise ValueError("Must be a number")
        if not (-1e10 <= v <= 1e10):
            raise ValueError("Value out of reasonable range [-1e10, 1e10]")
        return float(v)

    @field_validator('x_max')
    @classmethod
    def validate_x_max(cls, v: float, info) -> float:
        if 'x_min' in info.data and v <= info.data['x_min']:
            raise ValueError("x_max must be greater than x_min")
        return v


class SimulationResponse(BaseModel):
    id: int
    risk_model_id: int
    x_min: float
    x_max: float
    points: int
    threshold: float
    x_unsafe_start: Optional[float]
    created_at: datetime
    
    # Expression strings
    expression_r: str = Field(..., description="Symbolic expression for R(x)")
    expression_r_prime: str = Field(..., description="Symbolic expression for R'(x)")
    expression_r_double_prime: str = Field(..., description="Symbolic expression for R''(x)")
    
    # Evaluation arrays
    x_values: list[float] = Field(..., description="Array of x values")
    r_values: list[float] = Field(..., description="Array of R(x) values")
    r_prime_values: list[float] = Field(..., description="Array of R'(x) values")
    r_double_prime_values: list[float] = Field(..., description="Array of R''(x) values")

    class Config:
        from_attributes = True


# Assessment Schemas
class AssessmentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    public_endpoints: int = Field(..., ge=0, le=5000)
    admin_endpoints: int = Field(..., ge=0, le=200)
    third_party_integrations: int = Field(..., ge=0, le=200)
    monthly_active_users: int = Field(..., ge=0, le=10_000_000)
    privileged_accounts: int = Field(..., ge=0, le=50_000)
    mfa_adoption_pct: float = Field(..., ge=0.0, le=100.0)
    failed_login_rate_pct: float = Field(..., ge=0.0, le=100.0)
    monthly_requests: int = Field(..., ge=0, le=1_000_000_000)
    unique_countries: int = Field(..., ge=0, le=250)
    traffic_concentration_pct: float = Field(..., ge=0.0, le=100.0)
    open_critical_vulns: int = Field(..., ge=0, le=500)
    mean_patch_time_days: int = Field(..., ge=0, le=365)
    waf_enabled: bool
    rate_limiting_enabled: bool


class AssessmentOut(BaseModel):
    id: int
    name: str
    created_at: datetime
    x_score: float
    drivers: list[dict]
    recommendations: list[str]
    threshold: float
    x_unsafe_start: Optional[float]
    expression_r: str = Field(..., description="Symbolic expression for R(x)")
    expression_r_prime: str = Field(..., description="Symbolic expression for R'(x)")
    expression_r_double_prime: str = Field(..., description="Symbolic expression for R''(x)")
    x_values: list[float] = Field(..., description="Array of x values")
    r_values: list[float] = Field(..., description="Array of R(x) values")
    r_prime_values: list[float] = Field(..., description="Array of R'(x) values")
    r_double_prime_values: list[float] = Field(..., description="Array of R''(x) values")

    class Config:
        from_attributes = True
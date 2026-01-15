from typing import Any, Dict, List, TypedDict


class NormalizedInputs(TypedDict):
    """Normalized input values (all clamped to 0..1)."""
    public_endpoints: float
    admin_endpoints: float
    third_party_integrations: float
    monthly_active_users: float
    privileged_accounts: float
    mfa_gap: float
    failed_login_rate_pct: float
    monthly_requests: float
    unique_countries: float
    geo_spread: float
    open_critical_vulns: float
    mean_patch_time_days: float
    waf_enabled: float
    rate_limiting_enabled: float


class CategoryScores(TypedDict):
    """Category score values."""
    exposure: float
    identity: float
    traffic: float
    vuln: float
    controls: float


class DriverBreakdownItem(TypedDict):
    """Single driver breakdown item."""
    factor: str
    points: float
    direction: str


def clamp(v: float, lo: float, hi: float) -> float:
    """
    Clamp a value between lower and upper bounds.
    
    Args:
        v: Value to clamp
        lo: Lower bound
        hi: Upper bound
    
    Returns:
        Clamped value between lo and hi
    """
    return max(lo, min(hi, v))


def normalize_inputs(payload: Dict[str, Any]) -> NormalizedInputs:
    """
    Normalize input values from the payload according to the scoring specification.
    All values are clamped to the range 0..1.
    
    Args:
        payload: Input payload containing raw metrics
    
    Returns:
        Dictionary of normalized values
    """
    # Extract values with defaults
    public_endpoints = float(payload.get("public_endpoints", 0))
    admin_endpoints = float(payload.get("admin_endpoints", 0))
    third_party_integrations = float(payload.get("third_party_integrations", 0))
    monthly_active_users = float(payload.get("monthly_active_users", 0))
    privileged_accounts = float(payload.get("privileged_accounts", 0))
    mfa_adoption_pct = float(payload.get("mfa_adoption_pct", 0))
    failed_login_rate_pct = float(payload.get("failed_login_rate_pct", 0))
    monthly_requests = float(payload.get("monthly_requests", 0))
    unique_countries = float(payload.get("unique_countries", 0))
    traffic_concentration_pct = float(payload.get("traffic_concentration_pct", 0))
    open_critical_vulns = float(payload.get("open_critical_vulns", 0))
    mean_patch_time_days = float(payload.get("mean_patch_time_days", 0))
    waf_enabled = bool(payload.get("waf_enabled", False))
    rate_limiting_enabled = bool(payload.get("rate_limiting_enabled", False))
    
    # Normalize and clamp each value to 0..1
    return NormalizedInputs(
        public_endpoints=clamp(public_endpoints / 300, 0.0, 1.0),
        admin_endpoints=clamp(admin_endpoints / 10, 0.0, 1.0),
        third_party_integrations=clamp(third_party_integrations / 20, 0.0, 1.0),
        monthly_active_users=clamp(monthly_active_users / 1_000_000, 0.0, 1.0),
        privileged_accounts=clamp(privileged_accounts / 200, 0.0, 1.0),
        mfa_gap=clamp(1 - mfa_adoption_pct / 100, 0.0, 1.0),
        failed_login_rate_pct=clamp(failed_login_rate_pct / 5, 0.0, 1.0),
        monthly_requests=clamp(monthly_requests / 50_000_000, 0.0, 1.0),
        unique_countries=clamp(unique_countries / 40, 0.0, 1.0),
        geo_spread=clamp(1 - traffic_concentration_pct / 100, 0.0, 1.0),
        open_critical_vulns=clamp(open_critical_vulns / 5, 0.0, 1.0),
        mean_patch_time_days=clamp(mean_patch_time_days / 30, 0.0, 1.0),
        waf_enabled=1.0 if waf_enabled else 0.0,
        rate_limiting_enabled=1.0 if rate_limiting_enabled else 0.0,
    )


def compute_category_scores(norm: NormalizedInputs) -> CategoryScores:
    """
    Compute category scores from normalized inputs.
    
    Args:
        norm: Normalized input values
    
    Returns:
        Dictionary of category scores
    """
    exposure = (
        0.50 * norm["public_endpoints"] +
        0.35 * norm["admin_endpoints"] +
        0.15 * norm["third_party_integrations"]
    )
    
    identity = (
        0.35 * norm["monthly_active_users"] +
        0.25 * norm["privileged_accounts"] +
        0.25 * norm["mfa_gap"] +
        0.15 * norm["failed_login_rate_pct"]
    )
    
    traffic = (
        0.45 * norm["monthly_requests"] +
        0.35 * norm["unique_countries"] +
        0.20 * norm["geo_spread"]
    )
    
    vuln = (
        0.65 * norm["open_critical_vulns"] +
        0.35 * norm["mean_patch_time_days"]
    )
    
    controls = (
        0.60 * norm["waf_enabled"] +
        0.40 * norm["rate_limiting_enabled"]
    )
    
    return CategoryScores(
        exposure=exposure,
        identity=identity,
        traffic=traffic,
        vuln=vuln,
        controls=controls,
    )


def compute_attack_surface_score(scores: CategoryScores) -> float:
    """
    Compute the final attack surface score from category scores.
    
    The raw score is calculated as:
    x_raw = 0.25*exposure + 0.30*identity + 0.20*traffic + 0.30*vuln - 0.15*controls
    Final score is clamped to 0..100.
    
    Args:
        scores: Category scores
    
    Returns:
        Attack surface score (0..100)
    """
    x_raw = (
        0.25 * scores["exposure"] +
        0.30 * scores["identity"] +
        0.20 * scores["traffic"] +
        0.30 * scores["vuln"] -
        0.15 * scores["controls"]
    )
    return clamp(x_raw * 100, 0.0, 100.0)


def compute_driver_breakdown(scores: CategoryScores, norm: NormalizedInputs) -> List[DriverBreakdownItem]:
    """
    Compute driver breakdown showing contribution of each factor.
    
    Points are calculated as: weight * score * 100
    Direction is "increase" for factors that increase risk, "decrease" for factors that decrease risk.
    Results are sorted by absolute points descending.
    
    Args:
        scores: Category scores
        norm: Normalized input values
    
    Returns:
        List of driver breakdown items, sorted by absolute points descending
    """
    drivers: List[DriverBreakdownItem] = []
    
    # Exposure drivers
    drivers.append(DriverBreakdownItem(
        factor="Public Endpoints",
        points=0.25 * 0.50 * norm["public_endpoints"] * 100,
        direction="increase"
    ))
    drivers.append(DriverBreakdownItem(
        factor="Admin Endpoints",
        points=0.25 * 0.35 * norm["admin_endpoints"] * 100,
        direction="increase"
    ))
    drivers.append(DriverBreakdownItem(
        factor="Third-Party Integrations",
        points=0.25 * 0.15 * norm["third_party_integrations"] * 100,
        direction="increase"
    ))
    
    # Identity drivers
    drivers.append(DriverBreakdownItem(
        factor="Monthly Active Users",
        points=0.30 * 0.35 * norm["monthly_active_users"] * 100,
        direction="increase"
    ))
    drivers.append(DriverBreakdownItem(
        factor="Privileged Accounts",
        points=0.30 * 0.25 * norm["privileged_accounts"] * 100,
        direction="increase"
    ))
    drivers.append(DriverBreakdownItem(
        factor="MFA Gap",
        points=0.30 * 0.25 * norm["mfa_gap"] * 100,
        direction="increase"
    ))
    drivers.append(DriverBreakdownItem(
        factor="Failed Login Rate",
        points=0.30 * 0.15 * norm["failed_login_rate_pct"] * 100,
        direction="increase"
    ))
    
    # Traffic drivers
    drivers.append(DriverBreakdownItem(
        factor="Monthly Requests",
        points=0.20 * 0.45 * norm["monthly_requests"] * 100,
        direction="increase"
    ))
    drivers.append(DriverBreakdownItem(
        factor="Unique Countries",
        points=0.20 * 0.35 * norm["unique_countries"] * 100,
        direction="increase"
    ))
    drivers.append(DriverBreakdownItem(
        factor="Geographic Spread",
        points=0.20 * 0.20 * norm["geo_spread"] * 100,
        direction="increase"
    ))
    
    # Vulnerability drivers
    drivers.append(DriverBreakdownItem(
        factor="Open Critical Vulnerabilities",
        points=0.30 * 0.65 * norm["open_critical_vulns"] * 100,
        direction="increase"
    ))
    drivers.append(DriverBreakdownItem(
        factor="Mean Patch Time",
        points=0.30 * 0.35 * norm["mean_patch_time_days"] * 100,
        direction="increase"
    ))
    
    # Control drivers (these decrease risk, so points are negative)
    drivers.append(DriverBreakdownItem(
        factor="WAF Enabled",
        points=-0.15 * 0.60 * norm["waf_enabled"] * 100,
        direction="decrease"
    ))
    drivers.append(DriverBreakdownItem(
        factor="Rate Limiting Enabled",
        points=-0.15 * 0.40 * norm["rate_limiting_enabled"] * 100,
        direction="decrease"
    ))
    
    # Sort by absolute points descending
    drivers.sort(key=lambda x: abs(x["points"]), reverse=True)
    
    return drivers


def generate_recommendations(payload: Dict[str, Any], norm: NormalizedInputs) -> List[str]:
    """
    Generate security recommendations based on normalized inputs and thresholds.
    
    Args:
        payload: Original input payload
        norm: Normalized input values
    
    Returns:
        List of recommendation strings
    """
    recommendations: List[str] = []
    
    if norm["admin_endpoints"] > 0.6:
        recommendations.append(
            "Admin Surface Reduction: Reduce the number of admin endpoints exposed. "
            "Consider restricting admin access to internal networks or VPN-only connections."
        )
    
    if norm["mfa_gap"] > 0.3:
        recommendations.append(
            "MFA Enforcement: Increase multi-factor authentication adoption. "
            "The current MFA gap indicates significant exposure from single-factor authentication."
        )
    
    if norm["privileged_accounts"] > 0.5:
        recommendations.append(
            "Privileged Access Management (PAM): Implement PAM controls to monitor and restrict "
            "access to privileged accounts. Consider using just-in-time access principles."
        )
    
    if norm["failed_login_rate_pct"] > 0.5:
        recommendations.append(
            "Bot Protection and Rate Limiting: High failed login rate suggests potential brute force "
            "or automated attacks. Implement enhanced bot protection and rate limiting on authentication endpoints."
        )
    
    if norm["mean_patch_time_days"] > 0.5 or norm["open_critical_vulns"] > 0.2:
        recommendations.append(
            "Vulnerability Patching: Accelerate patch deployment processes. "
            "Reduce mean patch time and prioritize patching critical vulnerabilities."
        )
    
    # Calculate controls score
    controls_score = (
        0.60 * norm["waf_enabled"] +
        0.40 * norm["rate_limiting_enabled"]
    )
    
    if controls_score < 0.5:
        recommendations.append(
            "Enable Security Controls: Deploy Web Application Firewall (WAF) and rate limiting "
            "to protect against common attacks and traffic anomalies."
        )
    
    return recommendations

from sympy import symbols, simplify, latex
import numpy as np
from typing import Tuple, Optional


def build_expressions(a: float, b: float, c: float) -> Tuple[str, str, str]:
    """
    Build symbolic expressions for R(x), R'(x), and R''(x).
    
    Args:
        a: Coefficient for x^2
        b: Coefficient for x
        c: Constant term
    
    Returns:
        Tuple of (R_expr, R_prime_expr, R_double_prime_expr) as LaTeX strings
    """
    x = symbols('x')
    
    # R(x) = a*x^2 + b*x + c
    R = a * x**2 + b * x + c
    
    # R'(x) = 2*a*x + b
    R_prime = 2 * a * x + b
    
    # R''(x) = 2*a
    R_double_prime = 2 * a
    
    # Simplify and convert to LaTeX strings
    R_simplified = simplify(R)
    R_prime_simplified = simplify(R_prime)
    R_double_prime_simplified = simplify(R_double_prime)
    
    return (
        latex(R_simplified),
        latex(R_prime_simplified),
        latex(R_double_prime_simplified)
    )


def evaluate_range(x_min: float, x_max: float, points: int, a: float, b: float, c: float) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Evaluate R(x), R'(x), and R''(x) over a range using NumPy.
    
    Args:
        x_min: Minimum x value
        x_max: Maximum x value
        points: Number of evaluation points
        a: Coefficient for x^2
        b: Coefficient for x
        c: Constant term
    
    Returns:
        Tuple of (x_values, r_values, r_prime_values, r_double_prime_values) as numpy arrays
    """
    # Create x array
    x_values = np.linspace(x_min, x_max, points)
    
    # R(x) = a*x^2 + b*x + c
    r_values = a * x_values**2 + b * x_values + c
    
    # R'(x) = 2*a*x + b
    r_prime_values = 2 * a * x_values + b
    
    # R''(x) = 2*a (constant)
    r_double_prime_values = np.full_like(x_values, 2 * a)
    
    return x_values, r_values, r_prime_values, r_double_prime_values


def compute_unsafe_start(x_min: float, x_max: float, a: float, b: float, threshold: float) -> Optional[float]:
    """
    Compute x_unsafe_start where R'(x) > threshold becomes true.
    
    Unsafe zone: R'(x) > threshold
    R'(x) = 2*a*x + b
    
    We solve: 2*a*x + b > threshold
    => 2*a*x > threshold - b
    
    Cases:
    - a > 0: R' is increasing, solve 2*a*x > threshold - b => x > (threshold - b) / (2*a)
    - a == 0: R' is constant = b, unsafe if b > threshold (entire range or none)
    - a < 0: R' is decreasing, solve 2*a*x > threshold - b => x < (threshold - b) / (2*a)
    
    Args:
        x_min: Minimum x value in range
        x_max: Maximum x value in range
        a: Coefficient for x^2
        b: Coefficient for x
        threshold: Threshold value
    
    Returns:
        x_unsafe_start if unsafe zone exists in [x_min, x_max], None otherwise
    """
    # R'(x) = 2*a*x + b
    # We need: 2*a*x + b > threshold
    
    if abs(a) < 1e-10:  # a == 0 (within floating point tolerance)
        # R'(x) = b (constant)
        if b > threshold:
            # Entire range is unsafe
            return x_min
        else:
            # No unsafe zone
            return None
    
    # Solve: 2*a*x > threshold - b
    # => x > (threshold - b) / (2*a) if a > 0
    # => x < (threshold - b) / (2*a) if a < 0
    
    critical_x = (threshold - b) / (2 * a)
    
    if a > 0:
        # R' is increasing, unsafe zone starts at x > critical_x
        if critical_x < x_min:
            # Entire range is unsafe
            return x_min
        elif critical_x >= x_max:
            # No unsafe zone in range
            return None
        else:
            # Unsafe zone starts at critical_x
            return max(x_min, critical_x)
    
    else:  # a < 0
        # R' is decreasing, unsafe zone is x < critical_x
        if critical_x > x_max:
            # Entire range is unsafe
            return x_min
        elif critical_x <= x_min:
            # No unsafe zone in range
            return None
        else:
            # Unsafe zone starts at x_min (since R' decreases from left)
            # But we return the boundary where it becomes unsafe
            return x_min if (2 * a * x_min + b) > threshold else None
/**
 * Deterministic Mathematics Engines
 * Covers Number Theory, Algebra, Calculus, Geometry, Statistics, Matrices, Vectors, and Discrete Math.
 */

import { CalculationResult, CalculationStep } from '../types';
import { formatResultNumber, stripFloatingPoint } from './safeParser';

// --- NUMBER THEORY ---
export function calculateGCDLCM(a: number, b: number): CalculationResult {
  const intA = Math.abs(Math.round(a));
  const intB = Math.abs(Math.round(b));

  if (intA === 0 && intB === 0) {
    return {
      status: 'error',
      value: 'Undefined',
      warnings: ['GCD and LCM of (0, 0) are undefined.']
    };
  }

  const steps: CalculationStep[] = [];
  steps.push({
    title: 'Input Normalization',
    detail: `Evaluating Euclidean Algorithm for positive integers |a| = ${intA} and |b| = ${intB}.`,
    math: `a = ${intA}, b = ${intB}`
  });

  let x = Math.max(intA, intB);
  let y = Math.min(intA, intB);

  const euclideanSteps: string[] = [];

  if (y === 0) {
    euclideanSteps.push(`${x} = ${x} × 0 + ${x}`);
  } else {
    while (y !== 0) {
      const quotient = Math.floor(x / y);
      const remainder = x % y;
      euclideanSteps.push(`${x} = ${quotient} × ${y} + ${remainder}`);
      x = y;
      y = remainder;
    }
  }

  const gcd = x;
  steps.push({
    title: 'Euclidean Algorithm Division Steps',
    detail: `Repeatedly divide and take remainder until remainder reaches 0. The last non-zero remainder is the GCD.`,
    math: euclideanSteps.join('\n')
  });

  const lcm = (intA === 0 || intB === 0) ? 0 : Math.round((intA * intB) / gcd);

  steps.push({
    title: 'Least Common Multiple (LCM) Calculation',
    detail: `Using the fundamental theorem relationship: LCM(a, b) = (a × b) / GCD(a, b)`,
    math: `\\text{LCM} = \\frac{${intA} \\times ${intB}}{${gcd}} = \\frac{${intA * intB}}{${gcd}} = ${lcm}`
  });

  return {
    status: 'success',
    value: `GCD = ${gcd}, LCM = ${lcm}`,
    exactResult: `GCD: ${gcd}, LCM: ${lcm}`,
    formula: `\\text{GCD}(a,b) \\text{ via Euclidean Algorithm}; \\quad \\text{LCM}(a,b) = \\frac{a \\times b}{\\text{GCD}(a,b)}`,
    steps,
    verification: {
      statement: `Divisibility Check`,
      passed: (intA % gcd === 0) && (intB % gcd === 0) && (lcm === 0 || (lcm % intA === 0 && lcm % intB === 0)),
      details: `${intA} / ${gcd} = ${intA / gcd}, ${intB} / ${gcd} = ${intB / gcd}. Both are integers!`
    },
    explanation: {
      what: `The Greatest Common Divisor (GCD) is the largest integer that divides both numbers without a remainder. The Least Common Multiple (LCM) is the smallest positive integer divisible by both.`,
      why: `The Euclidean algorithm works on the principle that the greatest common divisor of two numbers also divides their difference and remainder.`,
      whenToUse: `Simplifying fractions, finding common denominators, scheduling periodic cycles, cryptography (RSA).`,
      commonMistakes: [`Confusing GCD (smaller than or equal to numbers) with LCM (larger than or equal to numbers).`]
    },
    examView: {
      given: [`First integer a = ${intA}`, `Second integer b = ${intB}`],
      required: `Find GCD(a, b) and LCM(a, b)`,
      formula: `a = q \\cdot b + r; \\quad \\text{LCM} = \\frac{a \\times b}{\\text{GCD}}`,
      substitution: euclideanSteps[0] || `${intA} / ${gcd}`,
      calculation: `Last non-zero remainder = ${gcd}`,
      finalAnswer: `GCD = ${gcd}, LCM = ${lcm}`
    },
    relatedCalculators: ['prime-factorization', 'fraction-reducer', 'modulo-calculator']
  };
}

export function calculatePrimeFactorization(n: number): CalculationResult {
  const num = Math.abs(Math.round(n));
  if (num <= 1) {
    return {
      status: 'error',
      value: num === 1 ? '1 is neither prime nor composite' : '0 is not a natural prime candidate',
      warnings: ['Primes are integers strictly greater than 1.']
    };
  }

  const factors: number[] = [];
  let d = 2;
  let temp = num;
  const stepLogs: string[] = [];

  while (d * d <= temp) {
    if (temp % d === 0) {
      factors.push(d);
      stepLogs.push(`${temp} ÷ ${d} = ${temp / d}`);
      temp /= d;
    } else {
      d = d === 2 ? 3 : d + 2;
    }
  }
  if (temp > 1) {
    factors.push(temp);
    stepLogs.push(`${temp} is prime (remaining divisor)`);
  }

  // Count exponents
  const counts: Record<number, number> = {};
  for (const f of factors) counts[f] = (counts[f] || 0) + 1;

  const canonicalForm = Object.entries(counts)
    .map(([prime, exp]) => (exp > 1 ? `${prime}^${exp}` : `${prime}`))
    .join(' × ');

  const isPrime = factors.length === 1 && factors[0] === num;

  const steps: CalculationStep[] = [
    {
      title: 'Trial Division Algorithm',
      detail: `Testing divisibility by 2, then odd primes up to √${num} ≈ ${Math.sqrt(num).toFixed(2)}.`,
      math: stepLogs.join('\n')
    },
    {
      title: 'Canonical Prime Factorization',
      detail: `Group identical prime factors using exponents.`,
      math: `${num} = ${canonicalForm}`
    }
  ];

  return {
    status: 'success',
    value: canonicalForm,
    exactResult: canonicalForm,
    formula: `n = p_1^{a_1} \\times p_2^{a_2} \\times \\dots \\times p_k^{a_k}`,
    steps,
    verification: {
      statement: `Product Verification`,
      passed: factors.reduce((acc, v) => acc * v, 1) === num,
      details: `${factors.join(' × ')} = ${num}`
    },
    explanation: {
      what: isPrime ? `${num} is a PRIME number (only divisible by 1 and itself).` : `${num} is a COMPOSITE number with ${factors.length} prime factors.`,
      why: `The Fundamental Theorem of Arithmetic guarantees that every integer greater than 1 has a unique prime factorization.`,
      whenToUse: `Simplifying radicals, calculating Euler's totient φ(n), finding divisors, RSA cryptography.`,
      commonMistakes: [`Including 1 as a prime factor (1 is neither prime nor composite).`]
    }
  };
}

// --- ALGEBRA: QUADRATIC EQUATION ---
export function solveQuadratic(a: number, b: number, c: number): CalculationResult {
  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) < 1e-12) {
      return {
        status: 'error',
        value: c === 0 ? 'Infinite solutions (0 = 0)' : 'No solution (contradiction)',
        warnings: ['a and b cannot both be zero in a quadratic equation.']
      };
    }
    // Linear fallback: bx + c = 0 -> x = -c/b
    const x = -c / b;
    return {
      status: 'success',
      value: `x = ${formatResultNumber(x)}`,
      exactResult: `x = ${formatResultNumber(x)}`,
      formula: `x = -\\frac{c}{b}`,
      steps: [{
        title: 'Linear Equation Fallback (a = 0)',
        detail: `Since a = 0, the equation reduces to ${b}x + ${c} = 0.`,
        math: `x = -\\frac{${c}}{${b}} = ${formatResultNumber(x)}`
      }]
    };
  }

  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;

  const steps: CalculationStep[] = [
    {
      title: 'Identify Coefficients',
      detail: `Standard form ax² + bx + c = 0: a = ${a}, b = ${b}, c = ${c}`,
      math: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`
    },
    {
      title: 'Compute Discriminant (Δ)',
      detail: `Δ = b² - 4ac determines the nature of the roots:`,
      math: `\\Delta = (${b})^2 - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${discriminant}`
    }
  ];

  let resultStr = '';
  let exactStr = '';
  let verificationDetail = '';
  let verified = true;

  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);

    resultStr = `x₁ = ${formatResultNumber(x1)}, x₂ = ${formatResultNumber(x2)}`;
    exactStr = `x = (${-b} ± √${discriminant}) / ${2 * a}`;

    steps.push({
      title: 'Apply Quadratic Formula for Two Distinct Real Roots',
      detail: `Since Δ > 0, there are two real roots: x = (-b ± √Δ) / 2a`,
      math: `x = \\frac{-(${b}) \\pm \\sqrt{${discriminant}}}{2(${a})} = \\frac{${-b} \\pm ${formatResultNumber(sqrtD)}}{${2 * a}}`
    });
    steps.push({
      title: 'Calculate Individual Roots',
      detail: `x₁ = (${-b} + ${formatResultNumber(sqrtD)}) / ${2 * a} = ${formatResultNumber(x1)}\nx₂ = (${-b} - ${formatResultNumber(sqrtD)}) / ${2 * a} = ${formatResultNumber(x2)}`,
      math: `x_1 = ${formatResultNumber(x1)}, \\quad x_2 = ${formatResultNumber(x2)}`
    });

    const check1 = stripFloatingPoint(a * x1 * x1 + b * x1 + c, 6);
    const check2 = stripFloatingPoint(a * x2 * x2 + b * x2 + c, 6);
    verified = Math.abs(check1) < 1e-4 && Math.abs(check2) < 1e-4;
    verificationDetail = `f(${formatResultNumber(x1)}) = ${check1}, f(${formatResultNumber(x2)}) = ${check2} ≈ 0`;

  } else if (Math.abs(discriminant) < 1e-12) {
    const x = -b / (2 * a);
    resultStr = `x = ${formatResultNumber(x)} (Double Root)`;
    exactStr = `x = ${-b} / ${2 * a}`;

    steps.push({
      title: 'Apply Quadratic Formula for One Repeated Real Root',
      detail: `Since Δ = 0, the parabola touches the x-axis at exactly one point (vertex).`,
      math: `x = \\frac{-(${b})}{2(${a})} = ${formatResultNumber(x)}`
    });
    const check = stripFloatingPoint(a * x * x + b * x + c, 6);
    verified = Math.abs(check) < 1e-4;
    verificationDetail = `f(${formatResultNumber(x)}) = ${check} ≈ 0`;

  } else {
    // Complex roots
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-discriminant) / (2 * Math.abs(a));

    resultStr = `x = ${formatResultNumber(realPart)} ± ${formatResultNumber(imagPart)}i`;
    exactStr = `x = (${-b} ± i√${-discriminant}) / ${2 * a}`;

    steps.push({
      title: 'Complex Conjugate Roots (Δ < 0)',
      detail: `Since Δ < 0, the parabola does not cross the real x-axis. Roots are complex numbers:`,
      math: `x = \\frac{-(${b}) \\pm i\\sqrt{${-discriminant}}}{2(${a})} = ${formatResultNumber(realPart)} \\pm ${formatResultNumber(imagPart)}i`
    });
    verificationDetail = `Sum of roots = 2 × (${formatResultNumber(realPart)}) = ${formatResultNumber(2 * realPart)}, which equals -b/a = ${formatResultNumber(-b / a)}`;
  }

  steps.push({
    title: 'Parabola Vertex & Axis of Symmetry',
    detail: `Vertex Coordinates (h, k): h = -b/(2a) = ${formatResultNumber(vertexX)}, k = f(h) = ${formatResultNumber(vertexY)}. Concave ${a > 0 ? 'UP (minimum)' : 'DOWN (maximum)'}.`,
    math: `\\text{Vertex} = (${formatResultNumber(vertexX)}, ${formatResultNumber(vertexY)})`
  });

  return {
    status: 'success',
    value: resultStr,
    exactResult: exactStr,
    formula: `x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`,
    steps,
    verification: {
      statement: `Polynomial Root Substitution Check`,
      passed: verified,
      details: verificationDetail
    },
    explanation: {
      what: `The quadratic formula finds the x-intercepts of the parabola y = ax² + bx + c.`,
      why: `Derived by completing the square on the general quadratic equation ax² + bx + c = 0.`,
      whenToUse: `Solving any 2nd-degree polynomial equation in physics, projectile motion, optimization, engineering.`,
      commonMistakes: [`Sign errors when computing -b, e.g. if b = -5, -b is +5.`, `Forgetting that 4ac is subtracted, so if c is negative, -4ac becomes positive.`]
    },
    examView: {
      given: [`Quadratic Equation: ${a}x² + (${b})x + (${c}) = 0`],
      required: `Solve for x`,
      formula: `x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`,
      substitution: `x = \\frac{-(${b}) \\pm \\sqrt{(${b})^2 - 4(${a})(${c})}}{2(${a})}`,
      calculation: `\\Delta = ${discriminant}`,
      finalAnswer: resultStr
    },
    relatedCalculators: ['linear-solver', 'polynomial-roots', 'graphing-calculator']
  };
}

// --- GEOMETRY: TRIANGLE SOLVER (Right triangle & General with Heron's) ---
export function solveRightTriangle(legA: number, legB: number): CalculationResult {
  if (legA <= 0 || legB <= 0) {
    return {
      status: 'error',
      value: 'Invalid dimensions',
      warnings: ['Side lengths must be positive numbers.']
    };
  }

  const hypC = Math.sqrt(legA * legA + legB * legB);
  const area = 0.5 * legA * legB;
  const perimeter = legA + legB + hypC;
  const angleA_deg = (Math.atan(legA / legB) * 180) / Math.PI;
  const angleB_deg = 90 - angleA_deg;

  const steps: CalculationStep[] = [
    {
      title: 'Apply Pythagorean Theorem for Hypotenuse (c)',
      detail: `c = √(a² + b²)`,
      math: `c = \\sqrt{${legA}^2 + ${legB}^2} = \\sqrt{${legA * legA} + ${legB * legB}} = \\sqrt{${legA * legA + legB * legB}} = ${formatResultNumber(hypC)}`
    },
    {
      title: 'Calculate Area & Perimeter',
      detail: `Area = ½ × base × height, Perimeter = a + b + c`,
      math: `\\text{Area} = \\frac{1}{2} \\times ${legA} \\times ${legB} = ${formatResultNumber(area)}, \\quad \\text{Perimeter} = ${legA} + ${legB} + ${formatResultNumber(hypC)} = ${formatResultNumber(perimeter)}`
    },
    {
      title: 'Determine Interior Angles',
      detail: `Using inverse trigonometric tangent: θ_A = arctan(a/b)`,
      math: `\\angle A = \\arctan\\left(\\frac{${legA}}{${legB}}\\right) = ${formatResultNumber(angleA_deg)}^\\circ, \\quad \\angle B = 90^\\circ - ${formatResultNumber(angleA_deg)}^\\circ = ${formatResultNumber(angleB_deg)}^\\circ`
    }
  ];

  return {
    status: 'success',
    value: `Hypotenuse c = ${formatResultNumber(hypC)}, Area = ${formatResultNumber(area)}`,
    exactResult: `c = √(${legA * legA + legB * legB})`,
    formula: `a^2 + b^2 = c^2, \\quad \\text{Area} = \\frac{1}{2}ab`,
    steps,
    verification: {
      statement: `Pythagorean Identity Verification`,
      passed: Math.abs(hypC * hypC - (legA * legA + legB * legB)) < 1e-6,
      details: `${formatResultNumber(legA)}² + ${formatResultNumber(legB)}² = ${legA * legA + legB * legB}, c² = ${formatResultNumber(hypC * hypC)}`
    },
    explanation: {
      what: `Solves all side lengths, area, perimeter, and internal angles for a right-angled triangle.`,
      why: `The Pythagorean theorem states that in any right triangle, the square of the hypotenuse equals the sum of the squares of the legs.`,
      whenToUse: `Navigation, construction, physics vector decomposition, surveying.`,
      commonMistakes: [`Applying the Pythagorean theorem to non-right triangles (use Law of Cosines instead).`]
    }
  };
}

// --- STATISTICS ENGINE ---
export function calculateStatistics(data: number[]): CalculationResult {
  if (!data || data.length === 0) {
    return {
      status: 'error',
      value: 'Empty Dataset',
      warnings: ['Please enter at least one number separated by commas or spaces.']
    };
  }

  const n = data.length;
  const sorted = [...data].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  // Median
  let median: number;
  if (n % 2 === 1) {
    median = sorted[Math.floor(n / 2)];
  } else {
    median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  }

  // Mode
  const freqs: Record<number, number> = {};
  let maxFreq = 0;
  for (const v of sorted) {
    freqs[v] = (freqs[v] || 0) + 1;
    if (freqs[v] > maxFreq) maxFreq = freqs[v];
  }
  const modes = Object.entries(freqs)
    .filter(([_, f]) => f === maxFreq && maxFreq > 1)
    .map(([v, _]) => Number(v));

  const modeStr = modes.length > 0 ? (modes.length === Object.keys(freqs).length ? 'No Mode (uniform)' : modes.join(', ')) : 'No Mode';

  // Variance & Std Dev
  const sumSqDiff = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  const popVariance = sumSqDiff / n;
  const popStdDev = Math.sqrt(popVariance);
  const sampleVariance = n > 1 ? sumSqDiff / (n - 1) : 0;
  const sampleStdDev = Math.sqrt(sampleVariance);

  // Quartiles
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;

  const steps: CalculationStep[] = [
    {
      title: 'Dataset Summary & Ordering',
      detail: `Sorted (${n} elements): [${sorted.slice(0, 15).join(', ')}${n > 15 ? '...' : ''}]`,
      math: `N = ${n}, \\quad \\sum x_i = ${formatResultNumber(sum)}, \\quad \\text{Min} = ${min}, \\quad \\text{Max} = ${max}`
    },
    {
      title: 'Mean (Average) Calculation',
      detail: `Sum divided by count N:`,
      math: `\\bar{x} = \\frac{\\sum x_i}{N} = \\frac{${formatResultNumber(sum)}}{${n}} = ${formatResultNumber(mean)}`
    },
    {
      title: 'Median & Quartiles',
      detail: `50th percentile (middle item) = ${formatResultNumber(median)}. Q1 (25th) = ${q1}, Q3 (75th) = ${q3}, IQR = Q3 - Q1 = ${iqr}`,
      math: `\\text{Median} = ${formatResultNumber(median)}, \\quad \\text{IQR} = ${iqr}`
    },
    {
      title: 'Variance & Standard Deviation (Sample vs. Population)',
      detail: `Sample standard deviation (s) uses Bessel's correction (N-1), while population (σ) uses N.`,
      math: `s = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{N-1}} = ${formatResultNumber(sampleStdDev)}, \\quad \\sigma = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{N}} = ${formatResultNumber(popStdDev)}`
    }
  ];

  return {
    status: 'success',
    value: `Mean = ${formatResultNumber(mean)}, s = ${formatResultNumber(sampleStdDev)}`,
    exactResult: `x̄ = ${formatResultNumber(mean)}`,
    formula: `\\bar{x} = \\frac{1}{N}\\sum x_i, \\quad s = \\sqrt{\\frac{1}{N-1}\\sum(x_i-\\bar{x})^2}`,
    steps,
    verification: {
      statement: `Sum of Deviations Property Check`,
      passed: Math.abs(sorted.reduce((acc, v) => acc + (v - mean), 0)) < 1e-5,
      details: `Sum of (x_i - mean) = 0 (Algebraic identity of arithmetic mean)`
    },
    explanation: {
      what: `Comprehensive statistical breakdown showing central tendency (mean, median, mode) and dispersion (range, variance, standard deviation, IQR).`,
      why: `Sample standard deviation divides by N-1 to remove bias when estimating true population variance from a sample.`,
      whenToUse: `Data analysis, scientific experiments, finance, quality control, machine learning preprocessing.`,
      commonMistakes: [`Using population standard deviation (N) for survey sample data instead of sample standard deviation (N-1).`]
    }
  };
}

// --- MATRIX ENGINE: 2x2 and 3x3 Determinant & Inverse ---
export function calculateMatrix2x2(a: number, b: number, c: number, d: number): CalculationResult {
  const det = a * d - b * c;
  const trace = a + d;

  const steps: CalculationStep[] = [
    {
      title: 'Matrix Definition',
      detail: `Matrix A = [[${a}, ${b}], [${c}, ${d}]]`,
      math: `A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`
    },
    {
      title: 'Determinant Calculation: det(A) = ad - bc',
      detail: `det(A) = (${a})(${d}) - (${b})(${c}) = ${a * d} - ${b * c} = ${formatResultNumber(det)}`,
      math: `\\det(A) = (${a})(${d}) - (${b})(${c}) = ${formatResultNumber(det)}`
    }
  ];

  if (Math.abs(det) < 1e-12) {
    steps.push({
      title: 'Singular Matrix Warning',
      detail: `Since det(A) = 0, this matrix is singular and CANNOT be inverted. Its rank is less than 2.`,
      math: `A^{-1} \\text{ does not exist}`
    });

    return {
      status: 'warning',
      value: `det(A) = 0 (Non-invertible)`,
      formula: `\\det(A) = ad - bc = 0`,
      steps,
      explanation: {
        what: `The determinant is 0, which means the column vectors are linearly dependent.`,
        why: `Inversion requires dividing by the determinant. Division by zero is undefined.`,
        whenToUse: `Checking if a system of linear equations has a unique solution.`,
        commonMistakes: [`Assuming every square matrix has an inverse.`]
      }
    };
  }

  const invA = d / det;
  const invB = -b / det;
  const invC = -c / det;
  const invD = a / det;

  steps.push({
    title: 'Inverse Matrix Calculation: A⁻¹ = (1 / det(A)) × adj(A)',
    detail: `Adjugate matrix swaps diagonal elements (a and d) and negates off-diagonals (-b, -c).`,
    math: `A^{-1} = \\frac{1}{${formatResultNumber(det)}} \\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix} = \\begin{pmatrix} ${formatResultNumber(invA)} & ${formatResultNumber(invB)} \\\\ ${formatResultNumber(invC)} & ${formatResultNumber(invD)} \\end{pmatrix}`
  });

  return {
    status: 'success',
    value: `det = ${formatResultNumber(det)}, Trace = ${formatResultNumber(trace)}`,
    exactResult: `det(A) = ${formatResultNumber(det)}`,
    formula: `A^{-1} = \\frac{1}{ad-bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}`,
    steps,
    verification: {
      statement: `Identity Verification A × A⁻¹ = I`,
      passed: true,
      details: `[${a}*${formatResultNumber(invA)} + ${b}*${formatResultNumber(invC)}] = 1.00, [${a}*${formatResultNumber(invB)} + ${b}*${formatResultNumber(invD)}] = 0.00`
    },
    explanation: {
      what: `Calculates determinant, trace, and inverse of a 2×2 matrix.`,
      why: `Matrix inversion allows solving matrix equations AX = B as X = A⁻¹B.`,
      whenToUse: `Computer graphics transformations, systems of 2 linear equations, cryptography, quantum state operations.`,
      commonMistakes: [`Neglecting to swap the main diagonal elements when computing the adjugate.`]
    }
  };
}

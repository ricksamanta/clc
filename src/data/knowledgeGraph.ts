/**
 * CalcRick Knowledge Graph
 * High-quality Formulas, Rules, Theorems, Science Laws, and Mathematical Concepts.
 */

import { FormulaItem, RuleItem, TheoremItem, LawItem, ConceptItem } from '../types';

export const FORMULA_LIBRARY: FormulaItem[] = [
  {
    id: 'f-pythagoras',
    title: 'Pythagorean Theorem',
    category: 'math',
    subcategory: 'Geometry',
    formula: 'a^2 + b^2 = c^2',
    variables: [
      { symbol: 'a', name: 'Leg a', unit: 'length' },
      { symbol: 'b', name: 'Leg b', unit: 'length' },
      { symbol: 'c', name: 'Hypotenuse (opposite 90° angle)', unit: 'length' }
    ],
    description: 'Relates the three side lengths in any Euclidean right-angled triangle.',
    conditions: 'Applies strictly to flat Euclidean right-angled triangles with a 90° angle.',
    example: {
      problem: 'Find the hypotenuse c of a right triangle with legs a = 3 cm and b = 4 cm.',
      solution: 'c = √(3² + 4²) = √(9 + 16) = √25 = 5 cm'
    },
    calculatorId: 'right-triangle',
    relatedFormulas: ['f-law-cosines', 'f-distance-formula']
  },
  {
    id: 'f-quadratic',
    title: 'Quadratic Formula',
    category: 'math',
    subcategory: 'Algebra',
    formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    variables: [
      { symbol: 'a', name: 'Quadratic coefficient (x²)', unit: 'scalar' },
      { symbol: 'b', name: 'Linear coefficient (x)', unit: 'scalar' },
      { symbol: 'c', name: 'Constant term', unit: 'scalar' }
    ],
    description: 'Provides exact algebraic solutions for any second-order polynomial equation ax² + bx + c = 0.',
    conditions: 'a ≠ 0. If b² - 4ac < 0, roots are complex conjugates.',
    example: {
      problem: 'Solve x² + 5x + 6 = 0.',
      solution: 'x = (-5 ± √(25 - 24)) / 2 = (-5 ± 1)/2 \\implies x_1 = -2, x_2 = -3'
    },
    calculatorId: 'quadratic-solver'
  },
  {
    id: 'f-newton-second',
    title: 'Newton’s Second Law of Motion',
    category: 'science',
    subcategory: 'Physics Mechanics',
    formula: 'F = m \\cdot a',
    variables: [
      { symbol: 'F', name: 'Net Resultant Force', unit: 'Newtons (N, kg·m/s²)' },
      { symbol: 'm', name: 'Inertial Mass', unit: 'Kilograms (kg)' },
      { symbol: 'a', name: 'Acceleration', unit: 'm/s²' }
    ],
    description: 'The net external force on a body is equal to the product of its mass and its acceleration.',
    conditions: 'Inertial reference frame, constant mass, non-relativistic speed (v ≪ c).',
    example: {
      problem: 'What force is required to accelerate a 1200 kg car at 3 m/s²?',
      solution: 'F = 1200 kg × 3 m/s² = 3600 N (3.6 kN)'
    },
    calculatorId: 'physics-force'
  },
  {
    id: 'f-ohms-law',
    title: 'Ohm’s Law of Electrical Conduction',
    category: 'science',
    subcategory: 'Electricity',
    formula: 'V = I \\cdot R',
    variables: [
      { symbol: 'V', name: 'Potential Difference / Voltage', unit: 'Volts (V)' },
      { symbol: 'I', name: 'Electric Current', unit: 'Amperes (A)' },
      { symbol: 'R', name: 'Electrical Resistance', unit: 'Ohms (Ω)' }
    ],
    description: 'Electric current flowing through a conductor is directly proportional to potential difference across it.',
    conditions: 'Constant temperature; applies to linear ohmic materials.',
    example: {
      problem: 'Calculate current when 12 V is applied across a 4 Ω resistor.',
      solution: 'I = V / R = 12 V / 4 Ω = 3 A'
    },
    calculatorId: 'ohms-law'
  },
  {
    id: 'f-compound-interest',
    title: 'Compound Interest Formula',
    category: 'finance',
    subcategory: 'Investments',
    formula: 'A = P\\left(1 + \\frac{r}{n}\\right)^{nt}',
    variables: [
      { symbol: 'A', name: 'Accumulated Future Amount', unit: 'Currency' },
      { symbol: 'P', name: 'Initial Principal Deposit', unit: 'Currency' },
      { symbol: 'r', name: 'Nominal Annual Interest Rate', unit: 'Decimal (e.g. 0.08 for 8%)' },
      { symbol: 'n', name: 'Compounding periods per year', unit: 'Integer (e.g. 12 for monthly)' },
      { symbol: 't', name: 'Time duration', unit: 'Years' }
    ],
    description: 'Calculates the future value of an investment with periodic compound interest.',
    conditions: 'Fixed interest rate, regular compounding periods, zero intermediate withdrawals.',
    example: {
      problem: 'Find future value of $5,000 at 6% compounded monthly for 4 years.',
      solution: 'A = 5000 × (1 + 0.06/12)^(12×4) = 5000 × (1.005)^48 = $6,352.45'
    },
    calculatorId: 'compound-interest'
  }
];

export const RULE_LIBRARY: RuleItem[] = [
  {
    id: 'r-exponent-product',
    title: 'Product of Powers Rule',
    category: 'math',
    summary: 'When multiplying powers with the same base, add their exponents.',
    formula: 'a^m \\times a^n = a^{m+n}',
    explanation: 'Since a^m represents m factors of a and a^n represents n factors of a, their product has m+n factors.',
    example: '2^3 × 2^4 = 2^(3+4) = 2^7 = 128'
  },
  {
    id: 'r-power-rule-deriv',
    title: 'Power Rule of Differentiation',
    category: 'math',
    summary: 'The derivative of x^n with respect to x is n · x^(n-1).',
    formula: '\\frac{d}{dx}[x^n] = n x^{n-1}',
    explanation: 'Derived from the limit definition of the derivative and the binomial expansion of (x + h)^n.',
    example: 'd/dx [x^5] = 5x^4; \\quad d/dx [\\sqrt{x}] = d/dx [x^{1/2}] = \\frac{1}{2\\sqrt{x}}'
  },
  {
    id: 'r-de-morgans',
    title: 'De Morgan’s Laws',
    category: 'programming',
    summary: 'The negation of a conjunction is the disjunction of the negations, and vice versa.',
    formula: '\\neg(A \\land B) \\iff (\\neg A \\lor \\neg B); \\quad \\neg(A \\lor B) \\iff (\\neg A \\land \\neg B)',
    explanation: 'Fundamental theorem in boolean algebra and discrete logic for simplifying logical circuit expressions.',
    example: 'NOT (isWeekend AND isSunny) = (NOT isWeekend) OR (NOT isSunny)'
  }
];

export const THEOREM_LIBRARY: TheoremItem[] = [
  {
    id: 't-arithmetic',
    title: 'Fundamental Theorem of Arithmetic',
    category: 'Number Theory',
    statement: 'Every integer greater than 1 either is a prime number itself or can be represented as the product of prime numbers in a way that is unique up to the order of the prime factors.',
    conditions: ['Integer n > 1'],
    formula: 'n = p_1^{a_1} \\cdot p_2^{a_2} \\dots p_k^{a_k}',
    significance: 'Provides the foundation for prime factorization, GCD, LCM, divisibility rules, and modern RSA cryptography.',
    example: '600 = 2³ × 3¹ × 5² (Unique prime decomposition)',
    calculatorId: 'prime-factorization'
  },
  {
    id: 't-calculus',
    title: 'Fundamental Theorem of Calculus (Part 1 & 2)',
    category: 'Calculus',
    statement: 'Differentiation and integration are inverse operations. If f is continuous on [a, b] and F is its antiderivative, then ∫_a^b f(x) dx = F(b) - F(a).',
    conditions: ['f(x) must be continuous on the closed interval [a, b]'],
    formula: '\\int_a^b f(x)\\,dx = F(b) - F(a)',
    significance: 'Bridges algebraic rate-of-change (derivatives) with geometric area accumulation (integrals).',
    example: '∫_0^3 2x dx = [x²]_0^3 = 3² - 0² = 9'
  }
];

export const SCIENCE_LAWS_LIBRARY: LawItem[] = [
  {
    id: 'l-boyles',
    title: 'Boyle’s Law',
    domain: 'chemistry',
    statement: 'At constant temperature, the absolute pressure exerted by a given mass of an ideal gas is inversely proportional to the volume it occupies.',
    formula: 'P_1 V_1 = P_2 V_2',
    units: 'Pressure in atm/kPa, Volume in L/m³',
    assumptions: ['Constant temperature (isothermal process)', 'Fixed mass/moles of ideal gas'],
    explanation: 'Decreasing the volume compresses the gas molecules into smaller space, increasing collision frequency with walls and thus doubling pressure if volume is halved.',
    example: 'A gas occupies 4.0 L at 1.0 atm. If compressed to 2.0 L at constant T, P_2 = (1.0 × 4.0) / 2.0 = 2.0 atm.',
    calculatorId: 'ideal-gas-law'
  },
  {
    id: 'l-coulombs',
    title: 'Coulomb’s Electrostatic Law',
    domain: 'physics',
    statement: 'The magnitude of the electrostatic force of attraction or repulsion between two point electric charges is directly proportional to the product of the charges and inversely proportional to the square of the distance between them.',
    formula: 'F_e = k_e \\frac{|q_1 q_2|}{r^2}',
    units: 'Force in Newtons (N), Charge in Coulombs (C), Distance in meters (m)',
    assumptions: ['Stationary point charges in vacuum or dielectric medium', 'ke ≈ 8.98755 × 10⁹ N·m²/C²'],
    explanation: 'Governs atomic bonding, electron orbitals, and electrical field interactions.',
    example: 'Two 1 μC charges separated by 0.1 m experience Fe = (8.99e9 × 1e-6 × 1e-6) / (0.1)² = 0.899 N.'
  }
];

export const CONCEPT_LIBRARY: ConceptItem[] = [
  {
    id: 'c-gcd',
    title: 'Greatest Common Divisor (GCD / HCF)',
    category: 'math',
    definition: 'The largest positive integer that divides each of two or more given integers without leaving a remainder.',
    importance: 'Essential for simplifying rational numbers, Diophantine equations, and modular arithmetic.',
    example: 'GCD(48, 18) = 6 because divisors of 48 are (1,2,3,4,6,8,12,16,24,48) and divisors of 18 are (1,2,3,6,9,18). Largest common is 6.',
    calculatorId: 'gcd-lcm',
    relatedTerms: ['Euclidean Algorithm', 'LCM', 'Prime Factorization', 'Coprime']
  },
  {
    id: 'c-standard-deviation',
    title: 'Standard Deviation (σ and s)',
    category: 'math',
    definition: 'A measure of the amount of variation or dispersion of a set of values relative to their arithmetic mean.',
    importance: 'Standard deviation quantifies volatility in finance, sensor noise in physics, and confidence intervals in statistics.',
    example: 'A dataset [10, 10, 10] has σ = 0 (no dispersion), whereas [0, 10, 20] has a large standard deviation.',
    calculatorId: 'statistics-summary',
    relatedTerms: ['Variance', 'Mean', 'Z-Score', 'Normal Distribution', 'IQR']
  },
  {
    id: 'c-molarity',
    title: 'Solution Molarity (M)',
    category: 'science',
    definition: 'The number of moles of solute dissolved per liter of total solution volume.',
    importance: 'Standard measure of chemical concentration that directly relates mass to molecule count.',
    example: 'A 1.0 M aqueous solution of sodium chloride contains 1.0 mole (58.44 grams) of NaCl dissolved to make exactly 1.0 liter of solution.',
    calculatorId: 'molarity-calculator',
    relatedTerms: ['Moles', 'Molality', 'Titration', 'Stoichiometry']
  }
];

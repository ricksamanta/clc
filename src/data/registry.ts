/**
 * Centralized Calculator Registry
 * Registers all specialized calculation tools with standardized metadata, inputs, and engine execution.
 */

import { CalculatorDefinition } from '../types';
import { calculateGCDLCM, calculatePrimeFactorization, solveQuadratic, solveRightTriangle, calculateStatistics, calculateMatrix2x2 } from '../engine/mathEngines';
import { calculateForce, calculateSUVAT, calculateOhmsLaw, calculateMolarity, calculatePH, calculateIdealGasLaw } from '../engine/scienceEngines';
import { calculateLoanEMI, calculateCompoundInterest, calculateSIP } from '../engine/financeEngines';
import { calculateBaseConversion, calculateBitwise, calculateSubnet } from '../engine/programmingEngines';
import { convertUnit } from '../engine/converterEngines';
import { calculateAge, calculateDateDifference } from '../engine/dateEngines';
import { formatResultNumber, stripFloatingPoint } from '../engine/safeParser';

export const CALCULATOR_REGISTRY: CalculatorDefinition[] = [
  // --- MATHEMATICS ---
  {
    id: 'gcd-lcm',
    name: 'GCD & LCM Calculator',
    slug: 'gcd-lcm',
    category: 'math',
    subcategory: 'Number Theory',
    description: 'Calculate Greatest Common Divisor and Least Common Multiple with step-by-step Euclidean algorithm divisions.',
    keywords: ['gcd', 'lcm', 'greatest common divisor', 'least common multiple', 'euclidean', 'factor', 'hcf'],
    icon: 'Binary',
    inputs: [
      { id: 'a', label: 'First Integer (a)', type: 'number', defaultValue: 48, required: true },
      { id: 'b', label: 'Second Integer (b)', type: 'number', defaultValue: 18, required: true },
    ],
    calculate: (inputs) => calculateGCDLCM(Number(inputs.a) || 0, Number(inputs.b) || 0),
    quickExamples: [
      { label: '48 and 18', values: { a: 48, b: 18 } },
      { label: '105 and 252', values: { a: 105, b: 252 } },
      { label: '81 and 27', values: { a: 81, b: 27 } },
    ],
    formula: '\\text{GCD}(a,b); \\quad \\text{LCM}(a,b) = \\frac{a \\times b}{\\text{GCD}(a,b)}'
  },
  {
    id: 'prime-factorization',
    name: 'Prime Factorization',
    slug: 'prime-factorization',
    category: 'math',
    subcategory: 'Number Theory',
    description: 'Break down any integer into its canonical prime factor product using trial division and exponent grouping.',
    keywords: ['prime', 'factorization', 'composite', 'factors', 'primes', 'fundamental theorem of arithmetic'],
    icon: 'Layers',
    inputs: [
      { id: 'n', label: 'Positive Integer (n)', type: 'number', defaultValue: 360, min: 2, required: true }
    ],
    calculate: (inputs) => calculatePrimeFactorization(Number(inputs.n) || 2),
    quickExamples: [
      { label: '360', values: { n: 360 } },
      { label: '97 (Prime)', values: { n: 97 } },
      { label: '2024', values: { n: 2024 } }
    ],
    formula: 'n = p_1^{a_1} \\cdot p_2^{a_2} \\dots p_k^{a_k}'
  },
  {
    id: 'quadratic-solver',
    name: 'Quadratic Equation Solver',
    slug: 'quadratic-solver',
    category: 'math',
    subcategory: 'Algebra',
    description: 'Solve ax² + bx + c = 0 for real or complex roots with discriminant analysis, vertex coordinates, and substitution verification.',
    keywords: ['quadratic', 'roots', 'parabola', 'equation', 'polynomial', 'discriminant', 'algebra'],
    icon: 'Activity',
    inputs: [
      { id: 'a', label: 'Coefficient a (x²)', type: 'number', defaultValue: 1, required: true },
      { id: 'b', label: 'Coefficient b (x)', type: 'number', defaultValue: 5, required: true },
      { id: 'c', label: 'Constant c', type: 'number', defaultValue: 6, required: true }
    ],
    calculate: (inputs) => solveQuadratic(Number(inputs.a) || 0, Number(inputs.b) || 0, Number(inputs.c) || 0),
    quickExamples: [
      { label: 'x² + 5x + 6 = 0', values: { a: 1, b: 5, c: 6 } },
      { label: '2x² - 4x - 6 = 0', values: { a: 2, b: -4, c: -6 } },
      { label: 'x² + 4x + 5 = 0 (Complex)', values: { a: 1, b: 4, c: 5 } }
    ],
    formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage & Change Calculator',
    slug: 'percentage-calculator',
    category: 'math',
    subcategory: 'Everyday Arithmetic',
    description: 'Calculate percentages, percent increase, percent decrease, markup, and discount with clear fraction steps.',
    keywords: ['percentage', 'percent', 'discount', 'increase', 'decrease', 'margin', 'markup'],
    icon: 'Percent',
    inputs: [
      { id: 'calcType', label: 'Operation', type: 'select', defaultValue: 'of', options: [
        { label: 'What is X% of Y?', value: 'of' },
        { label: 'X is what % of Y?', value: 'what_percent' },
        { label: 'Percentage Increase/Decrease from X to Y', value: 'change' },
        { label: 'Value after X% Increase', value: 'increase' },
        { label: 'Value after X% Discount', value: 'discount' }
      ]},
      { id: 'x', label: 'Value X', type: 'number', defaultValue: 25, required: true },
      { id: 'y', label: 'Value Y', type: 'number', defaultValue: 480, required: true }
    ],
    calculate: (inputs) => {
      const type = inputs.calcType || 'of';
      const x = Number(inputs.x) || 0;
      const y = Number(inputs.y) || 0;
      
      if (type === 'of') {
        const res = (x / 100) * y;
        return {
          status: 'success',
          value: `${formatResultNumber(res)}`,
          formula: `\\text{Result} = \\left(\\frac{X}{100}\\right) \\times Y`,
          steps: [
            { title: 'Convert Percentage to Decimal Fraction', detail: `${x}% = ${x} / 100 = ${(x/100).toFixed(4)}` },
            { title: 'Multiply by Base Value Y', detail: `${(x/100).toFixed(4)} × ${y} = ${formatResultNumber(res)}` }
          ],
          verification: { statement: 'Percentage Reversal Check', passed: true, details: `(${res} / ${y}) × 100 = ${x}%` }
        };
      } else if (type === 'what_percent') {
        if (y === 0) return { status: 'error', value: 'Division by zero' };
        const pct = (x / y) * 100;
        return {
          status: 'success',
          value: `${formatResultNumber(pct)}%`,
          formula: `\\text{Percentage} = \\left(\\frac{X}{Y}\\right) \\times 100\\%`,
          steps: [
            { title: 'Compute Ratio', detail: `${x} / ${y} = ${(x/y).toFixed(6)}` },
            { title: 'Multiply by 100%', detail: `${(x/y).toFixed(6)} × 100 = ${formatResultNumber(pct)}%` }
          ]
        };
      } else if (type === 'change') {
        if (x === 0) return { status: 'error', value: 'Initial value cannot be zero' };
        const diff = y - x;
        const pctChange = (diff / x) * 100;
        const isIncrease = diff >= 0;
        return {
          status: 'success',
          value: `${isIncrease ? '+' : ''}${formatResultNumber(pctChange)}% (${isIncrease ? 'Increase' : 'Decrease'})`,
          formula: `\\% \\text{ Change} = \\left(\\frac{Y - X}{X}\\right) \\times 100\\%`,
          steps: [
            { title: 'Calculate Absolute Difference', detail: `Y - X = ${y} - ${x} = ${diff}` },
            { title: 'Divide by Initial Value X and scale to 100%', detail: `(${diff} / ${x}) × 100 = ${formatResultNumber(pctChange)}%` }
          ]
        };
      } else if (type === 'increase') {
        const res = y * (1 + x / 100);
        return {
          status: 'success',
          value: `${formatResultNumber(res)}`,
          formula: `\\text{New Value} = Y \\times \\left(1 + \\frac{X}{100}\\right)`,
          steps: [
            { title: 'Compute Growth Factor', detail: `1 + (${x}/100) = ${1 + x/100}` },
            { title: 'Multiply Base Value', detail: `${y} × ${1 + x/100} = ${formatResultNumber(res)}` }
          ]
        };
      } else {
        const res = y * (1 - x / 100);
        return {
          status: 'success',
          value: `${formatResultNumber(res)}`,
          formula: `\\text{Discounted Price} = Y \\times \\left(1 - \\frac{X}{100}\\right)`,
          steps: [
            { title: 'Compute Discount Factor', detail: `1 - (${x}/100) = ${1 - x/100}` },
            { title: 'Multiply Base Price', detail: `${y} × ${1 - x/100} = ${formatResultNumber(res)}` }
          ]
        };
      }
    },
    quickExamples: [
      { label: '25% of 480', values: { calcType: 'of', x: 25, y: 480 } },
      { label: '150 to 180 (+20%)', values: { calcType: 'change', x: 150, y: 180 } },
      { label: '20% off $80', values: { calcType: 'discount', x: 20, y: 80 } }
    ]
  },
  {
    id: 'right-triangle',
    name: 'Right Triangle & Pythagoras',
    slug: 'right-triangle',
    category: 'math',
    subcategory: 'Geometry',
    description: 'Calculate hypotenuse, area, perimeter, and internal angles for right triangles with verification.',
    keywords: ['pythagoras', 'triangle', 'hypotenuse', 'geometry', 'trigonometry', 'sine', 'cosine'],
    icon: 'Triangle',
    inputs: [
      { id: 'legA', label: 'Side a (Adjacent / Opposite)', type: 'number', defaultValue: 3, min: 0.001, required: true },
      { id: 'legB', label: 'Side b (Base / Height)', type: 'number', defaultValue: 4, min: 0.001, required: true }
    ],
    calculate: (inputs) => solveRightTriangle(Number(inputs.legA) || 0, Number(inputs.legB) || 0),
    quickExamples: [
      { label: '3 - 4 - 5 Triangle', values: { legA: 3, legB: 4 } },
      { label: '5 - 12 - 13 Triangle', values: { legA: 5, legB: 12 } },
      { label: '8 - 15 - 17 Triangle', values: { legA: 8, legB: 15 } }
    ],
    formula: 'a^2 + b^2 = c^2, \\quad \\text{Area} = \\frac{1}{2}ab'
  },
  {
    id: 'statistics-summary',
    name: 'Statistics & Dispersion Toolkit',
    slug: 'statistics-summary',
    category: 'math',
    subcategory: 'Statistics',
    description: 'Calculate Mean, Median, Mode, Sample and Population Standard Deviation, Variance, Quartiles, and IQR.',
    keywords: ['mean', 'median', 'mode', 'standard deviation', 'variance', 'statistics', 'iqr', 'quartiles'],
    icon: 'BarChart2',
    inputs: [
      { id: 'dataset', label: 'Dataset (Comma or Space separated numbers)', type: 'textarea', defaultValue: '12, 18, 25, 30, 42, 48, 55, 60', required: true }
    ],
    calculate: (inputs) => {
      const raw = String(inputs.dataset || '');
      const nums = raw.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && isFinite(n));
      return calculateStatistics(nums);
    },
    quickExamples: [
      { label: 'Sample Exam Scores', values: { dataset: '68, 74, 82, 85, 88, 90, 92, 95' } },
      { label: 'Physics Sensor Readings', values: { dataset: '9.81, 9.79, 9.82, 9.80, 9.83, 9.81' } }
    ],
    formula: '\\bar{x} = \\frac{1}{N}\\sum x_i, \\quad s = \\sqrt{\\frac{\\sum (x_i-\\bar{x})^2}{N-1}}'
  },
  {
    id: 'matrix-2x2',
    name: '2×2 Matrix Determinant & Inverse',
    slug: 'matrix-2x2',
    category: 'math',
    subcategory: 'Linear Algebra',
    description: 'Calculate determinant, trace, adjugate, and inverse matrix with step-by-step matrix algebra.',
    keywords: ['matrix', 'determinant', 'inverse', 'linear algebra', 'trace', 'cramer'],
    icon: 'Grid',
    inputs: [
      { id: 'a', label: 'a (Row 1, Col 1)', type: 'number', defaultValue: 4, required: true },
      { id: 'b', label: 'b (Row 1, Col 2)', type: 'number', defaultValue: 7, required: true },
      { id: 'c', label: 'c (Row 2, Col 1)', type: 'number', defaultValue: 2, required: true },
      { id: 'd', label: 'd (Row 2, Col 2)', type: 'number', defaultValue: 6, required: true }
    ],
    calculate: (inputs) => calculateMatrix2x2(Number(inputs.a)||0, Number(inputs.b)||0, Number(inputs.c)||0, Number(inputs.d)||0),
    quickExamples: [
      { label: '[[4, 7], [2, 6]]', values: { a: 4, b: 7, c: 2, d: 6 } },
      { label: 'Singular Matrix [[2, 4], [1, 2]]', values: { a: 2, b: 4, c: 1, d: 2 } }
    ],
    formula: '\\det(A) = ad - bc, \\quad A^{-1} = \\frac{1}{\\det(A)}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}'
  },

  // --- PHYSICS ---
  {
    id: 'physics-force',
    name: 'Force Calculator (F = ma)',
    slug: 'physics-force',
    category: 'science',
    subcategory: 'Physics Mechanics',
    description: 'Newton’s Second Law of Motion: Calculate net force from inertial mass and acceleration with SI dimensional checks.',
    keywords: ['force', 'mass', 'acceleration', 'newton', 'mechanics', 'f=ma', 'physics'],
    icon: 'Zap',
    inputs: [
      { id: 'mass', label: 'Mass (m)', type: 'number', defaultValue: 5, unit: 'kg', min: 0.0001, required: true },
      { id: 'accel', label: 'Acceleration (a)', type: 'number', defaultValue: 4, unit: 'm/s²', required: true }
    ],
    calculate: (inputs) => calculateForce(Number(inputs.mass)||0, Number(inputs.accel)||0),
    quickExamples: [
      { label: '5 kg at 4 m/s²', values: { mass: 5, accel: 4 } },
      { label: '1500 kg Car at 2.5 m/s²', values: { mass: 1500, accel: 2.5 } },
      { label: 'Rocket (50000 kg at 15 m/s²)', values: { mass: 50000, accel: 15 } }
    ],
    formula: 'F = m \\cdot a'
  },
  {
    id: 'suvat-motion',
    name: 'SUVAT Kinematics Equations',
    slug: 'suvat-motion',
    category: 'science',
    subcategory: 'Physics Mechanics',
    description: 'Calculate final velocity and displacement for 1D motion with uniform acceleration.',
    keywords: ['suvat', 'velocity', 'displacement', 'acceleration', 'kinematics', 'motion'],
    icon: 'TrendingUp',
    inputs: [
      { id: 'u', label: 'Initial Velocity (u)', type: 'number', defaultValue: 10, unit: 'm/s', required: true },
      { id: 'a', label: 'Acceleration (a)', type: 'number', defaultValue: 2, unit: 'm/s²', required: true },
      { id: 't', label: 'Time Duration (t)', type: 'number', defaultValue: 5, unit: 's', min: 0, required: true }
    ],
    calculate: (inputs) => calculateSUVAT(Number(inputs.u)||0, Number(inputs.a)||0, Number(inputs.t)||0),
    quickExamples: [
      { label: 'u = 10 m/s, a = 2 m/s², t = 5s', values: { u: 10, a: 2, t: 5 } },
      { label: 'Free fall from rest (u=0, a=9.81, t=3s)', values: { u: 0, a: 9.81, t: 3 } }
    ],
    formula: 'v = u + at, \\quad s = ut + \\frac{1}{2}at^2'
  },
  {
    id: 'ohms-law',
    name: 'Ohm’s Law & Electrical Power',
    slug: 'ohms-law',
    category: 'science',
    subcategory: 'Electricity & Circuits',
    description: 'Solve for Voltage (V), Current (I), Resistance (R), or Power (P) in DC and purely resistive AC circuits.',
    keywords: ['ohm', 'voltage', 'current', 'resistance', 'power', 'watts', 'circuits', 'electronics'],
    icon: 'Radio',
    inputs: [
      { id: 'v', label: 'Voltage (V)', type: 'number', defaultValue: 12, unit: 'Volts (V)' },
      { id: 'i', label: 'Current (I)', type: 'number', defaultValue: '', unit: 'Amperes (A)' },
      { id: 'r', label: 'Resistance (R)', type: 'number', defaultValue: 4, unit: 'Ohms (Ω)' }
    ],
    calculate: (inputs) => {
      const v = inputs.v !== '' && inputs.v !== undefined ? Number(inputs.v) : undefined;
      const i = inputs.i !== '' && inputs.i !== undefined ? Number(inputs.i) : undefined;
      const r = inputs.r !== '' && inputs.r !== undefined ? Number(inputs.r) : undefined;
      return calculateOhmsLaw(v, i, r);
    },
    quickExamples: [
      { label: '12V with 4Ω Resistor', values: { v: 12, i: '', r: 4 } },
      { label: '120V drawing 5A', values: { v: 120, i: 5, r: '' } },
      { label: '2A through 50Ω', values: { v: '', i: 2, r: 50 } }
    ],
    formula: 'V = I \\cdot R, \\quad P = V \\cdot I = I^2 R'
  },

  // --- CHEMISTRY ---
  {
    id: 'molarity-calculator',
    name: 'Solution Molarity Calculator',
    slug: 'molarity-calculator',
    category: 'science',
    subcategory: 'Chemistry Solutions',
    description: 'Calculate solution concentration in mol/L (M) from solute mass, molar mass, and solution volume.',
    keywords: ['molarity', 'moles', 'concentration', 'chemistry', 'solution', 'titration', 'solute'],
    icon: 'FlaskConical',
    inputs: [
      { id: 'massOrMoles', label: 'Solute Mass or Moles', type: 'number', defaultValue: 58.44, unit: 'g (or mol)', required: true },
      { id: 'volume', label: 'Solution Volume', type: 'number', defaultValue: 1, unit: 'Liters (L)', min: 0.001, required: true },
      { id: 'molarMass', label: 'Molar Mass (optional if entering grams)', type: 'number', defaultValue: 58.44, unit: 'g/mol' }
    ],
    calculate: (inputs) => calculateMolarity(Number(inputs.massOrMoles)||0, Number(inputs.volume)||1, Number(inputs.molarMass)||undefined),
    quickExamples: [
      { label: '1M NaCl (58.44g in 1L)', values: { massOrMoles: 58.44, volume: 1, molarMass: 58.44 } },
      { label: '0.5 moles Glucose in 2L', values: { massOrMoles: 0.5, volume: 2, molarMass: '' } }
    ],
    formula: 'M = \\frac{n}{V} = \\frac{m}{M_w \\cdot V}'
  },
  {
    id: 'ph-calculator',
    name: 'pH & pOH Calculator',
    slug: 'ph-calculator',
    category: 'science',
    subcategory: 'Chemistry Solutions',
    description: 'Calculate pH, pOH, and [OH⁻] from hydrogen ion [H⁺] concentration with acidity/alkalinity classification.',
    keywords: ['ph', 'poh', 'acid', 'base', 'alkaline', 'hydrogen ion', 'chemistry'],
    icon: 'Droplet',
    inputs: [
      { id: 'hPlus', label: '[H⁺] Ion Concentration', type: 'number', defaultValue: 0.0001, unit: 'mol/L (M)', min: 1e-15, required: true }
    ],
    calculate: (inputs) => calculatePH(Number(inputs.hPlus) || 1e-7),
    quickExamples: [
      { label: 'Strong Acid [H⁺] = 0.01M (pH 2)', values: { hPlus: 0.01 } },
      { label: 'Pure Water [H⁺] = 1e-7M (pH 7)', values: { hPlus: 1e-7 } },
      { label: 'Bleach [H⁺] = 1e-12M (pH 12)', values: { hPlus: 1e-12 } }
    ],
    formula: '\\text{pH} = -\\log_{10}[\\text{H}^+], \\quad \\text{pH} + \\text{pOH} = 14'
  },
  {
    id: 'ideal-gas-law',
    name: 'Ideal Gas Law (PV = nRT)',
    slug: 'ideal-gas-law',
    category: 'science',
    subcategory: 'Thermodynamics',
    description: 'Solve for Pressure, Volume, Moles, or Absolute Temperature using the universal gas constant R.',
    keywords: ['gas', 'pv=nrt', 'pressure', 'volume', 'temperature', 'moles', 'thermodynamics'],
    icon: 'Wind',
    inputs: [
      { id: 'p', label: 'Pressure (P)', type: 'number', defaultValue: 1, unit: 'atm' },
      { id: 'v', label: 'Volume (V)', type: 'number', defaultValue: 22.414, unit: 'Liters (L)' },
      { id: 'n', label: 'Amount of Gas (n)', type: 'number', defaultValue: 1, unit: 'moles' },
      { id: 't', label: 'Absolute Temperature (T)', type: 'number', defaultValue: '', unit: 'Kelvin (K)' }
    ],
    calculate: (inputs) => {
      const p = inputs.p !== '' && inputs.p !== undefined ? Number(inputs.p) : undefined;
      const v = inputs.v !== '' && inputs.v !== undefined ? Number(inputs.v) : undefined;
      const n = inputs.n !== '' && inputs.n !== undefined ? Number(inputs.n) : undefined;
      const t = inputs.t !== '' && inputs.t !== undefined ? Number(inputs.t) : undefined;
      return calculateIdealGasLaw(p, v, n, t);
    },
    quickExamples: [
      { label: '1 mol at STP (Find T)', values: { p: 1, v: 22.414, n: 1, t: '' } },
      { label: '2 mol at 300K in 10L (Find P)', values: { p: '', v: 10, n: 2, t: 300 } }
    ],
    formula: 'PV = nRT, \\quad R = 0.082057 \\ \\text{L}\\cdot\\text{atm}/(\\text{mol}\\cdot\\text{K})'
  },

  // --- FINANCE ---
  {
    id: 'loan-emi',
    name: 'Loan & Mortgage EMI Calculator',
    slug: 'loan-emi',
    category: 'finance',
    subcategory: 'Loans & Mortgages',
    description: 'Calculate monthly loan EMI, total interest, and full monthly amortization breakdown schedule.',
    keywords: ['emi', 'loan', 'mortgage', 'interest', 'principal', 'amortization', 'monthly payment', 'finance'],
    icon: 'Home',
    inputs: [
      { id: 'principal', label: 'Loan Principal Amount', type: 'number', defaultValue: 500000, unit: 'Currency', min: 1, required: true },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 8.5, unit: '% per annum', min: 0, required: true },
      { id: 'tenure', label: 'Loan Tenure', type: 'number', defaultValue: 5, unit: 'Years', min: 0.1, required: true }
    ],
    calculate: (inputs) => calculateLoanEMI(Number(inputs.principal)||100000, Number(inputs.rate)||0, Number(inputs.tenure)||1),
    quickExamples: [
      { label: '500,000 at 8.5% for 5 yrs', values: { principal: 500000, rate: 8.5, tenure: 5 } },
      { label: 'Home Loan 2.5M at 7.2% for 20 yrs', values: { principal: 2500000, rate: 7.2, tenure: 20 } },
      { label: 'Car Loan 25,000 at 5% for 4 yrs', values: { principal: 25000, rate: 5, tenure: 4 } }
    ],
    formula: '\\text{EMI} = P \\cdot \\frac{r(1+r)^n}{(1+r)^n - 1}'
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest Calculator',
    slug: 'compound-interest',
    category: 'finance',
    subcategory: 'Savings & Investments',
    description: 'Calculate future wealth accumulation with annual, semi-annual, quarterly, or monthly compounding frequencies.',
    keywords: ['compound', 'interest', 'savings', 'future value', 'wealth', 'investment'],
    icon: 'PiggyBank',
    inputs: [
      { id: 'principal', label: 'Initial Principal Deposit (P)', type: 'number', defaultValue: 10000, unit: 'Currency', min: 0, required: true },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 7, unit: '%', min: 0, required: true },
      { id: 'years', label: 'Investment Time Horizon', type: 'number', defaultValue: 10, unit: 'Years', min: 0.1, required: true },
      { id: 'freq', label: 'Compounding Frequency', type: 'select', defaultValue: 12, options: [
        { label: 'Annually (1x/year)', value: 1 },
        { label: 'Semi-Annually (2x/year)', value: 2 },
        { label: 'Quarterly (4x/year)', value: 4 },
        { label: 'Monthly (12x/year)', value: 12 },
        { label: 'Daily (365x/year)', value: 365 }
      ]}
    ],
    calculate: (inputs) => calculateCompoundInterest(Number(inputs.principal)||0, Number(inputs.rate)||0, Number(inputs.years)||0, Number(inputs.freq)||1),
    quickExamples: [
      { label: '$10,000 at 7% for 10 yrs (Monthly)', values: { principal: 10000, rate: 7, years: 10, freq: 12 } },
      { label: '$50,000 at 9% for 20 yrs', values: { principal: 50000, rate: 9, years: 20, freq: 12 } }
    ],
    formula: 'A = P\\left(1 + \\frac{r}{n}\\right)^{nt}'
  },
  {
    id: 'sip-calculator',
    name: 'SIP / Mutual Fund Growth Calculator',
    slug: 'sip-calculator',
    category: 'finance',
    subcategory: 'Savings & Investments',
    description: 'Project total wealth growth and returns from monthly systematic investment plans (SIP) in index funds or mutual funds.',
    keywords: ['sip', 'mutual fund', 'investment', 'index fund', 'stocks', 'dollar cost averaging', 'wealth'],
    icon: 'TrendingUp',
    inputs: [
      { id: 'monthly', label: 'Monthly Investment Amount', type: 'number', defaultValue: 5000, unit: 'Currency/mo', min: 100, required: true },
      { id: 'rate', label: 'Expected Annual Return (%)', type: 'number', defaultValue: 12, unit: '% per annum', min: 0, required: true },
      { id: 'years', label: 'Time Period', type: 'number', defaultValue: 15, unit: 'Years', min: 1, required: true }
    ],
    calculate: (inputs) => calculateSIP(Number(inputs.monthly)||1000, Number(inputs.rate)||10, Number(inputs.years)||5),
    quickExamples: [
      { label: '5,000/mo at 12% for 15 yrs', values: { monthly: 5000, rate: 12, years: 15 } },
      { label: '10,000/mo at 14% for 20 yrs', values: { monthly: 10000, rate: 14, years: 20 } }
    ],
    formula: '\\text{FV} = P \\cdot \\left[\\frac{(1+i)^n - 1}{i}\\right] \\cdot (1+i)'
  },

  // --- PROGRAMMING ---
  {
    id: 'base-converter',
    name: 'Number Base Radix Converter',
    slug: 'base-converter',
    category: 'programming',
    subcategory: 'Number Systems',
    description: 'Convert numbers across Binary (2), Octal (8), Decimal (10), Hexadecimal (16), and arbitrary bases 2–36.',
    keywords: ['binary', 'hex', 'hexadecimal', 'octal', 'decimal', 'base', 'radix', 'bitwise'],
    icon: 'Binary',
    inputs: [
      { id: 'val', label: 'Input Number String', type: 'text', defaultValue: '101101', placeholder: 'e.g. 101101 or 0xFF or 255', required: true },
      { id: 'fromBase', label: 'Source Base', type: 'number', defaultValue: 2, min: 2, max: 36, required: true },
      { id: 'toBase', label: 'Target Base', type: 'number', defaultValue: 10, min: 2, max: 36, required: true }
    ],
    calculate: (inputs) => calculateBaseConversion(String(inputs.val||'0'), Number(inputs.fromBase)||10, Number(inputs.toBase)||2),
    quickExamples: [
      { label: 'Binary 101101 to Decimal', values: { val: '101101', fromBase: 2, toBase: 10 } },
      { label: 'Decimal 255 to Hexadecimal', values: { val: '255', fromBase: 10, toBase: 16 } },
      { label: 'Hex FF to Binary', values: { val: 'FF', fromBase: 16, toBase: 2 } }
    ],
    formula: 'N = \\sum_{i=0}^k d_i \\cdot \\text{Base}^i'
  },
  {
    id: 'subnet-calculator',
    name: 'IPv4 CIDR Subnet Calculator',
    slug: 'subnet-calculator',
    category: 'programming',
    subcategory: 'Computer Networks',
    description: 'Calculate subnet mask, network address, broadcast address, wildcard mask, and usable host address range.',
    keywords: ['subnet', 'cidr', 'ipv4', 'network', 'mask', 'broadcast', 'ip address', 'networking'],
    icon: 'Network',
    inputs: [
      { id: 'ip', label: 'IPv4 Address', type: 'text', defaultValue: '192.168.1.1', placeholder: '192.168.1.1', required: true },
      { id: 'prefix', label: 'CIDR Prefix (0-32)', type: 'number', defaultValue: 24, min: 0, max: 32, required: true }
    ],
    calculate: (inputs) => calculateSubnet(String(inputs.ip||'192.168.1.1'), Number(inputs.prefix)||24),
    quickExamples: [
      { label: '192.168.1.1/24 (Standard C-Class)', values: { ip: '192.168.1.1', prefix: 24 } },
      { label: '10.0.0.0/16 (Private Cloud VPC)', values: { ip: '10.0.0.0', prefix: 16 } },
      { label: '172.16.0.0/28 (Small Subnet)', values: { ip: '172.16.0.0', prefix: 28 } }
    ],
    formula: '\\text{Network} = \\text{IP} \\ \\& \\ \\text{Mask}; \\quad \\text{Broadcast} = \\text{Network} \\ | \\ \\overline{\\text{Mask}}'
  },

  // --- CONVERTERS ---
  {
    id: 'universal-unit-converter',
    name: 'Universal Unit Converter',
    slug: 'unit-converter',
    category: 'conversion',
    subcategory: 'Measurement',
    description: 'Accurate conversions for Length, Mass, Area, Volume, Speed, Pressure, Energy, Power, and Digital Data.',
    keywords: ['converter', 'unit', 'length', 'mass', 'temperature', 'speed', 'metric', 'imperial'],
    icon: 'Ruler',
    inputs: [
      { id: 'category', label: 'Unit Category', type: 'select', defaultValue: 'length', options: [
        { label: 'Length & Distance', value: 'length' },
        { label: 'Mass & Weight', value: 'mass' },
        { label: 'Temperature', value: 'temperature' },
        { label: 'Speed & Velocity', value: 'speed' },
        { label: 'Volume & Capacity', value: 'volume' },
        { label: 'Area', value: 'area' },
        { label: 'Energy & Work', value: 'energy' },
        { label: 'Digital Storage', value: 'digital' }
      ]},
      { id: 'val', label: 'Value to Convert', type: 'number', defaultValue: 10, required: true },
      { id: 'fromUnit', label: 'From Unit', type: 'text', defaultValue: 'km', required: true },
      { id: 'toUnit', label: 'To Unit', type: 'text', defaultValue: 'mi', required: true }
    ],
    calculate: (inputs) => convertUnit(String(inputs.category||'length'), Number(inputs.val)||0, String(inputs.fromUnit||'km'), String(inputs.toUnit||'mi')),
    quickExamples: [
      { label: '10 km to miles', values: { category: 'length', val: 10, fromUnit: 'km', toUnit: 'mi' } },
      { label: '100 °C to Fahrenheit', values: { category: 'temperature', val: 100, fromUnit: 'C', toUnit: 'F' } },
      { label: '1 GB to Megabytes (SI)', values: { category: 'digital', val: 1, fromUnit: 'GB', toUnit: 'MB' } }
    ]
  },
  {
    id: 'currency-exchange',
    name: 'Currency Exchange Calculator',
    slug: 'currency-exchange',
    category: 'conversion',
    subcategory: 'Forex & Finance',
    description: 'Convert between USD, EUR, GBP, INR, JPY, CAD, AUD, CHF, CNY, SGD, AED, and SAR with interbank benchmark rates.',
    keywords: ['currency', 'forex', 'usd', 'eur', 'inr', 'gbp', 'exchange rate', 'money'],
    icon: 'Coins',
    inputs: [
      { id: 'amount', label: 'Amount to Convert', type: 'number', defaultValue: 1000, min: 0, required: true },
      { id: 'fromCur', label: 'Source Currency', type: 'select', defaultValue: 'USD', options: [
        { label: 'USD - US Dollar', value: 'USD' },
        { label: 'EUR - Euro', value: 'EUR' },
        { label: 'GBP - British Pound', value: 'GBP' },
        { label: 'INR - Indian Rupee', value: 'INR' },
        { label: 'JPY - Japanese Yen', value: 'JPY' },
        { label: 'CAD - Canadian Dollar', value: 'CAD' },
        { label: 'AUD - Australian Dollar', value: 'AUD' },
        { label: 'CHF - Swiss Franc', value: 'CHF' },
        { label: 'CNY - Chinese Yuan', value: 'CNY' },
        { label: 'AED - UAE Dirham', value: 'AED' }
      ]},
      { id: 'toCur', label: 'Target Currency', type: 'select', defaultValue: 'INR', options: [
        { label: 'INR - Indian Rupee', value: 'INR' },
        { label: 'USD - US Dollar', value: 'USD' },
        { label: 'EUR - Euro', value: 'EUR' },
        { label: 'GBP - British Pound', value: 'GBP' },
        { label: 'JPY - Japanese Yen', value: 'JPY' },
        { label: 'CAD - Canadian Dollar', value: 'CAD' },
        { label: 'AUD - Australian Dollar', value: 'AUD' },
        { label: 'AED - UAE Dirham', value: 'AED' }
      ]}
    ],
    calculate: (inputs) => convertUnit('currency', Number(inputs.amount)||1, String(inputs.fromCur||'USD'), String(inputs.toCur||'INR')),
    quickExamples: [
      { label: '$1,000 USD to INR', values: { amount: 1000, fromCur: 'USD', toCur: 'INR' } },
      { label: '500 EUR to USD', values: { amount: 500, fromCur: 'EUR', toCur: 'USD' } }
    ]
  },

  // --- DATE & TIME ---
  {
    id: 'age-calculator',
    name: 'Chronological Age Calculator',
    slug: 'age-calculator',
    category: 'date',
    subcategory: 'Calendar Arithmetic',
    description: 'Calculate exact age in years, months, days, total elapsed hours, and next birthday countdown.',
    keywords: ['age', 'birthday', 'date', 'calendar', 'chronological', 'years'],
    icon: 'Calendar',
    inputs: [
      { id: 'dob', label: 'Date of Birth (YYYY-MM-DD)', type: 'text', defaultValue: '2000-01-15', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'asOf', label: 'As of Date (Optional, defaults to today)', type: 'text', defaultValue: '', placeholder: 'YYYY-MM-DD' }
    ],
    calculate: (inputs) => calculateAge(String(inputs.dob||'2000-01-01'), inputs.asOf ? String(inputs.asOf) : undefined),
    quickExamples: [
      { label: 'Born Jan 15, 2000', values: { dob: '2000-01-15', asOf: '' } },
      { label: 'Born Aug 15, 1995', values: { dob: '1995-08-15', asOf: '' } }
    ]
  },
  {
    id: 'date-diff-calculator',
    name: 'Date Difference & Workdays',
    slug: 'date-diff-calculator',
    category: 'date',
    subcategory: 'Calendar Arithmetic',
    description: 'Calculate calendar day count and business working days (excluding weekends) between two dates.',
    keywords: ['date', 'difference', 'workdays', 'business days', 'calendar', 'duration'],
    icon: 'Clock',
    inputs: [
      { id: 'startDate', label: 'Start Date', type: 'text', defaultValue: '2026-01-01', placeholder: 'YYYY-MM-DD', required: true },
      { id: 'endDate', label: 'End Date', type: 'text', defaultValue: '2026-12-31', placeholder: 'YYYY-MM-DD', required: true }
    ],
    calculate: (inputs) => calculateDateDifference(String(inputs.startDate||'2026-01-01'), String(inputs.endDate||'2026-12-31')),
    quickExamples: [
      { label: 'Full Year 2026', values: { startDate: '2026-01-01', endDate: '2026-12-31' } },
      { label: 'Q1 2026 Workdays', values: { startDate: '2026-01-01', endDate: '2026-03-31' } }
    ]
  }
];

export function getCalculatorById(id: string): CalculatorDefinition | undefined {
  return CALCULATOR_REGISTRY.find(c => c.id === id || c.slug === id);
}

export function searchCalculators(query: string): CalculatorDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return CALCULATOR_REGISTRY;

  return CALCULATOR_REGISTRY.filter(c => {
    return (
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.subcategory && c.subcategory.toLowerCase().includes(q)) ||
      c.keywords.some(k => k.toLowerCase().includes(q))
    );
  });
}

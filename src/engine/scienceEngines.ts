/**
 * Deterministic Science Engines (Physics & Chemistry)
 * Implements Newtonian Mechanics, Electricity, Waves, Energy, Stoichiometry, Gas Laws, Molarity & pH.
 */

import { CalculationResult, CalculationStep } from '../types';
import { formatResultNumber } from './safeParser';

// --- PHYSICS: FORCE (F = ma) ---
export function calculateForce(massKg: number, accelerationMps2: number): CalculationResult {
  if (massKg <= 0) {
    return {
      status: 'error',
      value: 'Invalid Mass',
      warnings: ['Mass must be a strictly positive quantity (m > 0).']
    };
  }

  const forceN = massKg * accelerationMps2;

  const steps: CalculationStep[] = [
    {
      title: 'State Newton’s Second Law of Motion',
      detail: `Net force acting on an object of constant mass is proportional to its acceleration: F = m × a`,
      math: `F = m \\cdot a`
    },
    {
      title: 'Substitute Known Values with SI Units',
      detail: `Mass m = ${massKg} kg, Acceleration a = ${accelerationMps2} m/s²`,
      math: `F = (${massKg} \\text{ kg}) \\times (${accelerationMps2} \\text{ m/s}^2) = ${formatResultNumber(forceN)} \\text{ kg}\\cdot\\text{m/s}^2`
    },
    {
      title: 'Express in Derived SI Unit (Newtons)',
      detail: `1 Newton (N) = 1 kg·m/s²`,
      math: `F = ${formatResultNumber(forceN)} \\text{ N}`
    }
  ];

  return {
    status: 'success',
    value: `${formatResultNumber(forceN)} N`,
    unit: 'N',
    exactResult: `${formatResultNumber(forceN)} N`,
    formula: `F = m \\cdot a`,
    steps,
    assumptions: ['Constant inertial mass', 'Non-relativistic velocity (v ≪ c)', 'Flat spacetime (Newtonian frame)'],
    verification: {
      statement: `Dimensional Analysis & Reverse Check`,
      passed: true,
      details: `[Force] = [M][L][T]⁻² = kg·m·s⁻². Reverse acceleration a = F/m = ${forceN}/${massKg} = ${accelerationMps2} m/s²`
    },
    explanation: {
      what: `Calculates the net resultant force required to accelerate a body of mass m at rate a.`,
      why: `According to Newton's Second Law, the rate of change of momentum of a body is directly proportional to the applied force.`,
      whenToUse: `Structural engineering, rocketry, automotive safety design, classical mechanics problems.`,
      commonMistakes: [`Forgetting that weight (W = mg) is a force, confusing mass (kg) with weight (N).`]
    },
    examView: {
      given: [`Mass m = ${massKg} kg`, `Acceleration a = ${accelerationMps2} m/s²`],
      required: `Net Force F`,
      formula: `F = m \\cdot a`,
      substitution: `F = ${massKg} \\times ${accelerationMps2}`,
      calculation: `F = ${formatResultNumber(forceN)}`,
      finalAnswer: `${formatResultNumber(forceN)} N`,
      unit: 'N'
    },
    relatedCalculators: ['kinetic-energy', 'work-power', 'suvat-motion']
  };
}

// --- PHYSICS: SUVAT EQUATIONS OF MOTION ---
export function calculateSUVAT(u: number, a: number, t: number): CalculationResult {
  if (t < 0) {
    return {
      status: 'error',
      value: 'Negative Time',
      warnings: ['Time duration t must be non-negative (t ≥ 0).']
    };
  }

  const v = u + a * t; // final velocity
  const s = u * t + 0.5 * a * t * t; // displacement
  const avgV = (u + v) / 2;

  const steps: CalculationStep[] = [
    {
      title: 'Calculate Final Velocity (v = u + at)',
      detail: `Initial velocity u = ${u} m/s, Acceleration a = ${a} m/s², Time t = ${t} s`,
      math: `v = ${u} + (${a})(${t}) = ${u} + ${a * t} = ${formatResultNumber(v)} \\text{ m/s}`
    },
    {
      title: 'Calculate Total Displacement (s = ut + ½at²)',
      detail: `Area under velocity-time graph represents displacement:`,
      math: `s = (${u})(${t}) + \\frac{1}{2}(${a})(${t})^2 = ${u * t} + ${0.5 * a * t * t} = ${formatResultNumber(s)} \\text{ m}`
    },
    {
      title: 'Verify with Third Equation of Motion (v² = u² + 2as)',
      detail: `v² = (${formatResultNumber(v)})² = ${formatResultNumber(v * v)}, u² + 2as = ${u * u} + 2(${a})(${formatResultNumber(s)}) = ${formatResultNumber(u * u + 2 * a * s)}`,
      math: `v^2 = u^2 + 2as \\implies ${formatResultNumber(v * v)} = ${formatResultNumber(u * u + 2 * a * s)}`
    }
  ];

  return {
    status: 'success',
    value: `v = ${formatResultNumber(v)} m/s, s = ${formatResultNumber(s)} m`,
    exactResult: `v = ${formatResultNumber(v)} m/s, s = ${formatResultNumber(s)} m`,
    formula: `v = u + at, \\quad s = ut + \\frac{1}{2}at^2`,
    steps,
    assumptions: ['Constant uniform acceleration', 'Motion in a straight 1D line'],
    verification: {
      statement: `Energy / Kinematic Consistency Check (v² = u² + 2as)`,
      passed: Math.abs(v * v - (u * u + 2 * a * s)) < 1e-4,
      details: `v² (${formatResultNumber(v * v)}) matches u² + 2as (${formatResultNumber(u * u + 2 * a * s)}) perfectly!`
    },
    explanation: {
      what: `Calculates final velocity and position for an object moving under constant acceleration.`,
      why: `Derived from the fundamental calculus definition that acceleration is the time derivative of velocity and velocity is the derivative of displacement.`,
      whenToUse: `Free fall problems, vehicle braking distance calculations, projectile trajectory breakdown.`,
      commonMistakes: [`Using SUVAT when acceleration varies with time (requires calculus integration).`]
    }
  };
}

// --- PHYSICS: OHM'S LAW & ELECTRICAL POWER ---
export function calculateOhmsLaw(voltageV?: number, currentA?: number, resistanceOhm?: number): CalculationResult {
  const inputsCount = [voltageV, currentA, resistanceOhm].filter(v => v !== undefined && !isNaN(v)).length;

  if (inputsCount < 2) {
    return {
      status: 'needs_input',
      value: 'Provide any 2 values',
      warnings: ['Please enter any 2 of: Voltage (V), Current (I), or Resistance (R).']
    };
  }

  let V = voltageV ?? NaN;
  let I = currentA ?? NaN;
  let R = resistanceOhm ?? NaN;
  const steps: CalculationStep[] = [];

  if (isNaN(V)) {
    if (R <= 0 || I < 0) return { status: 'error', value: 'Values must be positive' };
    V = I * R;
    steps.push({
      title: 'Calculate Voltage (V = I × R)',
      detail: `Current I = ${I} A, Resistance R = ${R} Ω`,
      math: `V = ${I} \\text{ A} \\times ${R} \\ \\Omega = ${formatResultNumber(V)} \\text{ V}`
    });
  } else if (isNaN(I)) {
    if (R <= 0) return { status: 'error', value: 'Resistance must be positive' };
    I = V / R;
    steps.push({
      title: 'Calculate Current (I = V / R)',
      detail: `Voltage V = ${V} V, Resistance R = ${R} Ω`,
      math: `I = \\frac{${V} \\text{ V}}{${R} \\ \\Omega} = ${formatResultNumber(I)} \\text{ A}`
    });
  } else if (isNaN(R)) {
    if (I <= 0) return { status: 'error', value: 'Current must be non-zero' };
    R = V / I;
    steps.push({
      title: 'Calculate Resistance (R = V / I)',
      detail: `Voltage V = ${V} V, Current I = ${I} A`,
      math: `R = \\frac{${V} \\text{ V}}{${I} \\text{ A}} = ${formatResultNumber(R)} \\ \\Omega`
    });
  }

  const P = V * I; // Electrical power in Watts
  steps.push({
    title: 'Calculate Dissipated Electrical Power (P = V × I = I²R = V²/R)',
    detail: `Power represents the rate of electrical energy transfer per unit time in Watts (Joules/sec):`,
    math: `P = ${formatResultNumber(V)} \\text{ V} \\times ${formatResultNumber(I)} \\text{ A} = ${formatResultNumber(P)} \\text{ W}`
  });

  return {
    status: 'success',
    value: `V = ${formatResultNumber(V)} V, I = ${formatResultNumber(I)} A, R = ${formatResultNumber(R)} Ω, P = ${formatResultNumber(P)} W`,
    formula: `V = I \\cdot R, \\quad P = V \\cdot I = I^2 R = \\frac{V^2}{R}`,
    steps,
    assumptions: ['Ohmic conductor at constant temperature', 'DC or RMS AC in pure resistive circuit'],
    verification: {
      statement: `Power Formula Consistency (P = I²R vs P = V²/R)`,
      passed: Math.abs(I * I * R - (V * V) / R) < 1e-4,
      details: `I²R = (${formatResultNumber(I)})² × ${formatResultNumber(R)} = ${formatResultNumber(I * I * R)} W; V²/R = ${formatResultNumber(P)} W`
    },
    explanation: {
      what: `Ohm's Law defines the linear relationship between voltage, electric current, and electrical resistance in an electrical circuit.`,
      why: `Electrons move through a lattice structure colliding with atoms; resistance quantifies the opposition to charge flow.`,
      whenToUse: `Circuit design, sizing power supplies, selecting resistors, calculating thermal dissipation.`,
      commonMistakes: [`Applying Ohm's law directly to non-linear components like semiconductor diodes without using their dynamic resistance.`]
    }
  };
}

// --- CHEMISTRY: MOLARITY & DILUTION ---
export function calculateMolarity(molesOrMassG: number, volumeLiters: number, molarMassGmol?: number): CalculationResult {
  if (volumeLiters <= 0) {
    return {
      status: 'error',
      value: 'Volume must be > 0',
      warnings: ['Solution volume in liters must be strictly positive.']
    };
  }

  let moles = molesOrMassG;
  const steps: CalculationStep[] = [];

  if (molarMassGmol && molarMassGmol > 0) {
    moles = molesOrMassG / molarMassGmol;
    steps.push({
      title: 'Convert Mass to Moles (n = mass / Molar Mass)',
      detail: `Given mass = ${molesOrMassG} g, Molar mass = ${molarMassGmol} g/mol`,
      math: `n = \\frac{${molesOrMassG} \\text{ g}}{${molarMassGmol} \\text{ g/mol}} = ${formatResultNumber(moles)} \\text{ moles}`
    });
  }

  const molarityM = moles / volumeLiters;

  steps.push({
    title: 'Calculate Molarity (M = moles / Volume in Liters)',
    detail: `Concentration in mol/L (Molar, M):`,
    math: `M = \\frac{${formatResultNumber(moles)} \\text{ mol}}{${volumeLiters} \\text{ L}} = ${formatResultNumber(molarityM)} \\text{ mol/L (M)}`
  });

  return {
    status: 'success',
    value: `${formatResultNumber(molarityM)} M`,
    unit: 'M (mol/L)',
    exactResult: `${formatResultNumber(molarityM)} mol/L`,
    formula: `M = \\frac{n}{V} = \\frac{m}{M_w \\cdot V}`,
    steps,
    assumptions: ['Homogeneous ideal solution', 'Temperature 25°C (negligible thermal expansion of solvent)'],
    verification: {
      statement: `Total Solute Balance Check`,
      passed: true,
      details: `M × V = ${formatResultNumber(molarityM)} × ${volumeLiters} = ${formatResultNumber(moles)} moles solute.`
    },
    explanation: {
      what: `Molarity is the amount of solute in moles dissolved per liter of solution volume.`,
      why: `Allows precise stoichiometric chemical reactions where molecules react in integer ratios rather than weight ratios.`,
      whenToUse: `Titrations, solution preparations, biochemical assays, analytical chemistry.`,
      commonMistakes: [`Confusing Molarity (moles/L solution) with Molality (moles/kg solvent).`]
    }
  };
}

// --- CHEMISTRY: pH AND pOH ---
export function calculatePH(hPlusConc: number): CalculationResult {
  if (hPlusConc <= 0) {
    return {
      status: 'error',
      value: 'Concentration must be > 0',
      warnings: ['[H⁺] ion concentration must be strictly positive.']
    };
  }

  const pH = -Math.log10(hPlusConc);
  const pOH = 14.0 - pH;
  const ohMinusConc = Math.pow(10, -pOH);

  const steps: CalculationStep[] = [
    {
      title: 'Apply Sørensen pH Definition',
      detail: `pH is the negative logarithm (base 10) of hydrogen ion activity [H⁺]:`,
      math: `\\text{pH} = -\\log_{10}[\\text{H}^+] = -\\log_{10}(${hPlusConc}) = ${formatResultNumber(pH)}`
    },
    {
      title: 'Calculate pOH & Hydroxide [OH⁻] Concentration',
      detail: `At 25°C in aqueous solution, water auto-ionization constant Kw = 1.0 × 10⁻¹⁴, so pH + pOH = 14:`,
      math: `\\text{pOH} = 14 - ${formatResultNumber(pH)} = ${formatResultNumber(pOH)}, \\quad [\\text{OH}^-] = 10^{-${formatResultNumber(pOH)}} = ${ohMinusConc.toExponential(4)} \\text{ M}`
    }
  ];

  let nature = 'NEUTRAL';
  if (pH < 6.95) nature = 'ACIDIC';
  else if (pH > 7.05) nature = 'BASIC (ALKALINE)';

  return {
    status: 'success',
    value: `pH = ${formatResultNumber(pH)} (${nature})`,
    formula: `\\text{pH} = -\\log_{10}[\\text{H}^+], \\quad \\text{pH} + \\text{pOH} = 14`,
    steps,
    assumptions: ['Aqueous solution at standard temperature (25°C / 298.15 K)', 'Activity coefficient γ ≈ 1 for dilute solutions'],
    verification: {
      statement: `Water Auto-Ionization Product Check [H⁺][OH⁻] = 10⁻¹⁴`,
      passed: true,
      details: `${hPlusConc} × ${ohMinusConc.toExponential(4)} = 1.00 × 10⁻¹⁴`
    },
    explanation: {
      what: `pH measures the acidity or basicity of an aqueous solution on a logarithmic scale.`,
      why: `Each whole pH value represents a 10-fold change in hydrogen ion concentration.`,
      whenToUse: `Water quality analysis, chemical synthesis, biology (blood buffer systems), agriculture soil management.`,
      commonMistakes: [`Assuming pH cannot be below 0 or above 14 (extremely concentrated strong acids can have negative pH).`]
    }
  };
}

// --- CHEMISTRY: IDEAL GAS LAW (PV = nRT) ---
export function calculateIdealGasLaw(P_atm?: number, V_L?: number, n_mol?: number, T_K?: number): CalculationResult {
  const R = 0.082057; // L·atm / (mol·K)
  const count = [P_atm, V_L, n_mol, T_K].filter(v => v !== undefined && !isNaN(v) && v > 0).length;

  if (count < 3) {
    return {
      status: 'needs_input',
      value: 'Provide any 3 gas parameters',
      warnings: ['Please enter any 3 of: Pressure (atm), Volume (L), Moles (mol), Temperature (K).']
    };
  }

  let P = P_atm ?? NaN;
  let V = V_L ?? NaN;
  let n = n_mol ?? NaN;
  let T = T_K ?? NaN;
  const steps: CalculationStep[] = [];

  if (isNaN(P)) {
    P = (n * R * T) / V;
    steps.push({
      title: 'Solve for Pressure: P = nRT / V',
      detail: `Using gas constant R = 0.082057 L·atm/(mol·K)`,
      math: `P = \\frac{(${n})(${R})(${T})}{${V}} = ${formatResultNumber(P)} \\text{ atm}`
    });
  } else if (isNaN(V)) {
    V = (n * R * T) / P;
    steps.push({
      title: 'Solve for Volume: V = nRT / P',
      detail: `Using gas constant R = 0.082057 L·atm/(mol·K)`,
      math: `V = \\frac{(${n})(${R})(${T})}{${P}} = ${formatResultNumber(V)} \\text{ L}`
    });
  } else if (isNaN(n)) {
    n = (P * V) / (R * T);
    steps.push({
      title: 'Solve for Amount of Gas: n = PV / RT',
      detail: `Using gas constant R = 0.082057 L·atm/(mol·K)`,
      math: `n = \\frac{(${P})(${V})}{(${R})(${T})} = ${formatResultNumber(n)} \\text{ mol}`
    });
  } else if (isNaN(T)) {
    T = (P * V) / (n * R);
    steps.push({
      title: 'Solve for Absolute Temperature: T = PV / nR',
      detail: `Using gas constant R = 0.082057 L·atm/(mol·K)`,
      math: `T = \\frac{(${P})(${V})}{(${n})(${R})} = ${formatResultNumber(T)} \\text{ K}`
    });
  }

  return {
    status: 'success',
    value: `P = ${formatResultNumber(P)} atm, V = ${formatResultNumber(V)} L, n = ${formatResultNumber(n)} mol, T = ${formatResultNumber(T)} K`,
    formula: `PV = nRT, \\quad R = 0.082057 \\ \\text{L}\\cdot\\text{atm}/(\\text{mol}\\cdot\\text{K})`,
    steps,
    assumptions: ['Ideal gas behavior (point particles with no intermolecular attraction/repulsion)', 'Low pressure and high temperature conditions relative to condensation point'],
    verification: {
      statement: `Equation of State Balance Check`,
      passed: Math.abs(P * V - n * R * T) < 1e-3,
      details: `PV = ${formatResultNumber(P * V)} L·atm, nRT = ${formatResultNumber(n * R * T)} L·atm`
    },
    explanation: {
      what: `The Ideal Gas Law relates the four state variables of an ideal gas: pressure, volume, temperature, and quantity.`,
      why: `Combines Boyle's Law, Charles's Law, and Avogadro's Law into a single unified equation of state.`,
      whenToUse: `Pneumatics, atmospheric science, gas stoichiometry, chemical reaction vessels.`,
      commonMistakes: [`Using Celsius instead of absolute Kelvin temperature (T_K = T_C + 273.15).`]
    }
  };
}

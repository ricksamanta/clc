/**
 * Smart Universal Input Router
 * Parses natural queries (e.g. "GCD of 48 and 18", "Solve x^2 + 5x + 6 = 0", "25% of 480", "10 km to miles", "Force for 5kg and 4m/s^2")
 * into validated structured calculator dispatches.
 */

import { CALCULATOR_REGISTRY, getCalculatorById } from '../data/registry';
import { CalculationResult } from '../types';
import { SafeExpressionParser } from './safeParser';

export interface RoutedIntent {
  calculatorId: string;
  matchedInputs: Record<string, any>;
  confidence: number;
  explanation: string;
  immediateResult?: CalculationResult;
}

export function routeNaturalQuery(query: string): RoutedIntent | null {
  const q = query.trim();
  if (!q) return null;

  // 1. Percentage: "25% of 480" or "what is 15 percent of 200"
  const pctOfMatch = q.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/i) ||
                     q.match(/(?:what\s+is\s+)?(\d+(?:\.\d+)?)\s*(?:percent|%)\s*of\s*(\d+(?:\.\d+)?)/i);
  if (pctOfMatch) {
    const x = Number(pctOfMatch[1]);
    const y = Number(pctOfMatch[2]);
    const calc = getCalculatorById('percentage-calculator');
    if (calc) {
      const inputs = { calcType: 'of', x, y };
      return {
        calculatorId: 'percentage-calculator',
        matchedInputs: inputs,
        confidence: 0.98,
        explanation: `Identified Percentage calculation: ${x}% of ${y}`,
        immediateResult: calc.calculate(inputs)
      };
    }
  }

  // 2. GCD: "gcd of 48 and 18", "gcd(48, 18)", "greatest common divisor of 12 and 18"
  const gcdMatch = q.match(/(?:gcd|hcf|greatest\s+common\s+divisor)(?:\s+of|\s*\(|\s+between)?\s*(\d+)(?:\s*,|\s+and|\s*&)\s*(\d+)\)?/i);
  if (gcdMatch) {
    const a = Number(gcdMatch[1]);
    const b = Number(gcdMatch[2]);
    const calc = getCalculatorById('gcd-lcm');
    if (calc) {
      const inputs = { a, b };
      return {
        calculatorId: 'gcd-lcm',
        matchedInputs: inputs,
        confidence: 0.99,
        explanation: `Identified GCD / LCM query for integers ${a} and ${b}`,
        immediateResult: calc.calculate(inputs)
      };
    }
  }

  // 3. Prime factor: "prime factorization of 360", "factors of 24"
  const primeMatch = q.match(/(?:prime\s+factor(?:ization|s)?|factorize|factors\s+of)\s*(\d+)/i);
  if (primeMatch) {
    const n = Number(primeMatch[1]);
    const calc = getCalculatorById('prime-factorization');
    if (calc) {
      const inputs = { n };
      return {
        calculatorId: 'prime-factorization',
        matchedInputs: inputs,
        confidence: 0.95,
        explanation: `Identified Prime Factorization query for ${n}`,
        immediateResult: calc.calculate(inputs)
      };
    }
  }

  // 4. Force / Newton: "force when mass is 5 kg and acceleration is 4 m/s2", "force for 5 kg 4 m/s^2"
  const forceMatch = q.match(/force.*?(?:mass\s*(?:is|=|:)?\s*(\d+(?:\.\d+)?)\s*(?:kg)?).*?(?:accel(?:eration)?\s*(?:is|=|:)?\s*(\d+(?:\.\d+)?))/i) ||
                     q.match(/force.*?(?:for)?\s*(\d+(?:\.\d+)?)\s*kg.*?(?:and)?\s*(\d+(?:\.\d+)?)\s*(?:m\/s|m\/s2|m\/s\^2)/i);
  if (forceMatch) {
    const mass = Number(forceMatch[1]);
    const accel = Number(forceMatch[2]);
    const calc = getCalculatorById('physics-force');
    if (calc) {
      const inputs = { mass, accel };
      return {
        calculatorId: 'physics-force',
        matchedInputs: inputs,
        confidence: 0.96,
        explanation: `Identified Newton's Second Law Force calculation: m = ${mass} kg, a = ${accel} m/s²`,
        immediateResult: calc.calculate(inputs)
      };
    }
  }

  // 5. Loan / EMI: "loan of 500000 at 8.5% for 5 years", "emi for 500000 8.5 5"
  const loanMatch = q.match(/(?:loan|emi|mortgage).*?(\d[\d,]*)\s*(?:at|@)\s*(\d+(?:\.\d+)?)\s*%\s*(?:for)?\s*(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/i);
  if (loanMatch) {
    const principal = Number(loanMatch[1].replace(/,/g, ''));
    const rate = Number(loanMatch[2]);
    const tenure = Number(loanMatch[3]);
    const calc = getCalculatorById('loan-emi');
    if (calc) {
      const inputs = { principal, rate, tenure };
      return {
        calculatorId: 'loan-emi',
        matchedInputs: inputs,
        confidence: 0.97,
        explanation: `Identified Loan EMI calculation: Principal ${principal.toLocaleString()}, Rate ${rate}%, Tenure ${tenure} years`,
        immediateResult: calc.calculate(inputs)
      };
    }
  }

  // 6. Base conversion: "convert binary 101101 to decimal", "101101 binary to dec"
  const baseMatch = q.match(/(?:convert\s+)?(?:binary|bin)\s*([01]+)\s*(?:to|in)\s*(?:decimal|dec)/i) ||
                    q.match(/([01]+)\s*binary\s*(?:to|in)\s*decimal/i);
  if (baseMatch) {
    const val = baseMatch[1];
    const calc = getCalculatorById('base-converter');
    if (calc) {
      const inputs = { val, fromBase: 2, toBase: 10 };
      return {
        calculatorId: 'base-converter',
        matchedInputs: inputs,
        confidence: 0.98,
        explanation: `Identified Binary to Decimal conversion for "${val}"`,
        immediateResult: calc.calculate(inputs)
      };
    }
  }

  // 7. Unit conversion: "convert 10 km to miles", "100 c to f", "50 kg in lbs"
  const unitMatch = q.match(/(?:convert\s+)?(\d+(?:\.\d+)?)\s*([a-zA-Z°]+)\s*(?:to|in|into)\s*([a-zA-Z°]+)/i);
  if (unitMatch) {
    const val = Number(unitMatch[1]);
    const fromUnitRaw = unitMatch[2].toLowerCase().replace('°', '');
    const toUnitRaw = unitMatch[3].toLowerCase().replace('°', '');

    // Map common aliases
    const mapUnit = (u: string) => {
      if (['km', 'kilometer', 'kilometers'].includes(u)) return { cat: 'length', id: 'km' };
      if (['m', 'meter', 'meters'].includes(u)) return { cat: 'length', id: 'm' };
      if (['mi', 'mile', 'miles'].includes(u)) return { cat: 'length', id: 'mi' };
      if (['c', 'celsius'].includes(u)) return { cat: 'temperature', id: 'C' };
      if (['f', 'fahrenheit'].includes(u)) return { cat: 'temperature', id: 'F' };
      if (['k', 'kelvin'].includes(u)) return { cat: 'temperature', id: 'K' };
      if (['kg', 'kilogram', 'kilograms'].includes(u)) return { cat: 'mass', id: 'kg' };
      if (['lb', 'lbs', 'pound', 'pounds'].includes(u)) return { cat: 'mass', id: 'lb' };
      if (['gb', 'gigabyte', 'gigabytes'].includes(u)) return { cat: 'digital', id: 'GB' };
      if (['mb', 'megabyte', 'megabytes'].includes(u)) return { cat: 'digital', id: 'MB' };
      return null;
    };

    const s = mapUnit(fromUnitRaw);
    const t = mapUnit(toUnitRaw);

    if (s && t && s.cat === t.cat) {
      const calc = getCalculatorById('universal-unit-converter');
      if (calc) {
        const inputs = { category: s.cat, val, fromUnit: s.id, toUnit: t.id };
        return {
          calculatorId: 'universal-unit-converter',
          matchedInputs: inputs,
          confidence: 0.95,
          explanation: `Identified Unit Conversion: ${val} ${s.id} to ${t.id}`,
          immediateResult: calc.calculate(inputs)
        };
      }
    }
  }

  // 8. General expression evaluation fallback
  const parser = new SafeExpressionParser('DEG');
  const exprRes = parser.parseAndEvaluate(q);
  if (exprRes.success && !isNaN(exprRes.value)) {
    return {
      calculatorId: 'standard',
      matchedInputs: { expression: q },
      confidence: 0.9,
      explanation: `Mathematical expression evaluated`,
      immediateResult: {
        status: 'success',
        value: exprRes.value.toString(),
        exactResult: exprRes.exact,
        formula: q,
        steps: exprRes.steps?.map(s => ({ title: 'Step', detail: s }))
      }
    };
  }

  return null;
}

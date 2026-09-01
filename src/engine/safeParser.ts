/**
 * Safe Mathematical Expression Parser and Evaluator
 * 
 * Implements a recursive descent parser for arithmetic, powers, trigonometric,
 * logarithmic, factorial, roots, and percentage calculations with zero eval().
 */

import { AngleMode } from '../types';

export interface ParseResult {
  success: boolean;
  value: number;
  exact?: string;
  steps?: string[];
  error?: string;
}

export function stripFloatingPoint(val: number, precision: number = 12): number {
  if (isNaN(val) || !isFinite(val)) return val;
  const factor = Math.pow(10, precision);
  return Math.round(val * factor) / factor;
}

export function formatResultNumber(val: number, maxDecimals: number = 10): string {
  if (isNaN(val)) return 'NaN';
  if (!isFinite(val)) return val > 0 ? 'Infinity' : '-Infinity';

  // Fix floating point issues like 0.1 + 0.2 = 0.30000000000000004
  const stripped = stripFloatingPoint(val, 12);
  
  // If integer
  if (Math.abs(stripped - Math.round(stripped)) < 1e-11) {
    return Math.round(stripped).toString();
  }

  // Handle scientific notation for very large or very small
  if (Math.abs(stripped) >= 1e14 || (Math.abs(stripped) > 0 && Math.abs(stripped) < 1e-6)) {
    return stripped.toExponential(6);
  }

  const str = stripped.toFixed(maxDecimals);
  return str.replace(/\.?0+$/, '');
}

// Factorial calculation
export function factorial(n: number): number {
  if (n < 0 || Math.floor(n) !== n) throw new Error('Factorial requires non-negative integer');
  if (n > 170) return Infinity; // JS Number limit
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// Combinations nCr
export function nCr(n: number, r: number): number {
  if (r < 0 || n < 0 || r > n || Math.floor(n) !== n || Math.floor(r) !== r) {
    throw new Error('nCr requires valid non-negative integers where n >= r');
  }
  if (r === 0 || r === n) return 1;
  if (r > n / 2) r = n - r;
  let res = 1;
  for (let i = 1; i <= r; i++) {
    res = (res * (n - i + 1)) / i;
  }
  return res;
}

// Permutations nPr
export function nPr(n: number, r: number): number {
  if (r < 0 || n < 0 || r > n || Math.floor(n) !== n || Math.floor(r) !== r) {
    throw new Error('nPr requires valid non-negative integers where n >= r');
  }
  let res = 1;
  for (let i = 0; i < r; i++) {
    res *= (n - i);
  }
  return res;
}

export class SafeExpressionParser {
  private pos = 0;
  private tokens: string[] = [];
  private angleMode: AngleMode = 'DEG';
  private steps: string[] = [];

  constructor(angleMode: AngleMode = 'DEG') {
    this.angleMode = angleMode;
  }

  private toRadians(val: number): number {
    if (this.angleMode === 'DEG') return (val * Math.PI) / 180;
    if (this.angleMode === 'GRAD') return (val * Math.PI) / 200;
    return val;
  }

  private fromRadians(rad: number): number {
    if (this.angleMode === 'DEG') return (rad * 180) / Math.PI;
    if (this.angleMode === 'GRAD') return (rad * 200) / Math.PI;
    return rad;
  }

  private tokenize(expr: string): string[] {
    const rawTokens: string[] = [];
    let i = 0;
    const clean = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/√/g, 'sqrt')
      .replace(/∛/g, 'cbrt')
      .trim();

    while (i < clean.length) {
      const char = clean[i];

      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Numbers with decimals
      if (/[0-9]/.test(char) || (char === '.' && i + 1 < clean.length && /[0-9]/.test(clean[i + 1]))) {
        let numStr = '';
        let hasDot = false;
        while (i < clean.length && (/[0-9]/.test(clean[i]) || (clean[i] === '.' && !hasDot))) {
          if (clean[i] === '.') hasDot = true;
          numStr += clean[i];
          i++;
        }
        rawTokens.push(numStr);
        continue;
      }

      // Alphabetic identifiers (functions, constants)
      if (/[a-zA-Z_]/.test(char)) {
        let ident = '';
        while (i < clean.length && /[a-zA-Z0-9_]/.test(clean[i])) {
          ident += clean[i];
          i++;
        }
        rawTokens.push(ident.toLowerCase());
        continue;
      }

      // Operators and punctuation
      if (['+', '-', '*', '/', '^', '%', '!', '(', ')', ','].includes(char)) {
        rawTokens.push(char);
        i++;
        continue;
      }

      throw new Error(`Unexpected character: "${char}"`);
    }

    // Insert implicit multiplication e.g., 2(3) -> 2*(3), 2pi -> 2*pi, (2)(3) -> (2)*(3)
    const normalized: string[] = [];
    for (let k = 0; k < rawTokens.length; k++) {
      const curr = rawTokens[k];
      const next = rawTokens[k + 1];

      normalized.push(curr);

      if (next) {
        const isNumOrConstOrClose = /^[0-9.]+|pi|e|phi|\)|!$/.test(curr);
        const isFuncOrNumOrOpen = /^[0-9.]+|sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|log|ln|sqrt|cbrt|abs|exp|pi|e|phi|\(/.test(next);

        if (isNumOrConstOrClose && isFuncOrNumOrOpen && !(curr === '!' && next === '!')) {
          if (
            (curr !== '(' && next === '(') ||
            (curr === ')' && next === '(') ||
            (/^[0-9.]+$/.test(curr) && /^[a-zA-Z]+$/.test(next)) ||
            (curr === ')' && /^[0-9.]+$/.test(next)) ||
            (curr === '!' && /^[0-9a-zA-Z(]+$/.test(next))
          ) {
            normalized.push('*');
          }
        }
      }
    }

    return normalized;
  }

  public parseAndEvaluate(expr: string, vars: Record<string, number> = {}): ParseResult {
    try {
      this.steps = [];
      this.tokens = this.tokenize(expr);
      this.pos = 0;

      if (this.tokens.length === 0) {
        return { success: true, value: 0, exact: '0' };
      }

      const val = this.parseExpression(vars);
      if (this.pos < this.tokens.length) {
        throw new Error(`Unexpected token at position: "${this.tokens[this.pos]}"`);
      }

      const stripped = stripFloatingPoint(val, 12);
      return {
        success: true,
        value: stripped,
        exact: this.findExactFraction(stripped),
        steps: this.steps
      };
    } catch (err: any) {
      return {
        success: false,
        value: NaN,
        error: err?.message || 'Invalid mathematical expression'
      };
    }
  }

  private peek(): string | undefined {
    return this.tokens[this.pos];
  }

  private consume(expected?: string): string {
    const token = this.tokens[this.pos];
    if (expected && token !== expected) {
      throw new Error(`Expected "${expected}" but found "${token || 'END'}"`);
    }
    this.pos++;
    return token;
  }

  // Expression = Term (('+' | '-') Term)*
  private parseExpression(vars: Record<string, number>): number {
    let result = this.parseTerm(vars);

    while (this.peek() === '+' || this.peek() === '-') {
      const op = this.consume();
      const nextTerm = this.parseTerm(vars);
      if (op === '+') {
        result += nextTerm;
      } else {
        result -= nextTerm;
      }
    }
    return result;
  }

  // Term = Factor (('*' | '/' | '%') Factor)*
  private parseTerm(vars: Record<string, number>): number {
    let result = this.parseFactor(vars);

    while (this.peek() === '*' || this.peek() === '/' || this.peek() === '%') {
      const op = this.consume();
      const nextFactor = this.parseFactor(vars);
      if (op === '*') {
        result *= nextFactor;
      } else if (op === '/') {
        if (Math.abs(nextFactor) < 1e-15) {
          throw new Error('Division by zero is undefined');
        }
        result /= nextFactor;
      } else if (op === '%') {
        if (Math.abs(nextFactor) < 1e-15) {
          throw new Error('Modulo by zero is undefined');
        }
        result = result % nextFactor;
      }
    }
    return result;
  }

  // Factor = Unary ('^' Factor)* (Right-associative)
  private parseFactor(vars: Record<string, number>): number {
    let base = this.parseUnary(vars);

    if (this.peek() === '^') {
      this.consume('^');
      const exponent = this.parseFactor(vars); // recursion for right-associativity: 2^3^2 = 2^(3^2) = 512
      if (base < 0 && Math.floor(exponent) !== exponent) {
        throw new Error('Even root or fractional exponent of negative number yields a complex value');
      }
      base = Math.pow(base, exponent);
    }
    return base;
  }

  // Unary = ('+' | '-')? Postfix
  private parseUnary(vars: Record<string, number>): number {
    if (this.peek() === '+') {
      this.consume('+');
      return this.parseUnary(vars);
    }
    if (this.peek() === '-') {
      this.consume('-');
      return -this.parseUnary(vars);
    }
    return this.parsePostfix(vars);
  }

  // Postfix = Primary ('!' | '%')*
  private parsePostfix(vars: Record<string, number>): number {
    let val = this.parsePrimary(vars);

    while (this.peek() === '!' || this.peek() === '%') {
      const op = this.consume();
      if (op === '!') {
        val = factorial(val);
      } else if (op === '%') {
        val = val / 100;
      }
    }
    return val;
  }

  // Primary = Number | Constant | Variable | Function | '(' Expression ')'
  private parsePrimary(vars: Record<string, number>): number {
    const token = this.peek();

    if (!token) {
      throw new Error('Unexpected end of expression');
    }

    // Parentheses
    if (token === '(') {
      this.consume('(');
      const val = this.parseExpression(vars);
      this.consume(')');
      return val;
    }

    // Numeric literal
    if (/^[0-9.]+$/.test(token)) {
      this.consume();
      const num = parseFloat(token);
      if (isNaN(num)) throw new Error(`Invalid number: "${token}"`);
      return num;
    }

    // Constants
    if (token === 'pi') {
      this.consume();
      return Math.PI;
    }
    if (token === 'e') {
      this.consume();
      return Math.E;
    }
    if (token === 'phi') {
      this.consume();
      return (1 + Math.sqrt(5)) / 2;
    }
    if (token === 'ans' && vars['ans'] !== undefined) {
      this.consume();
      return vars['ans'];
    }

    // User variable lookup
    if (vars[token] !== undefined) {
      this.consume();
      return vars[token];
    }

    // Functions
    const fnName = token;
    const knownFunctions = [
      'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
      'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
      'log', 'log10', 'log2', 'ln', 'sqrt', 'cbrt', 'abs',
      'exp', 'floor', 'ceil', 'round', 'fact', 'npr', 'ncr', 'gcd', 'lcm'
    ];

    if (knownFunctions.includes(fnName)) {
      this.consume();
      this.consume('(');

      // Evaluate arguments
      const args: number[] = [];
      if (this.peek() !== ')') {
        args.push(this.parseExpression(vars));
        while (this.peek() === ',') {
          this.consume(',');
          args.push(this.parseExpression(vars));
        }
      }
      this.consume(')');

      return this.evaluateFunction(fnName, args);
    }

    throw new Error(`Unknown identifier or syntax error: "${token}"`);
  }

  private evaluateFunction(fnName: string, args: number[]): number {
    if (['sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh', 'sqrt', 'cbrt', 'abs', 'exp', 'floor', 'ceil', 'round', 'ln', 'log10', 'log2', 'log', 'fact', 'asin', 'acos', 'atan'].includes(fnName) && args.length < 1) {
      throw new Error(`Function "${fnName}" requires at least 1 argument`);
    }

    const x = args[0];

    switch (fnName) {
      case 'sin':
        return Math.sin(this.toRadians(x));
      case 'cos':
        return Math.cos(this.toRadians(x));
      case 'tan': {
        const rad = this.toRadians(x);
        if (Math.abs(Math.cos(rad)) < 1e-14) throw new Error('tan is undefined for odd multiples of 90°');
        return Math.tan(rad);
      }
      case 'asin':
        if (x < -1 || x > 1) throw new Error('asin argument must be in [-1, 1]');
        return this.fromRadians(Math.asin(x));
      case 'acos':
        if (x < -1 || x > 1) throw new Error('acos argument must be in [-1, 1]');
        return this.fromRadians(Math.acos(x));
      case 'atan':
        return this.fromRadians(Math.atan(x));
      case 'sinh':
        return Math.sinh(x);
      case 'cosh':
        return Math.cosh(x);
      case 'tanh':
        return Math.tanh(x);
      case 'log10':
      case 'log':
        if (x <= 0) throw new Error('Logarithm is undefined for non-positive numbers');
        if (args.length === 2) {
          const base = args[1];
          if (base <= 0 || base === 1) throw new Error('Logarithm base must be positive and not equal to 1');
          return Math.log(x) / Math.log(base);
        }
        return Math.log10(x);
      case 'log2':
        if (x <= 0) throw new Error('Logarithm is undefined for non-positive numbers');
        return Math.log2(x);
      case 'ln':
        if (x <= 0) throw new Error('Natural logarithm (ln) is undefined for non-positive numbers');
        return Math.log(x);
      case 'sqrt':
        if (x < 0) throw new Error('Square root of negative number is undefined in real mode');
        return Math.sqrt(x);
      case 'cbrt':
        return Math.cbrt(x);
      case 'abs':
        return Math.abs(x);
      case 'exp':
        return Math.exp(x);
      case 'floor':
        return Math.floor(x);
      case 'ceil':
        return Math.ceil(x);
      case 'round':
        return Math.round(x);
      case 'fact':
        return factorial(x);
      case 'npr':
        if (args.length !== 2) throw new Error('nPr requires 2 arguments: nPr(n, r)');
        return nPr(args[0], args[1]);
      case 'ncr':
        if (args.length !== 2) throw new Error('nCr requires 2 arguments: nCr(n, r)');
        return nCr(args[0], args[1]);
      case 'gcd': {
        if (args.length < 2) throw new Error('gcd requires at least 2 arguments');
        let g = Math.abs(Math.round(args[0]));
        for (let i = 1; i < args.length; i++) {
          let b = Math.abs(Math.round(args[i]));
          while (b !== 0) {
            const temp = b;
            b = g % b;
            g = temp;
          }
        }
        return g;
      }
      case 'lcm': {
        if (args.length < 2) throw new Error('lcm requires at least 2 arguments');
        const calcGcd = (a: number, b: number) => {
          let x = Math.abs(a), y = Math.abs(b);
          while (y !== 0) {
            const t = y;
            y = x % y;
            x = t;
          }
          return x;
        };
        let l = Math.abs(Math.round(args[0]));
        for (let i = 1; i < args.length; i++) {
          const b = Math.abs(Math.round(args[i]));
          if (l === 0 || b === 0) return 0;
          l = (l * b) / calcGcd(l, b);
        }
        return l;
      }
      default:
        throw new Error(`Unsupported function: ${fnName}`);
    }
  }

  // Simple exact fraction finder for rational floats (e.g. 0.3333333333 -> 1/3, 0.75 -> 3/4)
  private findExactFraction(val: number): string | undefined {
    if (Math.abs(val - Math.round(val)) < 1e-9) return undefined; // Already integer

    const sign = val < 0 ? '-' : '';
    const x = Math.abs(val);
    const tolerance = 1e-6;

    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = x;

    for (let i = 0; i < 20; i++) {
      const a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;

      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;

      if (k1 > 100000) break;

      const approx = h1 / k1;
      if (Math.abs(approx - x) < tolerance) {
        if (k1 === 1) return undefined;
        return `${sign}${h1}/${k1}`;
      }

      if (Math.abs(b - a) < 1e-9) break;
      b = 1 / (b - a);
    }
    return undefined;
  }
}

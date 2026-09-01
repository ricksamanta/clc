/**
 * Deterministic Financial Calculations Engine
 * Implements Loan/EMI with amortization breakdown, Compound Interest, SIP investment, CAGR, and Business metrics.
 */

import { CalculationResult, CalculationStep } from '../types';
import { formatResultNumber } from './safeParser';

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function calculateLoanEMI(
  principal: number,
  annualRatePct: number,
  tenureYears: number
): CalculationResult & { amortization?: AmortizationRow[] } {
  if (principal <= 0 || annualRatePct < 0 || tenureYears <= 0) {
    return {
      status: 'error',
      value: 'Invalid Loan Parameters',
      warnings: ['Principal and tenure must be positive numbers.']
    };
  }

  const monthlyRate = annualRatePct / (12 * 100);
  const totalMonths = Math.round(tenureYears * 12);

  let monthlyEMI = 0;
  if (monthlyRate === 0) {
    monthlyEMI = principal / totalMonths;
  } else {
    // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyEMI = (principal * monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = monthlyEMI * totalMonths;
  const totalInterest = totalPayment - principal;

  // Generate amortization table
  const amortization: AmortizationRow[] = [];
  let balance = principal;
  for (let m = 1; m <= totalMonths; m++) {
    const interestPart = balance * monthlyRate;
    const principalPart = monthlyEMI - interestPart;
    balance = Math.max(0, balance - principalPart);

    amortization.push({
      month: m,
      payment: monthlyEMI,
      principal: principalPart,
      interest: interestPart,
      balance: balance
    });
  }

  const steps: CalculationStep[] = [
    {
      title: 'Convert Annual Interest to Monthly Periodic Rate (r)',
      detail: `r = Annual Rate / (12 × 100) = ${annualRatePct}% / 1200`,
      math: `r = \\frac{${annualRatePct}}{1200} = ${monthlyRate.toFixed(6)}, \\quad n = ${tenureYears} \\times 12 = ${totalMonths} \\text{ months}`
    },
    {
      title: 'Apply Equated Monthly Installment (EMI) Formula',
      detail: `Standard reducing-balance amortization formula:`,
      math: `\\text{EMI} = P \\cdot \\frac{r(1+r)^n}{(1+r)^n - 1} = ${principal.toLocaleString()} \\times \\frac{${monthlyRate.toFixed(5)}(1+${monthlyRate.toFixed(5)})^{${totalMonths}}}{(1+${monthlyRate.toFixed(5)})^{${totalMonths}} - 1} = ${monthlyEMI.toFixed(2)}`
    },
    {
      title: 'Calculate Total Repayment & Total Interest Paid',
      detail: `Total Payment = EMI × n; Total Interest = Total Payment - Principal`,
      math: `\\text{Total Payment} = ${monthlyEMI.toFixed(2)} \\times ${totalMonths} = ${totalPayment.toFixed(2)} \\\\ \\text{Total Interest} = ${totalPayment.toFixed(2)} - ${principal.toLocaleString()} = ${totalInterest.toFixed(2)}`
    }
  ];

  return {
    status: 'success',
    value: `${monthlyEMI.toFixed(2)} / month`,
    unit: 'Monthly Payment',
    exactResult: `EMI = ${monthlyEMI.toFixed(2)}, Total Interest = ${totalInterest.toFixed(2)}`,
    formula: `\\text{EMI} = P \\cdot \\frac{r(1+r)^n}{(1+r)^n - 1}`,
    steps,
    assumptions: [
      'Fixed interest rate throughout the entire loan tenure',
      'Monthly compounding with regular periodic repayments',
      'Calculation based on user-provided parameters (estimates for planning, not a binding loan offer)'
    ],
    verification: {
      statement: `Amortization Balance Convergence Check`,
      passed: Math.abs(amortization[amortization.length - 1].balance) < 1.0,
      details: `Final principal balance after ${totalMonths} installments reaches zero (${amortization[amortization.length - 1].balance.toFixed(2)}).`
    },
    explanation: {
      what: `Calculates monthly installment, total interest payable, and payment distribution across the life of a loan.`,
      why: `In early months, a larger portion of the payment covers interest because the outstanding principal balance is highest; as principal declines, interest decreases.`,
      whenToUse: `Mortgage planning, car loans, personal loans, budgeting, evaluating refinancing.`,
      commonMistakes: [`Assuming half the loan term means half the interest is paid (interest is heavily front-loaded).`]
    },
    examView: {
      given: [
        `Principal Loan Amount P = ${principal.toLocaleString()}`,
        `Annual Interest Rate = ${annualRatePct}%`,
        `Tenure = ${tenureYears} years (${totalMonths} months)`
      ],
      required: `Monthly EMI and Total Interest`,
      formula: `\\text{EMI} = P \\frac{r(1+r)^n}{(1+r)^n - 1}`,
      substitution: `r = ${monthlyRate.toFixed(5)}, n = ${totalMonths}`,
      calculation: `\\text{EMI} = ${monthlyEMI.toFixed(2)}`,
      finalAnswer: `${monthlyEMI.toFixed(2)} monthly; Total Interest: ${totalInterest.toFixed(2)}`
    },
    amortization: amortization.slice(0, 120), // capped for performant rendering
    chartData: {
      principal: principal,
      totalInterest: totalInterest,
      totalPayment: totalPayment
    }
  };
}

// --- FINANCE: COMPOUND INTEREST ---
export function calculateCompoundInterest(
  principal: number,
  annualRatePct: number,
  years: number,
  compoundFrequencyPerYear: number = 1
): CalculationResult {
  if (principal < 0 || annualRatePct < 0 || years < 0 || compoundFrequencyPerYear <= 0) {
    return {
      status: 'error',
      value: 'Invalid inputs',
      warnings: ['All financial parameters must be positive.']
    };
  }

  const r = annualRatePct / 100;
  const n = compoundFrequencyPerYear;
  const t = years;

  // A = P(1 + r/n)^(nt)
  const amount = principal * Math.pow(1 + r / n, n * t);
  const interestEarned = amount - principal;

  const freqName = n === 1 ? 'Annually (n=1)' : n === 2 ? 'Semi-annually (n=2)' : n === 4 ? 'Quarterly (n=4)' : n === 12 ? 'Monthly (n=12)' : `Custom (n=${n})`;

  const steps: CalculationStep[] = [
    {
      title: 'State the Compound Interest Formula',
      detail: `A = P(1 + r/n)^(nt) where P is principal, r is decimal interest rate, n is compounding periods per year, and t is time in years.`,
      math: `A = P\\left(1 + \\frac{r}{n}\\right)^{nt}`
    },
    {
      title: 'Substitute Inputs',
      detail: `P = ${principal.toLocaleString()}, r = ${r}, n = ${n} (${freqName}), t = ${t} years`,
      math: `A = ${principal.toLocaleString()}\\left(1 + \\frac{${r}}{${n}}\\right)^{(${n})(${t})} = ${principal.toLocaleString()}(${(1 + r / n).toFixed(6)})^{${n * t}} = ${amount.toFixed(2)}`
    },
    {
      title: 'Calculate Total Interest Earned',
      detail: `Interest = Final Amount A - Initial Principal P`,
      math: `\\text{Interest Earned} = ${amount.toFixed(2)} - ${principal.toLocaleString()} = ${interestEarned.toFixed(2)}`
    }
  ];

  return {
    status: 'success',
    value: `${amount.toFixed(2)}`,
    unit: 'Total Value',
    exactResult: `Final Amount = ${amount.toFixed(2)}, Interest = ${interestEarned.toFixed(2)}`,
    formula: `A = P\\left(1 + \\frac{r}{n}\\right)^{nt}`,
    steps,
    assumptions: ['No intermediate withdrawals or additional deposits', 'Constant nominal interest rate', 'Reinvestment of all periodic interest payouts'],
    verification: {
      statement: `Simple vs Compound Interest Comparison Check`,
      passed: interestEarned >= (principal * r * t),
      details: `Compound interest (${interestEarned.toFixed(2)}) ≥ Simple interest (${(principal * r * t).toFixed(2)}) due to growth on interest.`
    },
    explanation: {
      what: `Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods.`,
      why: `Exponential growth allows investments to grow substantially faster than linear simple interest over extended horizons.`,
      whenToUse: `Savings accounts, fixed deposits, retirement planning, long-term bonds.`,
      commonMistakes: [`Using annual compounding rate directly when interest compounds monthly.`]
    }
  };
}

// --- FINANCE: SIP / INVESTMENT FUTURE VALUE ---
export function calculateSIP(
  monthlyInvestment: number,
  expectedReturnRatePct: number,
  timePeriodYears: number
): CalculationResult {
  if (monthlyInvestment <= 0 || expectedReturnRatePct < 0 || timePeriodYears <= 0) {
    return {
      status: 'error',
      value: 'Invalid Investment parameters',
      warnings: ['Monthly investment and time period must be positive.']
    };
  }

  const i = expectedReturnRatePct / (12 * 100);
  const n = timePeriodYears * 12;

  // FV = P * [ ((1 + i)^n - 1) / i ] * (1 + i)
  const factor = Math.pow(1 + i, n);
  const futureValue = monthlyInvestment * ((factor - 1) / i) * (1 + i);
  const totalInvested = monthlyInvestment * n;
  const estimatedReturns = futureValue - totalInvested;

  const steps: CalculationStep[] = [
    {
      title: 'Convert Annual Return to Monthly Rate (i) and Total Months (n)',
      detail: `Monthly rate i = ${expectedReturnRatePct}% / 1200 = ${i.toFixed(6)}, Months n = ${timePeriodYears} × 12 = ${n}`,
      math: `i = ${i.toFixed(6)}, \\quad n = ${n}`
    },
    {
      title: 'Apply Systematic Investment Plan (SIP) Annuity Formula',
      detail: `Future Value of recurring monthly deposits at beginning of period:`,
      math: `\\text{FV} = P \\times \\left[\\frac{(1+i)^n - 1}{i}\\right] \\times (1+i) = ${monthlyInvestment.toLocaleString()} \\times \\left[\\frac{(1+${i.toFixed(4)})^{${n}} - 1}{${i.toFixed(6)}}\\right] \\times (1+${i.toFixed(4)}) = ${futureValue.toFixed(2)}`
    },
    {
      title: 'Breakdown of Capital vs Returns',
      detail: `Total Invested = Monthly × n; Wealth Gain = FV - Total Invested`,
      math: `\\text{Total Invested} = ${monthlyInvestment.toLocaleString()} \\times ${n} = ${totalInvested.toLocaleString()} \\\\ \\text{Estimated Returns} = ${futureValue.toFixed(2)} - ${totalInvested.toLocaleString()} = ${estimatedReturns.toFixed(2)}`
    }
  ];

  return {
    status: 'success',
    value: `${futureValue.toFixed(2)}`,
    unit: 'Total Expected Corpus',
    exactResult: `Corpus: ${futureValue.toFixed(2)}, Invested: ${totalInvested.toFixed(2)}, Gain: ${estimatedReturns.toFixed(2)}`,
    formula: `\\text{FV} = P \\cdot \\left[\\frac{(1+i)^n - 1}{i}\\right] \\cdot (1+i)`,
    steps,
    assumptions: ['Returns compound monthly', 'Regular unmissed monthly installments', 'Past market averages are not guarantees of future performance'],
    verification: {
      statement: `Corpus Greater Than Invested Principal Check`,
      passed: futureValue >= totalInvested,
      details: `Future Value (${futureValue.toFixed(2)}) > Total Invested (${totalInvested.toFixed(2)})`
    },
    explanation: {
      what: `Systematic Investment Plan (SIP) calculates the compounding growth of dollar-cost averaging into an investment portfolio.`,
      why: `Investing equal amounts regularly averages out market volatility and exploits the power of compounding.`,
      whenToUse: `Mutual funds, index fund investing, retirement goal planning.`,
      commonMistakes: [`Assuming returns are guaranteed fixed amounts rather than annualized market approximations.`]
    }
  };
}

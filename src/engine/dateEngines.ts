/**
 * Deterministic Date & Time Platform Engine
 * Real calendar arithmetic considering variable month lengths, leap years, and business days.
 */

import { CalculationResult, CalculationStep } from '../types';

export function calculateAge(birthDateStr: string, asOfDateStr?: string): CalculationResult {
  const birth = new Date(birthDateStr);
  const asOf = asOfDateStr ? new Date(asOfDateStr) : new Date();

  if (isNaN(birth.getTime()) || isNaN(asOf.getTime())) {
    return {
      status: 'error',
      value: 'Invalid Date',
      warnings: ['Please enter a valid YYYY-MM-DD date format.']
    };
  }

  if (birth > asOf) {
    return {
      status: 'error',
      value: 'Future Birthdate',
      warnings: ['Date of birth cannot be in the future relative to the target date.']
    };
  }

  let years = asOf.getFullYear() - birth.getFullYear();
  let months = asOf.getMonth() - birth.getMonth();
  let days = asOf.getDate() - birth.getDate();

  if (days < 0) {
    // Borrow days from previous month
    months--;
    const prevMonthDays = new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffTime = Math.abs(asOf.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  // Next birthday calculation
  const nextBirthday = new Date(asOf.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < asOf) {
    nextBirthday.setFullYear(asOf.getFullYear() + 1);
  }
  const daysToBirthday = Math.ceil((nextBirthday.getTime() - asOf.getTime()) / (1000 * 60 * 60 * 24));

  const steps: CalculationStep[] = [
    {
      title: 'Calendar-Aware Elapsed Calculation',
      detail: `Comparing birth date (${birth.toDateString()}) with target date (${asOf.toDateString()}):`,
      math: `\\text{Age} = ${years} \\text{ Years, } ${months} \\text{ Months, } ${days} \\text{ Days}`
    },
    {
      title: 'Alternative Time Unit Equivalents',
      detail: `Total Days Lived: ${totalDays.toLocaleString()} days\nTotal Weeks: ${totalWeeks.toLocaleString()} weeks\nTotal Hours: ${totalHours.toLocaleString()} hours`,
      math: `\\text{Total Days} = ${totalDays.toLocaleString()} \\text{ days}`
    },
    {
      title: 'Next Birthday Countdown',
      detail: `Next birthday falls on ${nextBirthday.toDateString()} (in ${daysToBirthday} days).`,
      math: `\\Delta t = ${daysToBirthday} \\text{ days remaining}`
    }
  ];

  return {
    status: 'success',
    value: `${years} Years, ${months} Months, ${days} Days`,
    unit: `${totalDays.toLocaleString()} total days`,
    exactResult: `${years}y ${months}m ${days}d`,
    formula: `\\text{Age} = \\text{Target Date} - \\text{Date of Birth}`,
    steps,
    explanation: {
      what: `Calculates exact chronological age in years, months, and days based on the Gregorian calendar.`,
      why: `Handles varying month lengths (28, 29, 30, 31 days) and leap years without assuming uniform 30-day or 365-day approximations.`,
      whenToUse: `Legal age verification, medical milestone tracking, insurance underwriting, milestone birthdays.`,
      commonMistakes: [`Dividing total days by 365.25 (causes off-by-one errors for individual birthdays).`]
    }
  };
}

export function calculateDateDifference(startDateStr: string, endDateStr: string): CalculationResult {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      status: 'error',
      value: 'Invalid Date',
      warnings: ['Please enter valid dates.']
    };
  }

  const isReversed = start > end;
  const d1 = isReversed ? end : start;
  const d2 = isReversed ? start : end;

  const diffMs = d2.getTime() - d1.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Count business working days (Mon-Fri)
  let workingDays = 0;
  let weekendDays = 0;
  const cur = new Date(d1);
  while (cur < d2) {
    const day = cur.getDay();
    if (day === 0 || day === 6) {
      weekendDays++;
    } else {
      workingDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  const steps: CalculationStep[] = [
    {
      title: 'Total Calendar Days',
      detail: `Elapsed time from ${d1.toDateString()} to ${d2.toDateString()}:`,
      math: `\\Delta D = ${totalDays.toLocaleString()} \\text{ calendar days}`
    },
    {
      title: 'Working Business Days vs Weekends',
      detail: `Mon-Fri Workdays: ${workingDays.toLocaleString()}\nSaturday/Sunday Weekend Days: ${weekendDays.toLocaleString()}`,
      math: `\\text{Business Days} = ${workingDays.toLocaleString()}, \\quad \\text{Weekends} = ${weekendDays.toLocaleString()}`
    }
  ];

  return {
    status: 'success',
    value: `${totalDays.toLocaleString()} Days (${workingDays.toLocaleString()} Working Days)`,
    unit: 'Days',
    exactResult: `${totalDays} days (${workingDays} working days)`,
    formula: `\\Delta D = D_2 - D_1`,
    steps,
    explanation: {
      what: `Calculates exact duration and business day count between two calendar dates.`,
      why: `Project timelines and contracts rely on business days excluding weekend pauses.`,
      whenToUse: `Sprint planning, project deadlines, loan interest period counting, leave calculations.`,
      commonMistakes: [`Forgetting that public bank holidays are regional and not universal.`]
    }
  };
}

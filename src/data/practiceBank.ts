/**
 * CalcRick Practice Question Generator & Bank
 * Generates verified questions across Math, Science, Finance, and Programming with step-by-step solutions.
 */

import { PracticeQuestion, CalculatorCategory } from '../types';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'pq-1',
    category: 'math',
    topic: 'Number Theory: Euclidean GCD',
    difficulty: 'easy',
    question: 'Find the Greatest Common Divisor (GCD) of 48 and 18 using the Euclidean Algorithm.',
    correctAnswer: 6,
    hints: [
      'Apply the Euclidean division: 48 = q × 18 + r',
      'The remainder becomes the new divisor until the remainder is 0.'
    ],
    solutionSteps: [
      { title: 'Step 1: Divide 48 by 18', detail: '48 = 2 × 18 + 12 (Remainder is 12)' },
      { title: 'Step 2: Divide 18 by 12', detail: '18 = 1 × 12 + 6 (Remainder is 6)' },
      { title: 'Step 3: Divide 12 by 6', detail: '12 = 2 × 6 + 0 (Remainder is 0)' },
      { title: 'Conclusion', detail: 'The last non-zero remainder is 6. Therefore GCD(48, 18) = 6.' }
    ],
    relatedCalculatorId: 'gcd-lcm',
    relatedFormula: 'a = q \\cdot b + r'
  },
  {
    id: 'pq-2',
    category: 'math',
    topic: 'Algebra: Quadratic Roots',
    difficulty: 'medium',
    question: 'Find the positive root of the quadratic equation x² + 5x - 24 = 0.',
    correctAnswer: 3,
    hints: [
      'Use the quadratic formula with a=1, b=5, c=-24',
      'Δ = b² - 4ac = 25 - 4(1)(-24) = 25 + 96 = 121'
    ],
    solutionSteps: [
      { title: 'Compute Discriminant', detail: 'Δ = 5² - 4(1)(-24) = 25 + 96 = 121. √121 = 11.' },
      { title: 'Apply Quadratic Formula', detail: 'x = (-5 ± 11) / 2' },
      { title: 'Find Both Roots', detail: 'x₁ = (-5 + 11)/2 = 6/2 = 3; x₂ = (-5 - 11)/2 = -16/2 = -8.' },
      { title: 'Select Positive Root', detail: 'Positive root is x = 3.' }
    ],
    relatedCalculatorId: 'quadratic-solver',
    relatedFormula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'
  },
  {
    id: 'pq-3',
    category: 'math',
    topic: 'Geometry: Pythagorean Theorem',
    difficulty: 'easy',
    question: 'A right-angled triangle has legs of length a = 5 cm and b = 12 cm. What is the length of the hypotenuse c in cm?',
    correctAnswer: 13,
    unit: 'cm',
    hints: [
      'c² = a² + b²',
      '5² + 12² = 25 + 144 = 169'
    ],
    solutionSteps: [
      { title: 'State Pythagorean Theorem', detail: 'c² = a² + b²' },
      { title: 'Substitute side lengths', detail: 'c² = 5² + 12² = 25 + 144 = 169' },
      { title: 'Take Square Root', detail: 'c = √169 = 13 cm' }
    ],
    relatedCalculatorId: 'right-triangle',
    relatedFormula: 'a^2 + b^2 = c^2'
  },
  {
    id: 'pq-4',
    category: 'science',
    topic: 'Physics: Newton’s Second Law',
    difficulty: 'easy',
    question: 'A net force of 45 N acts on a block with a mass of 9 kg. What is the acceleration of the block in m/s²?',
    correctAnswer: 5,
    unit: 'm/s²',
    hints: [
      'Recall Newton’s Second Law: F = m × a',
      'Rearrange for acceleration: a = F / m'
    ],
    solutionSteps: [
      { title: 'State Formula', detail: 'F = m · a \\implies a = F / m' },
      { title: 'Substitute values', detail: 'a = 45 N / 9 kg = 5 m/s²' }
    ],
    relatedCalculatorId: 'physics-force',
    relatedFormula: 'F = m \\cdot a'
  },
  {
    id: 'pq-5',
    category: 'science',
    topic: 'Physics: Ohm’s Law',
    difficulty: 'easy',
    question: 'A light bulb with a resistance of 24 Ω is connected to a 12 V power supply. Calculate the current flowing in Amperes.',
    correctAnswer: 0.5,
    unit: 'A',
    hints: [
      'V = I × R',
      'I = V / R = 12 / 24'
    ],
    solutionSteps: [
      { title: 'Ohm’s Law', detail: 'I = V / R' },
      { title: 'Substitute Values', detail: 'I = 12 V / 24 Ω = 0.5 A' }
    ],
    relatedCalculatorId: 'ohms-law',
    relatedFormula: 'V = I \\cdot R'
  },
  {
    id: 'pq-6',
    category: 'programming',
    topic: 'Computer Science: Binary Conversion',
    difficulty: 'easy',
    question: 'Convert the 6-bit binary number 101101 to its decimal (Base 10) integer value.',
    correctAnswer: 45,
    hints: [
      'Calculate positional powers of 2 from right to left: 1, 2, 4, 8, 16, 32',
      '101101 = 32 + 0 + 8 + 4 + 0 + 1'
    ],
    solutionSteps: [
      { title: 'Positional Weights', detail: '(1 × 2⁵) + (0 × 2⁴) + (1 × 2³) + (1 × 2²) + (0 × 2¹) + (1 × 2⁰)' },
      { title: 'Sum Powers', detail: '32 + 0 + 8 + 4 + 0 + 1 = 45' }
    ],
    relatedCalculatorId: 'base-converter'
  },
  {
    id: 'pq-7',
    category: 'finance',
    topic: 'Finance: Percentage Calculation',
    difficulty: 'easy',
    question: 'A laptop originally priced at $800 is offered with a 25% discount. What is the final discounted sale price in dollars?',
    correctAnswer: 600,
    unit: '$',
    hints: [
      'Discount Amount = 25% of 800 = 0.25 × 800',
      'Final Price = Original Price - Discount'
    ],
    solutionSteps: [
      { title: 'Compute Discount Amount', detail: '0.25 × $800 = $200' },
      { title: 'Subtract Discount', detail: '$800 - $200 = $600' }
    ],
    relatedCalculatorId: 'percentage-calculator'
  }
];

export function getPracticeQuestionsByCategory(category?: CalculatorCategory): PracticeQuestion[] {
  if (!category) return PRACTICE_QUESTIONS;
  return PRACTICE_QUESTIONS.filter(q => q.category === category);
}

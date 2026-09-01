export type CalculatorCategory =
  | 'math'
  | 'science'
  | 'engineering'
  | 'finance'
  | 'programming'
  | 'conversion'
  | 'everyday'
  | 'date';

export type CalculationMode = 'quick' | 'learn' | 'exam';
export type AngleMode = 'DEG' | 'RAD' | 'GRAD';
export type PrecisionMode = 'auto' | '2' | '3' | '4' | '6' | '8' | '10';
export type ThemeMode = 'dark' | 'light' | 'system';

export interface CalculationStep {
  title: string;
  detail: string;
  math?: string;
  note?: string;
}

export interface VerificationResult {
  statement: string;
  passed: boolean;
  details: string;
}

export interface ExplanationData {
  what: string;
  why: string;
  whenToUse: string;
  commonMistakes?: string[];
}

export interface CalculationResult {
  status: 'success' | 'error' | 'warning' | 'needs_input';
  value: string | number;
  exactResult?: string;
  approximateResult?: string;
  unit?: string;
  formula?: string;
  latexFormula?: string;
  steps?: CalculationStep[];
  assumptions?: string[];
  verification?: VerificationResult;
  explanation?: ExplanationData;
  warnings?: string[];
  relatedCalculators?: string[];
  relatedFormulas?: string[];
  relatedConcepts?: string[];
  examView?: {
    given: string[];
    required: string;
    formula: string;
    substitution: string;
    calculation: string;
    finalAnswer: string;
    unit?: string;
  };
  chartData?: any;
}

export interface InputFieldDef {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'textarea' | 'checkbox';
  defaultValue?: string | number | boolean;
  placeholder?: string;
  unit?: string;
  options?: { label: string; value: string | number }[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  helpText?: string;
}

export interface CalculatorDefinition {
  id: string;
  name: string;
  slug: string;
  category: CalculatorCategory;
  subcategory?: string;
  description: string;
  keywords: string[];
  icon: string;
  inputs: InputFieldDef[];
  calculate: (inputs: Record<string, any>, options?: { angleMode?: AngleMode; precision?: PrecisionMode }) => CalculationResult;
  quickExamples?: { label: string; values: Record<string, any> }[];
  assumptions?: string[];
  formula?: string;
  tags?: string[];
}

export interface FormulaItem {
  id: string;
  title: string;
  category: CalculatorCategory;
  subcategory: string;
  formula: string;
  variables: { symbol: string; name: string; unit: string }[];
  description: string;
  conditions: string;
  example: { problem: string; solution: string };
  calculatorId?: string;
  relatedFormulas?: string[];
}

export interface RuleItem {
  id: string;
  title: string;
  category: CalculatorCategory;
  summary: string;
  formula?: string;
  explanation: string;
  example: string;
  calculatorId?: string;
}

export interface TheoremItem {
  id: string;
  title: string;
  category: string;
  statement: string;
  conditions: string[];
  formula?: string;
  significance: string;
  example: string;
  calculatorId?: string;
}

export interface LawItem {
  id: string;
  title: string;
  domain: 'physics' | 'chemistry' | 'engineering';
  statement: string;
  formula: string;
  units: string;
  assumptions: string[];
  explanation: string;
  example: string;
  calculatorId?: string;
}

export interface ConceptItem {
  id: string;
  title: string;
  category: CalculatorCategory;
  definition: string;
  importance: string;
  example: string;
  calculatorId?: string;
  relatedTerms: string[];
}

export interface PracticeQuestion {
  id: string;
  category: CalculatorCategory;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  givenData?: Record<string, any>;
  correctAnswer: string | number;
  acceptableTolerance?: number; // for numeric answers
  unit?: string;
  options?: string[]; // for multiple choice
  hints: string[];
  solutionSteps: CalculationStep[];
  relatedCalculatorId?: string;
  relatedFormula?: string;
}

export interface HistoryItem {
  id: string;
  calculatorId: string;
  calculatorName: string;
  timestamp: number;
  expression?: string;
  inputs?: Record<string, any>;
  result: string | number;
  unit?: string;
  category: CalculatorCategory;
}

export interface FavoriteItem {
  id: string;
  type: 'calculator' | 'formula' | 'rule' | 'theorem' | 'law' | 'concept';
  title: string;
  subtitle: string;
  targetId: string;
  category?: string;
  timestamp: number;
}

export interface WorkspaceSession {
  id: string;
  name: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
  items: {
    id: string;
    title: string;
    calculatorId: string;
    inputs: Record<string, any>;
    result: CalculationResult;
  }[];
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  RotateCcw, RotateCw, Delete, CornerDownLeft, Sparkles, 
  HelpCircle, Copy, Check, ChevronDown, ChevronUp, Share2, Volume2, VolumeX
} from 'lucide-react';
import { AngleMode, CalculationResult, CalculationStep, HistoryItem } from '../../types';
import { SafeExpressionParser, formatResultNumber } from '../../engine/safeParser';
import { soundEngine } from '../../engine/soundEngine';

interface StandardCalculatorProps {
  onSaveToHistory?: (item: HistoryItem) => void;
  initialExpression?: string;
}

export const StandardCalculator: React.FC<StandardCalculatorProps> = ({
  onSaveToHistory,
  initialExpression = '',
}) => {
  const [expression, setExpression] = useState<string>(initialExpression || '');
  const [result, setResult] = useState<string>('0');
  const [exactResult, setExactResult] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<CalculationStep[]>([]);
  const [showSteps, setShowSteps] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Advanced & Scientific toggles
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [showScientific, setShowScientific] = useState<boolean>(false);

  // Memory states (MC, MR, M+, M-, MS)
  const [memory, setMemory] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState<boolean>(false);

  // Previous answer state (ANS)
  const [ans, setAns] = useState<number>(0);

  // Undo / Redo history stacks
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sound state
  const [soundOn, setSoundOn] = useState<boolean>(() => soundEngine.isSoundEnabled());

  useEffect(() => {
    return soundEngine.subscribe((val) => setSoundOn(val));
  }, []);

  const handleToggleSound = () => {
    const next = soundEngine.toggleSound();
    setSoundOn(next);
  };

  // Update expression with undo tracking
  const updateExpression = (newExpr: string) => {
    setUndoStack(prev => [...prev.slice(-20), expression]);
    setRedoStack([]);
    setExpression(newExpr);
    setError(null);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    soundEngine.playKeypadClick('fn');
    const prev = undoStack[undoStack.length - 1];
    setRedoStack(r => [...r, expression]);
    setUndoStack(u => u.slice(0, -1));
    setExpression(prev);
    setError(null);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    soundEngine.playKeypadClick('fn');
    const next = redoStack[redoStack.length - 1];
    setUndoStack(u => [...u, expression]);
    setRedoStack(r => r.slice(0, -1));
    setExpression(next);
    setError(null);
  };

  // Append token to expression
  const appendToken = (token: string, type: 'num' | 'op' | 'fn' = 'num') => {
    soundEngine.playKeypadClick(type);
    updateExpression(expression + token);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClear = () => {
    soundEngine.playKeypadClick('clear');
    updateExpression('');
    setResult('0');
    setExactResult(undefined);
    setError(null);
    setSteps([]);
  };

  const handleBackspace = () => {
    soundEngine.playKeypadClick('delete');
    if (expression.length > 0) {
      updateExpression(expression.slice(0, -1));
    }
  };

  const handleToggleSign = () => {
    soundEngine.playKeypadClick('op');
    if (!expression) {
      updateExpression('-');
      return;
    }
    if (expression.startsWith('-(') && expression.endsWith(')')) {
      updateExpression(expression.slice(2, -1));
    } else if (expression.startsWith('-')) {
      updateExpression(expression.slice(1));
    } else {
      updateExpression(`-(${expression})`);
    }
  };

  // Perform safe deterministic evaluation
  const handleCalculate = useCallback(() => {
    if (!expression.trim()) return;

    try {
      const parser = new SafeExpressionParser(angleMode);
      const res = parser.parseAndEvaluate(expression, { ans });

      if (res.success && !isNaN(res.value)) {
        const formatted = formatResultNumber(res.value);
        setResult(formatted);
        setExactResult(res.exact);
        setError(null);
        setAns(res.value);

        // Auditory feedback: Success chime on calculated result
        soundEngine.playSuccessChime();

        // Generate educational steps for expression
        const generatedSteps: CalculationStep[] = [
          {
            title: 'Expression Normalization',
            detail: `Parsed syntax tree with operator precedence (PEMDAS/BODMAS) in ${angleMode} mode.`,
            math: `\\text{Expr} = ${expression}`
          },
          {
            title: 'Evaluated Result',
            detail: `Computed exact numerical floating-point value with subnormal roundoff protection.`,
            math: `\\text{Result} = ${formatted} ${res.exact ? `\\quad (\\text{Exact: } ${res.exact})` : ''}`
          }
        ];
        setSteps(generatedSteps);

        // Save to calculation history
        if (onSaveToHistory) {
          onSaveToHistory({
            id: `hist-${Date.now()}`,
            calculatorId: 'standard',
            calculatorName: 'Standard Calculator',
            timestamp: Date.now(),
            expression: expression,
            result: formatted,
            category: 'math'
          });
        }
      } else {
        soundEngine.playErrorSound();
        setError(res.error || 'Syntax Error');
      }
    } catch (err: any) {
      soundEngine.playErrorSound();
      setError(err?.message || 'Calculation error');
    }
  }, [expression, angleMode, ans, onSaveToHistory]);

  // Memory functions
  const handleMemoryAdd = () => {
    soundEngine.playKeypadClick('memory');
    const currentVal = parseFloat(result) || 0;
    setMemory(m => m + currentVal);
    setHasMemory(true);
  };

  const handleMemorySub = () => {
    soundEngine.playKeypadClick('memory');
    const currentVal = parseFloat(result) || 0;
    setMemory(m => m - currentVal);
    setHasMemory(true);
  };

  const handleMemoryRecall = () => {
    soundEngine.playKeypadClick('memory');
    if (hasMemory) {
      updateExpression(expression + memory.toString());
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleMemoryClear = () => {
    soundEngine.playKeypadClick('clear');
    setMemory(0);
    setHasMemory(false);
  };

  const handleMemoryStore = () => {
    soundEngine.playKeypadClick('memory');
    const currentVal = parseFloat(result) || 0;
    setMemory(currentVal);
    setHasMemory(true);
  };

  // Keyboard navigation & typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is inside a form input outside calculator
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'INPUT' && target.id !== 'calculator-expression-input') {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        appendToken(e.key);
      } else if (['+', '-', '*', '/', '%', '(', ')', '^', '.'].includes(e.key)) {
        appendToken(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, handleCalculate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="standard-calculator-card" className="w-full max-w-xl mx-auto rounded-2xl border border-neutral-800/90 bg-neutral-900/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
      
      {/* Top Toolbar: Angle Mode, Undo/Redo, Clear */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/70 mb-3 text-xs text-neutral-400">
        <div className="flex items-center gap-1.5">
          <button
            id="calc-angle-mode-deg"
            onClick={() => setAngleMode(m => m === 'DEG' ? 'RAD' : m === 'RAD' ? 'GRAD' : 'DEG')}
            className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-750 text-violet-300 font-semibold border border-neutral-700 transition-colors"
            title="Click to toggle Degree / Radian / Gradian"
          >
            {angleMode}
          </button>
          
          {hasMemory && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-950/80 text-[10px] text-violet-300 border border-violet-800/60 font-mono">
              MEM: {memory}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            id="calc-toggle-sound-btn"
            onClick={handleToggleSound}
            className={`p-1.5 rounded border transition-colors ${
              soundOn 
                ? 'bg-violet-950/70 border-violet-800/60 text-violet-300' 
                : 'bg-neutral-800 border-neutral-700 text-neutral-500 hover:text-neutral-300'
            }`}
            title={soundOn ? 'Mute sound effects' : 'Enable audio feedback'}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-violet-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button
            id="calc-undo-btn"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 disabled:opacity-30 transition-opacity"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            id="calc-redo-btn"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 disabled:opacity-30 transition-opacity"
            title="Redo"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            id="calc-toggle-scientific"
            onClick={() => {
              soundEngine.playKeypadClick('fn');
              setShowScientific(!showScientific);
            }}
            className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
              showScientific
                ? 'bg-violet-900/40 text-violet-300 border-violet-700/60'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200'
            }`}
          >
            {showScientific ? 'Compact' : 'Scientific'}
          </button>
        </div>
      </div>

      {/* Calculator Display */}
      <div className="rounded-xl bg-neutral-950 p-4 border border-neutral-800/80 shadow-inner mb-4">
        {/* Editable Expression Field */}
        <div className="flex items-center justify-between text-neutral-400 text-sm font-mono tracking-wide overflow-x-auto min-h-[1.75rem]">
          <input
            id="calculator-expression-input"
            ref={inputRef}
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="Type expression e.g. (25 + 30) × 4"
            className="w-full bg-transparent border-none text-neutral-300 focus:outline-none text-right font-mono placeholder:text-neutral-600 text-base"
          />
        </div>

        {/* Primary Result View */}
        <div className="flex items-end justify-between mt-2 pt-2 border-t border-neutral-900">
          <button
            id="calc-copy-result-btn"
            onClick={handleCopy}
            className="text-neutral-500 hover:text-violet-400 transition-colors p-1"
            title="Copy Result"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <div className="text-right">
            {error ? (
              <span className="text-rose-400 text-base font-mono">{error}</span>
            ) : (
              <div className="space-y-0.5">
                <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white select-all">
                  {result}
                </div>
                {exactResult && (
                  <div className="text-xs font-mono text-violet-400">
                    Exact: {exactResult}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Memory Action Bar */}
      <div className="grid grid-cols-5 gap-1.5 mb-3 text-xs font-mono">
        <button
          id="calc-mem-mc"
          onClick={handleMemoryClear}
          disabled={!hasMemory}
          className="py-1.5 rounded bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 border border-neutral-800 transition-colors"
        >
          MC
        </button>
        <button
          id="calc-mem-mr"
          onClick={handleMemoryRecall}
          disabled={!hasMemory}
          className="py-1.5 rounded bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 border border-neutral-800 transition-colors"
        >
          MR
        </button>
        <button
          id="calc-mem-mplus"
          onClick={handleMemoryAdd}
          className="py-1.5 rounded bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
        >
          M+
        </button>
        <button
          id="calc-mem-mminus"
          onClick={handleMemorySub}
          className="py-1.5 rounded bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
        >
          M-
        </button>
        <button
          id="calc-mem-ms"
          onClick={handleMemoryStore}
          className="py-1.5 rounded bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
        >
          MS
        </button>
      </div>

      {/* Scientific Functions Grid (Expandable) */}
      {showScientific && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 mb-3 text-xs font-mono animate-in fade-in duration-200">
          {[
            { label: 'sin', val: 'sin(' },
            { label: 'cos', val: 'cos(' },
            { label: 'tan', val: 'tan(' },
            { label: 'asin', val: 'asin(' },
            { label: 'acos', val: 'acos(' },
            { label: 'atan', val: 'atan(' },
            { label: 'ln', val: 'ln(' },
            { label: 'log₁₀', val: 'log10(' },
            { label: 'eˣ', val: 'exp(' },
            { label: 'xʸ', val: '^' },
            { label: '√x', val: 'sqrt(' },
            { label: '∛x', val: 'cbrt(' },
            { label: 'π', val: 'pi' },
            { label: 'e', val: 'e' },
            { label: 'n!', val: '!' },
            { label: '1/x', val: '1/(' },
            { label: '|x|', val: 'abs(' },
            { label: 'ANS', val: 'ans' },
          ].map((fn) => (
            <button
              key={fn.label}
              id={`calc-fn-${fn.label}`}
              onClick={() => appendToken(fn.val, 'fn')}
              className="py-2 px-1 rounded-lg bg-neutral-855 hover:bg-neutral-750 text-neutral-300 hover:text-white border border-neutral-800 transition-colors active:scale-95 text-center"
            >
              {fn.label}
            </button>
          ))}
        </div>
      )}

      {/* Standard Keypad Grid */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <button
          id="calc-key-ac"
          onClick={handleClear}
          className="py-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold border border-rose-800/40 text-base transition-colors active:scale-95"
        >
          AC
        </button>
        <button
          id="calc-key-parentheses"
          onClick={() => {
            const openCount = (expression.match(/\(/g) || []).length;
            const closeCount = (expression.match(/\)/g) || []).length;
            if (openCount > closeCount) appendToken(')', 'op');
            else appendToken('(', 'op');
          }}
          className="py-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 font-semibold border border-neutral-700/60 text-base transition-colors active:scale-95"
        >
          ( )
        </button>
        <button
          id="calc-key-percent"
          onClick={() => appendToken('%', 'op')}
          className="py-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 font-semibold border border-neutral-700/60 text-base transition-colors active:scale-95"
        >
          %
        </button>
        <button
          id="calc-key-div"
          onClick={() => appendToken(' ÷ ', 'op')}
          className="py-3 rounded-xl bg-violet-950/60 hover:bg-violet-900/70 text-violet-300 font-bold border border-violet-800/50 text-lg transition-colors active:scale-95"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          id="calc-key-7"
          onClick={() => appendToken('7', 'num')}
          className="py-3 rounded-xl bg-neutral-850 hover:bg-neutral-750 text-white font-medium border border-neutral-800 text-lg transition-colors active:scale-95"
        >
          7
        </button>
        <button
          id="calc-key-8"
          onClick={() => appendToken('8', 'num')}
          className="py-3 rounded-xl bg-neutral-850 hover:bg-neutral-750 text-white font-medium border border-neutral-800 text-lg transition-colors active:scale-95"
        >
          8
        </button>
        <button
          id="calc-key-9"
          onClick={() => appendToken('9', 'num')}
          className="py-3 rounded-xl bg-neutral-850 hover:bg-neutral-750 text-white font-medium border border-neutral-800 text-lg transition-colors active:scale-95"
        >
          9
        </button>
        <button
          id="calc-key-mul"
          onClick={() => appendToken(' × ', 'op')}
          className="py-3 rounded-xl bg-violet-950/60 hover:bg-violet-900/70 text-violet-300 font-bold border border-violet-800/50 text-lg transition-colors active:scale-95"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          id="calc-key-4"
          onClick={() => appendToken('4', 'num')}
          className="py-3 rounded-xl bg-neutral-850 hover:bg-neutral-750 text-white font-medium border border-neutral-800 text-lg transition-colors active:scale-95"
        >
          4
        </button>
        <button
          id="calc-key-5"
          onClick={() => appendToken('5', 'num')}
          className="py-3 rounded-xl bg-neutral-850 hover:bg-neutral-750 text-white font-medium border border-neutral-800 text-lg transition-colors active:scale-95"
        >
          5
        </button>
        <button
          id="calc-key-6"
          onClick={() => appendToken('6', 'num')}
          className="py-3 rounded-xl bg-neutral-850 hover:bg-neutral-750 text-white font-medium border border-neutral-800 text-lg transition-colors active:scale-95"
        >
          6
        </button>
        <button
          id="calc-key-sub"
          onClick={() => appendToken(' − ', 'op')}
          className="py-3 rounded-xl bg-violet-950/60 hover:bg-violet-900/70 text-violet-300 font-bold border border-violet-800/50 text-lg transition-colors active:scale-95"
        >
          −
        </button>

        {/* Row 4 */}
        <button
          id="calc-key-1"
          onClick={() => appendToken('1', 'num')}
          className="py-3 rounded-xl bg-neutral-850 hover:bg-neutral-750 text-white font-medium border border-neutral-800 text-lg transition-colors active:scale-95"
        >
          1
        </button>
        <button
          id="calc-key-2"
          onClick={() => appendToken('2', 'num')}
          className="py-3 rounded-xl bg-neutral-850 hover:bg-neutral-750 text-white font-medium border border-neutral-800 text-lg transition-colors active:scale-95"
        >
          2
        </button>
        <button
          id="calc-key-3"
          onClick={() => appendToken('3', 'num')}
          className="py-3 rounded-xl bg-neutral-850 hover:bg-neutral-750 text-white font-medium border border-neutral-800 text-lg transition-colors active:scale-95"
        >
          3
        </button>
        <button
          id="calc-key-add"
          onClick={() => appendToken(' + ', 'op')}
          className="py-3 rounded-xl bg-violet-950/60 hover:bg-violet-900/70 text-violet-300 font-bold border border-violet-800/50 text-lg transition-colors active:scale-95"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          id="calc-key-plusminus"
          onClick={handleToggleSign}
          className="py-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-medium border border-neutral-700/60 text-base transition-colors active:scale-95"
        >
          ±
        </button>
        <button
          id="calc-key-0"
          onClick={() => appendToken('0', 'num')}
          className="py-3 rounded-xl bg-neutral-850 hover:bg-neutral-750 text-white font-medium border border-neutral-800 text-lg transition-colors active:scale-95"
        >
          0
        </button>
        <button
          id="calc-key-dot"
          onClick={() => appendToken('.', 'num')}
          className="py-3 rounded-xl bg-neutral-850 hover:bg-neutral-750 text-white font-semibold border border-neutral-800 text-lg transition-colors active:scale-95"
        >
          .
        </button>
        <button
          id="calc-key-equals"
          onClick={handleCalculate}
          className="py-3 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white font-bold shadow-lg shadow-violet-900/40 text-xl transition-all active:scale-95"
        >
          =
        </button>
      </div>

      {/* Step Explanation Toggle */}
      {steps.length > 0 && (
        <div className="mt-4 pt-3 border-t border-neutral-800/80">
          <button
            id="calc-toggle-steps-btn"
            onClick={() => setShowSteps(!showSteps)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-950 hover:bg-neutral-900 text-xs font-medium text-violet-300 border border-neutral-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Step-by-Step Mathematical Explanation</span>
            </div>
            {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSteps && (
            <div className="mt-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2.5 text-xs">
              {steps.map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="font-semibold text-neutral-200">{step.title}</div>
                  <div className="text-neutral-400">{step.detail}</div>
                  {step.math && (
                    <div className="p-2 rounded bg-neutral-900 font-mono text-violet-300 border border-neutral-800/60">
                      {step.math}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

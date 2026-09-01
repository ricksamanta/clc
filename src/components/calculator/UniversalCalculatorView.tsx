import React, { useState, useEffect, useRef } from 'react';
import { 
  CalculatorDefinition, CalculationResult, CalculationMode, HistoryItem 
} from '../../types';
import { ResultPanel } from './ResultPanel';
import { Sparkles, GraduationCap, Zap, ArrowLeft, Bookmark, Check } from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';

interface UniversalCalculatorViewProps {
  calculator: CalculatorDefinition;
  onBack?: () => void;
  onSaveToHistory?: (item: HistoryItem) => void;
  onSelectCalculator?: (id: string) => void;
}

export const UniversalCalculatorView: React.FC<UniversalCalculatorViewProps> = ({
  calculator,
  onBack,
  onSaveToHistory,
  onSelectCalculator,
}) => {
  // Initialize form state from default values
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    calculator.inputs.forEach((field) => {
      init[field.id] = field.defaultValue !== undefined ? field.defaultValue : '';
    });
    return init;
  });

  const [mode, setMode] = useState<CalculationMode>('learn');
  const [result, setResult] = useState<CalculationResult>(() => {
    return calculator.calculate(inputs);
  });
  const isFirstRender = useRef(true);

  const handleInputChange = (fieldId: string, val: any) => {
    soundEngine.playKeypadClick('num');
    setInputs(prev => {
      const next = { ...prev, [fieldId]: val };
      return next;
    });
  };

  // Re-calculate when inputs change
  useEffect(() => {
    const res = calculator.calculate(inputs);
    setResult(res);

    if (!isFirstRender.current) {
      if (res.status === 'success') {
        soundEngine.playSuccessChime();
      } else if (res.status === 'error') {
        soundEngine.playErrorSound();
      }
    } else {
      isFirstRender.current = false;
    }

    if (res.status === 'success' && onSaveToHistory) {
      onSaveToHistory({
        id: `calc-${calculator.id}-${Date.now()}`,
        calculatorId: calculator.id,
        calculatorName: calculator.name,
        timestamp: Date.now(),
        inputs: inputs,
        result: res.value,
        unit: res.unit,
        category: calculator.category,
      });
    }
  }, [inputs, calculator]);

  const handleApplyExample = (exampleVals: Record<string, any>) => {
    soundEngine.playSuccessChime();
    setInputs(exampleVals);
  };

  const handleModeChange = (newMode: CalculationMode) => {
    soundEngine.playKeypadClick('fn');
    setMode(newMode);
  };

  return (
    <div id={`calculator-view-${calculator.id}`} className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-950 text-violet-400 border border-violet-800/50">
                {calculator.category} {calculator.subcategory ? `• ${calculator.subcategory}` : ''}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1">{calculator.name}</h1>
            <p className="text-xs text-neutral-400 mt-0.5">{calculator.description}</p>
          </div>
        </div>

        {/* Calculation Modes Toggle (Quick / Learn / Exam) */}
        <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950 p-1">
          <button
            id="mode-quick-btn"
            onClick={() => handleModeChange('quick')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === 'quick' ? 'bg-violet-900/60 text-violet-200 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Quick</span>
          </button>
          <button
            id="mode-learn-btn"
            onClick={() => handleModeChange('learn')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === 'learn' ? 'bg-violet-900/60 text-violet-200 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Learn</span>
          </button>
          <button
            id="mode-exam-btn"
            onClick={() => handleModeChange('exam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === 'exam' ? 'bg-violet-900/60 text-violet-200 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Exam</span>
          </button>
        </div>
      </div>

      {/* Preset Examples Chips */}
      {calculator.quickExamples && calculator.quickExamples.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">Try Example:</span>
          {calculator.quickExamples.map((ex, idx) => (
            <button
              key={idx}
              id={`quick-example-${idx}`}
              onClick={() => handleApplyExample(ex.values)}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-violet-300 border border-neutral-800/80 transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Grid: Inputs Form on Left/Top, Live Result on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Form Inputs Panel */}
        <div className="md:col-span-5 space-y-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/90 p-5 sm:p-6 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300 pb-2 border-b border-neutral-800">
            Parameters
          </h2>

          <div className="space-y-4">
            {calculator.inputs.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`input-${field.id}`}
                    className="text-xs font-semibold text-neutral-300"
                  >
                    {field.label}
                  </label>
                  {field.unit && (
                    <span className="text-[11px] font-mono text-neutral-400">{field.unit}</span>
                  )}
                </div>

                {field.type === 'select' ? (
                  <select
                    id={`input-${field.id}`}
                    value={inputs[field.id]}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-neutral-200 focus:border-violet-600 focus:outline-none"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value.toString()} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    id={`input-${field.id}`}
                    value={inputs[field.id]}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full rounded-xl bg-neutral-950 border border-neutral-800 p-3 text-xs font-mono text-neutral-200 focus:border-violet-600 focus:outline-none"
                  />
                ) : (
                  <input
                    id={`input-${field.id}`}
                    type={field.type}
                    value={inputs[field.id]}
                    onChange={(e) => handleInputChange(field.id, field.type === 'number' ? e.target.value : e.target.value)}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    step={field.step || 'any'}
                    className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm font-mono text-neutral-200 focus:border-violet-600 focus:outline-none"
                  />
                )}
                {field.helpText && (
                  <p className="text-[11px] text-neutral-500">{field.helpText}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live Result & Educational Solution */}
        <div className="md:col-span-7">
          <ResultPanel
            result={result}
            mode={mode}
            calculatorTitle={calculator.name}
          />
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  CheckCircle2, AlertTriangle, XCircle, Copy, Check, Printer, 
  Sparkles, BookOpen, GraduationCap, ShieldCheck, Info
} from 'lucide-react';
import { CalculationResult, CalculationMode } from '../../types';

interface ResultPanelProps {
  result: CalculationResult;
  mode?: CalculationMode;
  calculatorTitle?: string;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  result,
  mode = 'learn',
  calculatorTitle = 'Calculation',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${calculatorTitle} Result:\nAnswer: ${result.value}\n${result.formula ? `Formula: ${result.formula}\n` : ''}${
      result.steps ? `Steps:\n${result.steps.map(s => `- ${s.title}: ${s.detail}`).join('\n')}` : ''
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (result.status === 'needs_input') {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-center text-neutral-400 text-sm">
        <Info className="w-6 h-6 text-violet-400 mx-auto mb-2" />
        <p className="font-medium text-neutral-300">Ready to calculate</p>
        <p className="text-xs text-neutral-500 mt-1">{result.warnings?.[0] || 'Enter parameters to view result and step-by-step solution.'}</p>
      </div>
    );
  }

  if (result.status === 'error') {
    return (
      <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-5 text-rose-300 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-sm text-rose-400">
          <XCircle className="w-5 h-5 text-rose-400" />
          <span>Calculation Error</span>
        </div>
        <p className="text-xs text-rose-200/80">{result.value}</p>
        {result.warnings?.map((w, idx) => (
          <p key={idx} className="text-xs text-rose-400/90 font-mono">• {w}</p>
        ))}
      </div>
    );
  }

  return (
    <div id="calculation-result-panel" className="rounded-2xl border border-neutral-800/90 bg-neutral-900/90 p-5 sm:p-6 shadow-xl space-y-5">
      
      {/* Result Value Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              {result.unit ? `Result (${result.unit})` : 'Final Calculated Result'}
            </span>
            {result.exactResult && (
              <span className="rounded bg-violet-950 px-1.5 py-0.5 text-[10px] font-mono text-violet-300 border border-violet-800/50">
                Exact
              </span>
            )}
          </div>
          <div className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight mt-1 select-all">
            {result.value}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="result-copy-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-xs font-medium text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            id="result-print-btn"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-xs font-medium text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Print Solution</span>
          </button>
        </div>
      </div>

      {/* EXAM VIEW MODE */}
      {mode === 'exam' && result.examView && (
        <div className="rounded-xl bg-neutral-950 p-4 border border-neutral-800 space-y-3 font-mono text-xs text-neutral-300">
          <div className="font-bold text-violet-400 uppercase tracking-wider text-[11px] pb-1 border-b border-neutral-900 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Exam Solution Format</span>
          </div>
          
          <div className="space-y-1">
            <div className="text-neutral-500 font-semibold">GIVEN:</div>
            {result.examView.given.map((g, idx) => (
              <div key={idx} className="pl-3 text-neutral-300">• {g}</div>
            ))}
          </div>

          <div className="space-y-1">
            <div className="text-neutral-500 font-semibold">REQUIRED:</div>
            <div className="pl-3 text-neutral-300">• {result.examView.required}</div>
          </div>

          <div className="space-y-1">
            <div className="text-neutral-500 font-semibold">FORMULA:</div>
            <div className="pl-3 text-violet-300">{result.examView.formula}</div>
          </div>

          <div className="space-y-1">
            <div className="text-neutral-500 font-semibold">SUBSTITUTION:</div>
            <div className="pl-3 text-neutral-300">{result.examView.substitution}</div>
          </div>

          <div className="space-y-1 pt-1 border-t border-neutral-900">
            <div className="text-emerald-400 font-semibold">FINAL ANSWER:</div>
            <div className="pl-3 text-white font-bold text-sm">{result.examView.finalAnswer}</div>
          </div>
        </div>
      )}

      {/* LEARN MODE: Mathematical Steps */}
      {mode !== 'quick' && result.steps && result.steps.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Step-by-Step Solution Breakdown</span>
          </div>

          <div className="space-y-2.5">
            {result.steps.map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-950 text-[10px] text-violet-300 border border-violet-800/60 font-mono">
                    {idx + 1}
                  </span>
                  <span>{step.title}</span>
                </div>
                <p className="text-xs text-neutral-300 whitespace-pre-line pl-7 leading-relaxed">
                  {step.detail}
                </p>
                {step.math && (
                  <div className="ml-7 p-2.5 rounded-lg bg-neutral-900 text-xs font-mono text-violet-300 border border-neutral-800/60 overflow-x-auto whitespace-pre">
                    {step.math}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Engine Box */}
      {result.verification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Mathematical Verification Verified</span>
          </div>
          <p className="text-xs text-emerald-300/90 leading-relaxed">
            {result.verification.details}
          </p>
        </div>
      )}

      {/* Assumptions Box */}
      {result.assumptions && result.assumptions.length > 0 && (
        <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1.5 text-xs">
          <span className="font-semibold text-neutral-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-neutral-500" />
            <span>Assumptions & Conventions Applied:</span>
          </span>
          <ul className="list-disc pl-5 text-neutral-400 space-y-0.5">
            {result.assumptions.map((asm, idx) => (
              <li key={idx}>{asm}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Educational Explanation Box */}
      {mode === 'learn' && result.explanation && (
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2.5 text-xs">
          <div className="font-bold text-violet-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <BookOpen className="w-3.5 h-3.5 text-violet-400" />
            <span>Conceptual Understanding</span>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-neutral-300">What it is: </span>
            <span className="text-neutral-400 leading-relaxed">{result.explanation.what}</span>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-neutral-300">Why it works: </span>
            <span className="text-neutral-400 leading-relaxed">{result.explanation.why}</span>
          </div>
          {result.explanation.commonMistakes && result.explanation.commonMistakes.length > 0 && (
            <div className="space-y-1 pt-1 border-t border-neutral-900">
              <span className="font-semibold text-amber-400">Common Pitfalls to Avoid: </span>
              <ul className="list-disc pl-5 text-neutral-400 space-y-0.5">
                {result.explanation.commonMistakes.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

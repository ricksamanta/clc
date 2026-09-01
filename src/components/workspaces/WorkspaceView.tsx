import React, { useState } from 'react';
import { SafeExpressionParser, formatResultNumber } from '../../engine/safeParser';
import { Layers, Play, Printer, Download, Sparkles, Copy, Check, FileText } from 'lucide-react';

export const WorkspaceView: React.FC = () => {
  const [scratchpadText, setScratchpadText] = useState<string>(
    `// CalcRick Multi-line Scratchpad with Variables\n` +
    `radius = 7.5\n` +
    `height = 14\n` +
    `baseArea = pi * radius^2\n` +
    `volume = baseArea * height\n` +
    `costPerUnit = 2.45\n` +
    `totalCost = volume * costPerUnit`
  );

  const [activeTab, setActiveTab] = useState<'scratchpad' | 'worksheet'>('scratchpad');
  const [copied, setCopied] = useState(false);

  // Evaluate Multi-line Scratchpad
  const evaluateScratchpad = (text: string) => {
    const lines = text.split('\n');
    const parser = new SafeExpressionParser('DEG');
    const scope: Record<string, number> = {};
    const evaluatedLines: { line: string; result?: string; isComment?: boolean; isError?: boolean }[] = [];

    lines.forEach((l) => {
      const trimmed = l.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) {
        evaluatedLines.push({ line: l, isComment: true });
        return;
      }

      // Check assignment "var = expr"
      const assignMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        const expr = assignMatch[2];
        const res = parser.parseAndEvaluate(expr, scope);
        if (res.success && !isNaN(res.value)) {
          scope[varName] = res.value;
          evaluatedLines.push({ line: l, result: formatResultNumber(res.value) });
        } else {
          evaluatedLines.push({ line: l, result: res.error || 'Error', isError: true });
        }
      } else {
        // Direct expression
        const res = parser.parseAndEvaluate(trimmed, scope);
        if (res.success && !isNaN(res.value)) {
          evaluatedLines.push({ line: l, result: formatResultNumber(res.value) });
        } else {
          evaluatedLines.push({ line: l, result: res.error || 'Error', isError: true });
        }
      }
    });

    return { evaluatedLines, finalScope: scope };
  };

  const { evaluatedLines, finalScope } = evaluateScratchpad(scratchpadText);

  const handleCopyResults = () => {
    const text = evaluatedLines.map(el => `${el.line} ${el.result ? `=> ${el.result}` : ''}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="scratchpad-workspace-view" className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-violet-400" />
            <span>Interactive Scratchpad & Worksheets</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Define dynamic variables, chain calculation dependencies, and generate exportable exam study sheets.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950 p-1 text-xs">
          <button
            onClick={() => setActiveTab('scratchpad')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'scratchpad' ? 'bg-violet-900/60 text-violet-200' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Multi-Line Scratchpad
          </button>
          <button
            onClick={() => setActiveTab('worksheet')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'worksheet' ? 'bg-violet-900/60 text-violet-200' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Study Sheet Generator
          </button>
        </div>
      </div>

      {/* TAB 1: MULTI-LINE SCRATCHPAD */}
      {activeTab === 'scratchpad' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Code/Expression Editor */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Scratchpad Editor (Live Evaluated)
              </span>
              <span className="text-[11px] text-neutral-500 font-mono">Supports +, -, *, /, ^, sin(), pi, e, vars</span>
            </div>

            <textarea
              id="scratchpad-editor"
              value={scratchpadText}
              onChange={(e) => setScratchpadText(e.target.value)}
              rows={12}
              className="w-full rounded-2xl bg-neutral-950 border border-neutral-800 p-4 font-mono text-sm text-white focus:border-violet-600 focus:outline-none leading-relaxed shadow-inner"
              placeholder="Type mathematical expressions or variable assignments..."
            />
          </div>

          {/* Real-time Output & Scope Inspector */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Evaluation Output
              </span>
              <button
                onClick={handleCopyResults}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Output'}</span>
              </button>
            </div>

            {/* Results Line-by-Line list */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 font-mono text-xs space-y-2 max-h-80 overflow-y-auto">
              {evaluatedLines.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 border-b border-neutral-850 pb-1.5">
                  <span className={`truncate ${item.isComment ? 'text-neutral-500 italic' : 'text-neutral-300'}`}>
                    {item.line}
                  </span>
                  {item.result && (
                    <span className={`font-bold shrink-0 ${item.isError ? 'text-rose-400' : 'text-violet-300'}`}>
                      = {item.result}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Active Variables Table */}
            {Object.keys(finalScope).length > 0 && (
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Active Variable Registry
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(finalScope).map(([k, v]) => (
                    <div key={k} className="p-2 rounded bg-neutral-900 border border-neutral-850 text-neutral-300 flex justify-between">
                      <span className="text-violet-400">{k}</span>
                      <span className="font-bold text-white">{formatResultNumber(v, 4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STUDY SHEET GENERATOR */}
      {activeTab === 'worksheet' && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div>
              <h3 className="text-base font-bold text-white">Curated Academic Problem Sheet</h3>
              <p className="text-xs text-neutral-400">Ready for exam preparation, printing, and self-testing.</p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-900/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Worksheet</span>
            </button>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {[
              {
                q: '1. Using the Euclidean Algorithm, calculate GCD(252, 105).',
                hint: '252 = 2 × 105 + 42; 105 = 2 × 42 + 21; 42 = 2 × 21 + 0.',
                ans: 'GCD = 21'
              },
              {
                q: '2. Solve the quadratic equation 2x² - 8x - 24 = 0 for all real roots.',
                hint: 'Divide by 2: x² - 4x - 12 = 0; factors into (x - 6)(x + 2) = 0.',
                ans: 'x = 6, x = -2'
              },
              {
                q: '3. An object of mass 15 kg accelerates at 6 m/s². Determine the net applied force.',
                hint: 'F = m · a = 15 kg × 6 m/s².',
                ans: 'F = 90 N'
              },
              {
                q: '4. Calculate the total future value of $10,000 invested at 8% annual compound interest for 5 years compounded annually.',
                hint: 'A = 10000 × (1 + 0.08)^5.',
                ans: 'A = $14,693.28'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-neutral-950 border border-neutral-850 space-y-2">
                <div className="text-sm font-semibold text-white">{item.q}</div>
                <div className="text-neutral-500">Hint / Method: {item.hint}</div>
                <div className="text-emerald-400 font-bold">Answer: {item.ans}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  FORMULA_LIBRARY, RULE_LIBRARY, THEOREM_LIBRARY, SCIENCE_LAWS_LIBRARY, CONCEPT_LIBRARY 
} from '../../data/knowledgeGraph';
import { 
  BookOpen, Search, Copy, Check, ExternalLink, HelpCircle, Layers, Award, Sparkles 
} from 'lucide-react';

interface KnowledgeViewProps {
  onSelectCalculator?: (id: string) => void;
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({ onSelectCalculator }) => {
  const [activeSubTab, setActiveSubTab] = useState<'formulas' | 'rules' | 'theorems' | 'laws' | 'concepts' | 'rule-finder'>('formulas');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Rule Finder wizard state
  const [ruleFinderQuery, setRuleFinderQuery] = useState('');

  const handleCopyFormula = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFormulas = FORMULA_LIBRARY.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRules = RULE_LIBRARY.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTheorems = THEOREM_LIBRARY.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.statement.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLaws = SCIENCE_LAWS_LIBRARY.filter(l =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.statement.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConcepts = CONCEPT_LIBRARY.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="knowledge-platform-view" className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-violet-400" />
            <span>Formulas, Rules, Laws & Knowledge Graph</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Authoritative mathematical references, condition boundaries, and live calculator integrations.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950 p-1">
          {[
            { id: 'formulas', label: 'Formulas' },
            { id: 'rules', label: 'Rules' },
            { id: 'theorems', label: 'Theorems' },
            { id: 'laws', label: 'Science Laws' },
            { id: 'concepts', label: 'Concepts' },
            { id: 'rule-finder', label: 'Rule Finder' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeSubTab === tab.id
                  ? 'bg-violet-900/60 text-violet-200 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Filter Bar */}
      {activeSubTab !== 'rule-finder' && (
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeSubTab} by title, category, or description...`}
            className="w-full rounded-xl bg-neutral-900 border border-neutral-800 pl-10 pr-4 py-2 text-sm text-white focus:border-violet-600 focus:outline-none placeholder:text-neutral-500"
          />
        </div>
      )}

      {/* TAB 1: FORMULAS */}
      {activeSubTab === 'formulas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFormulas.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl border border-neutral-800/90 bg-neutral-900/80 p-5 space-y-3 shadow-md hover:border-neutral-700 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                    {f.category} • {f.subcategory}
                  </span>
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                </div>
                <button
                  onClick={() => handleCopyFormula(f.id, f.formula)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-white transition-colors"
                  title="Copy LaTeX Formula"
                >
                  {copiedId === f.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Mathematical Formula Display */}
              <div className="p-3 rounded-xl bg-neutral-950 font-mono text-sm text-violet-300 border border-neutral-850 text-center select-all">
                {f.formula}
              </div>

              <p className="text-xs text-neutral-300">{f.description}</p>

              {/* Variable Definitions */}
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-neutral-400">Variables:</span>
                <div className="grid grid-cols-1 gap-0.5 text-neutral-400 pl-2 text-[11px]">
                  {f.variables.map((v) => (
                    <div key={v.symbol}>
                      <span className="font-mono text-violet-300 font-bold">{v.symbol}</span>: {v.name} ({v.unit})
                    </div>
                  ))}
                </div>
              </div>

              {/* Worked Example */}
              <div className="p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-850 text-[11px] space-y-1">
                <span className="font-semibold text-amber-400">Example:</span>
                <p className="text-neutral-400">{f.example.problem}</p>
                <p className="font-mono text-neutral-300 text-[10px]">{f.example.solution}</p>
              </div>

              {/* Open Calculator link */}
              {f.calculatorId && onSelectCalculator && (
                <button
                  onClick={() => onSelectCalculator(f.calculatorId!)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-violet-950/60 hover:bg-violet-900/70 text-xs font-semibold text-violet-300 border border-violet-800/50 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>Open Interactive Calculator</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: RULES */}
      {activeSubTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.map((r) => (
            <div key={r.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">{r.category} Rule</span>
              <h3 className="text-base font-bold text-white">{r.title}</h3>
              {r.formula && (
                <div className="p-2.5 rounded-lg bg-neutral-950 font-mono text-xs text-violet-300 text-center">
                  {r.formula}
                </div>
              )}
              <p className="text-xs text-neutral-300 leading-relaxed">{r.summary}</p>
              <p className="text-xs text-neutral-400 leading-relaxed">{r.explanation}</p>
              <div className="p-2.5 rounded-lg bg-neutral-950 text-xs font-mono text-neutral-300 border border-neutral-850">
                <span className="text-neutral-500 font-sans font-semibold">Example: </span>
                {r.example}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: THEOREMS */}
      {activeSubTab === 'theorems' && (
        <div className="space-y-4">
          {filteredTheorems.map((t) => (
            <div key={t.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{t.title}</h3>
                <span className="rounded bg-violet-950 px-2 py-0.5 text-[10px] font-bold text-violet-400 border border-violet-800/50">
                  {t.category}
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed italic border-l-2 border-violet-500 pl-3">
                "{t.statement}"
              </p>
              {t.formula && (
                <div className="p-2.5 rounded-lg bg-neutral-950 font-mono text-xs text-violet-300 text-center">
                  {t.formula}
                </div>
              )}
              <div className="text-xs text-neutral-400 space-y-1">
                <span className="font-semibold text-neutral-300">Significance: </span>
                <span>{t.significance}</span>
              </div>
              {t.calculatorId && onSelectCalculator && (
                <button
                  onClick={() => onSelectCalculator(t.calculatorId!)}
                  className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-semibold pt-1"
                >
                  <span>Launch Theorem Calculator →</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: SCIENCE LAWS */}
      {activeSubTab === 'laws' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLaws.map((l) => (
            <div key={l.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{l.domain} Law</span>
              <h3 className="text-base font-bold text-white">{l.title}</h3>
              <div className="p-2.5 rounded-lg bg-neutral-950 font-mono text-xs text-emerald-300 text-center">
                {l.formula}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed italic">"{l.statement}"</p>
              <p className="text-xs text-neutral-400">{l.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: CONCEPTS */}
      {activeSubTab === 'concepts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConcepts.map((c) => (
            <div key={c.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">{c.category} Concept</span>
              <h3 className="text-base font-bold text-white">{c.title}</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">{c.definition}</p>
              <div className="p-2.5 rounded-lg bg-neutral-950 text-xs text-neutral-400 border border-neutral-850">
                <span className="font-semibold text-neutral-300">Importance: </span>
                {c.importance}
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {c.relatedTerms.map((rt) => (
                  <span key={rt} className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-400">
                    {rt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: RULE FINDER */}
      {activeSubTab === 'rule-finder' && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Which Mathematical Rule or Theorem Do I Need?</h3>
            <p className="text-xs text-neutral-400">
              Describe your mathematical objective (e.g., "Find the hypotenuse of a right triangle" or "Differentiate x squared").
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                prompt: 'I have a right triangle and need to find the third side length.',
                rule: 'Pythagorean Theorem (a² + b² = c²)',
                calcId: 'right-triangle'
              },
              {
                prompt: 'I need to find roots for ax² + bx + c = 0.',
                rule: 'Quadratic Formula x = (-b ± √(b² - 4ac)) / 2a',
                calcId: 'quadratic-solver'
              },
              {
                prompt: 'I need to calculate net force given mass and acceleration.',
                rule: 'Newton’s Second Law (F = ma)',
                calcId: 'physics-force'
              },
              {
                prompt: 'I need to compute the largest integer dividing two numbers evenly.',
                rule: 'Euclidean Algorithm for Greatest Common Divisor (GCD)',
                calcId: 'gcd-lcm'
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2">
                <div className="text-xs font-semibold text-neutral-200">
                  <span className="text-neutral-500">Problem: </span>
                  "{item.prompt}"
                </div>
                <div className="text-xs text-violet-300 font-mono">
                  <span className="text-neutral-500 font-sans font-semibold">Rule Needed: </span>
                  {item.rule}
                </div>
                {onSelectCalculator && (
                  <button
                    onClick={() => onSelectCalculator(item.calcId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 pt-1"
                  >
                    <span>Open Calculator →</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

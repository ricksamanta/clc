import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, BookOpen, Layers, X, ArrowRight } from 'lucide-react';
import { CALCULATOR_REGISTRY } from '../../data/registry';
import { FORMULA_LIBRARY, SCIENCE_LAWS_LIBRARY, THEOREM_LIBRARY, CONCEPT_LIBRARY } from '../../data/knowledgeGraph';
import { routeNaturalQuery } from '../../engine/intentRouter';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator: (id: string, initialInputs?: Record<string, any>) => void;
  onSelectKnowledge: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCalculator,
  onSelectKnowledge,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Natural query smart routing result
  const smartIntent = q ? routeNaturalQuery(query) : null;

  // Filtered Calculators
  const matchingCalculators = CALCULATOR_REGISTRY.filter(c =>
    !q ||
    c.name.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.tags?.some(t => t.toLowerCase().includes(q))
  ).slice(0, 5);

  // Filtered Formulas
  const matchingFormulas = FORMULA_LIBRARY.filter(f =>
    q && (f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || f.category.toLowerCase().includes(q))
  ).slice(0, 3);

  // Filtered Theorems & Laws
  const matchingTheorems = THEOREM_LIBRARY.filter(t =>
    q && (t.title.toLowerCase().includes(q) || t.statement.toLowerCase().includes(q))
  ).slice(0, 2);

  const matchingLaws = SCIENCE_LAWS_LIBRARY.filter(l =>
    q && (l.title.toLowerCase().includes(q) || l.statement.toLowerCase().includes(q))
  ).slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
        
        {/* Search Input Box */}
        <div className="relative flex items-center border-b border-neutral-800 px-4 py-3">
          <Search className="w-5 h-5 text-neutral-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search calculators, formulas, laws, or type e.g. 'GCD of 48 and 18'..."
            className="w-full bg-transparent text-base text-white focus:outline-none placeholder:text-neutral-500"
          />
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* Smart Intent Match Box */}
          {smartIntent && (
            <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-violet-300">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>Smart Calculation Match</span>
                </span>
                {smartIntent.immediateResult && (
                  <span className="font-mono font-bold text-sm text-white">
                    = {smartIntent.immediateResult.value}
                  </span>
                )}
              </div>
              <p className="text-neutral-300">{smartIntent.explanation}</p>
              <button
                onClick={() => {
                  onSelectCalculator(smartIntent.calculatorId, smartIntent.matchedInputs);
                  onClose();
                }}
                className="flex items-center gap-1 text-violet-400 hover:text-violet-300 font-semibold"
              >
                <span>Launch in full calculator →</span>
              </button>
            </div>
          )}

          {/* Calculators Section */}
          {matchingCalculators.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block px-1">
                Calculators ({matchingCalculators.length})
              </span>
              {matchingCalculators.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCalculator(c.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-850 text-left transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{c.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-neutral-900 text-neutral-400 border border-neutral-800">
                        {c.category}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-xs line-clamp-1">{c.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-500 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}

          {/* Formulas Section */}
          {matchingFormulas.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block px-1">
                Formulas ({matchingFormulas.length})
              </span>
              {matchingFormulas.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    onSelectKnowledge('formulas');
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-850 text-left space-y-1 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{f.title}</span>
                    <span className="font-mono text-violet-400">{f.formula}</span>
                  </div>
                  <p className="text-neutral-400 text-xs">{f.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Theorems & Laws */}
          {(matchingTheorems.length > 0 || matchingLaws.length > 0) && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block px-1">
                Theorems & Science Laws
              </span>
              {matchingTheorems.map((t) => (
                <div key={t.id} className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-850 space-y-1">
                  <div className="font-bold text-white">{t.title}</div>
                  <p className="text-neutral-400 text-xs italic">"{t.statement}"</p>
                </div>
              ))}
              {matchingLaws.map((l) => (
                <div key={l.id} className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-850 space-y-1">
                  <div className="font-bold text-white">{l.title}</div>
                  <p className="text-neutral-400 text-xs italic">"{l.statement}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <span>ESC to close</span>
          <span>Tab to navigate</span>
        </div>
      </div>
    </div>
  );
};

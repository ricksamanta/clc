import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { StandardCalculator } from './components/calculator/StandardCalculator';
import { UniversalCalculatorView } from './components/calculator/UniversalCalculatorView';
import { GraphingEngine } from './components/calculator/GraphingEngine';
import { UniversalConverter } from './components/converter/UniversalConverter';
import { KnowledgeView } from './components/knowledge/KnowledgeView';
import { PracticeView } from './components/practice/PracticeView';
import { WorkspaceView } from './components/workspaces/WorkspaceView';
import { HistoryView } from './components/history/HistoryView';
import { ExploreCalculators } from './components/explore/ExploreCalculators';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { CALCULATOR_REGISTRY, getCalculatorById } from './data/registry';
import { HistoryItem, ThemeMode } from './types';
import { routeNaturalQuery } from './engine/intentRouter';
import { 
  Sparkles, Search, ArrowRight, ShieldCheck, Award, BookOpen, Layers, Zap, Calculator 
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeCalculatorId, setActiveCalculatorId] = useState<string | null>(null);

  // Theme
  const [theme, setTheme] = useState<ThemeMode>('dark');

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Universal Natural Query bar state on Homepage
  const [homeQuery, setHomeQuery] = useState<string>('');
  const [homeQueryResult, setHomeQueryResult] = useState<any>(null);

  // Calculation History in LocalStorage
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calcrick_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSaveToHistory = (item: HistoryItem) => {
    setHistory(prev => {
      // Deduplicate recent identical expressions
      const filtered = prev.filter(h => !(h.calculatorId === item.calculatorId && h.result === item.result && h.expression === item.expression));
      const next = [item, ...filtered].slice(0, 100);
      try {
        localStorage.setItem('calcrick_history', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('calcrick_history');
    } catch (err) {
      console.error(err);
    }
  };

  // Select Calculator Handler
  const handleSelectCalculator = (id: string, initialInputs?: Record<string, any>) => {
    setActiveCalculatorId(id);
    setCurrentTab('calculator-runner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Restore history item
  const handleRestoreHistoryItem = (item: HistoryItem) => {
    if (item.calculatorId === 'standard') {
      setCurrentTab('home');
    } else {
      setActiveCalculatorId(item.calculatorId);
      setCurrentTab('calculator-runner');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Smart natural query evaluation on change
  useEffect(() => {
    if (homeQuery.trim()) {
      const routed = routeNaturalQuery(homeQuery);
      setHomeQueryResult(routed);
    } else {
      setHomeQueryResult(null);
    }
  }, [homeQuery]);

  // Global keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeCalcDef = activeCalculatorId ? getCalculatorById(activeCalculatorId) : null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#08080a] text-neutral-100' : 'bg-neutral-50 text-neutral-900'} flex flex-col font-sans transition-colors duration-200`}>
      
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setActiveCalculatorId(null);
        }}
        theme={theme}
        onToggleTheme={setTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* HOMEPAGE VIEW */}
        {currentTab === 'home' && (
          <div className="space-y-10">
            
            {/* Hero / Smart Universal Input Bar */}
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-800/50 text-xs font-semibold text-violet-300">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Deterministic Calculation & Step Explanation Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                CalcRick Professional
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
                Deterministic mathematical computations, scientific laws, financial models, unit conversions, and step-by-step verification.
              </p>

              {/* Universal Query Input */}
              <div className="relative max-w-xl mx-auto pt-2">
                <div className="relative flex items-center rounded-2xl border border-neutral-800 bg-neutral-900/90 shadow-xl focus-within:border-violet-600 transition-colors">
                  <Search className="w-4 h-4 text-neutral-400 ml-4 mr-2 shrink-0" />
                  <input
                    id="universal-smart-input"
                    type="text"
                    value={homeQuery}
                    onChange={(e) => setHomeQuery(e.target.value)}
                    placeholder="Ask or compute: e.g. 'GCD of 48 and 18', '25% of 480', '10 km to miles'..."
                    className="w-full bg-transparent px-2 py-3 text-sm text-white focus:outline-none placeholder:text-neutral-500 font-mono"
                  />
                  {homeQuery && (
                    <button
                      onClick={() => setHomeQuery('')}
                      className="text-xs text-neutral-500 hover:text-white mr-4"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Instant Query Match Result Box */}
                {homeQueryResult && (
                  <div className="mt-3 p-4 rounded-2xl bg-neutral-900 border border-violet-800/60 shadow-2xl text-left space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Instant Deterministic Answer</span>
                      </span>
                      {homeQueryResult.immediateResult && (
                        <span className="font-mono font-bold text-lg text-white">
                          = {homeQueryResult.immediateResult.value} {homeQueryResult.immediateResult.unit || ''}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300">{homeQueryResult.explanation}</p>
                    <button
                      onClick={() => {
                        handleSelectCalculator(homeQueryResult.calculatorId, homeQueryResult.matchedInputs);
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 pt-1"
                    >
                      <span>Open full step-by-step calculator →</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Centerpiece Standard / Scientific Calculator */}
            <div className="py-2">
              <StandardCalculator onSaveToHistory={handleSaveToHistory} />
            </div>

            {/* Quick Access Featured Suites */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Popular Calculation Suites</h2>
                  <p className="text-xs text-neutral-400">Launch deterministic solvers with full step explanations</p>
                </div>
                <button
                  onClick={() => setCurrentTab('explore')}
                  className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300"
                >
                  <span>View all 50+ tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'gcd-lcm', name: 'GCD & LCM', desc: 'Euclidean algorithm with division steps and Venn diagram breakdown', cat: 'Math' },
                  { id: 'quadratic-solver', name: 'Quadratic Equation', desc: 'Discriminant analysis, exact algebraic radicals & complex roots', cat: 'Algebra' },
                  { id: 'loan-emi', name: 'Loan EMI & Amortization', desc: 'Monthly payments, total interest burden & amortization table', cat: 'Finance' },
                  { id: 'universal-unit-converter', name: 'Universal Unit Converter', desc: 'Convert length, mass, temperature, data, pressure and currencies', cat: 'Converter' },
                  { id: 'physics-force', name: 'Newton’s Second Law', desc: 'Calculate resultant force F = m·a with unit consistency checks', cat: 'Physics' },
                  { id: 'prime-factorization', name: 'Prime Factorization', desc: 'Decompose any integer into prime canonical exponents', cat: 'Math' },
                  { id: 'base-converter', name: 'Radix Base Converter', desc: 'Convert between Binary, Octal, Decimal and Hexadecimal', cat: 'Programming' },
                  { id: 'statistics-summary', name: 'Descriptive Statistics', desc: 'Mean, Median, Mode, Variance, Sample Std Dev and IQR', cat: 'Statistics' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectCalculator(item.id)}
                    className="p-4 rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800/80 hover:border-violet-600/50 text-left transition-all group space-y-2"
                  >
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-950 text-violet-400 border border-violet-800/40">
                      {item.cat}
                    </span>
                    <h3 className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EXPLORE ALL CALCULATORS */}
        {currentTab === 'explore' && (
          <ExploreCalculators onSelectCalculator={handleSelectCalculator} />
        )}

        {/* UNIVERSAL CALCULATOR RUNNER */}
        {currentTab === 'calculator-runner' && activeCalcDef && (
          <UniversalCalculatorView
            calculator={activeCalcDef}
            onBack={() => setCurrentTab('explore')}
            onSaveToHistory={handleSaveToHistory}
            onSelectCalculator={handleSelectCalculator}
          />
        )}

        {/* CONVERTER TAB */}
        {currentTab === 'converters' && <UniversalConverter />}

        {/* GRAPHING CALCULATOR TAB */}
        {currentTab === 'graphing' && <GraphingEngine />}

        {/* KNOWLEDGE, FORMULAS & LAWS TAB */}
        {currentTab === 'learn' && (
          <KnowledgeView onSelectCalculator={handleSelectCalculator} />
        )}

        {/* PRACTICE & MASTERY TAB */}
        {currentTab === 'practice' && (
          <PracticeView onSelectCalculator={handleSelectCalculator} />
        )}

        {/* MULTI-LINE SCRATCHPAD & STUDY SHEET TAB */}
        {currentTab === 'workspace' && <WorkspaceView />}

        {/* CALCULATION HISTORY TAB */}
        {currentTab === 'history' && (
          <HistoryView
            history={history}
            onClearHistory={handleClearHistory}
            onRestoreItem={handleRestoreHistoryItem}
          />
        )}
      </main>

      {/* Global Search Dialog (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCalculator={handleSelectCalculator}
        onSelectKnowledge={(tab) => {
          setCurrentTab('learn');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;


import React, { useState } from 'react';
import { CALCULATOR_REGISTRY } from '../../data/registry';
import { CalculatorCategory } from '../../types';
import { 
  Search, Layers, Sparkles, ArrowRight, ShieldCheck, Cpu, Filter 
} from 'lucide-react';

interface ExploreCalculatorsProps {
  onSelectCalculator: (id: string) => void;
}

export const ExploreCalculators: React.FC<ExploreCalculatorsProps> = ({ onSelectCalculator }) => {
  const [selectedCategory, setSelectedCategory] = useState<CalculatorCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: CalculatorCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Engines', count: CALCULATOR_REGISTRY.length },
    { id: 'math', label: 'Mathematics', count: CALCULATOR_REGISTRY.filter(c => c.category === 'math').length },
    { id: 'science', label: 'Science & Physics', count: CALCULATOR_REGISTRY.filter(c => c.category === 'science').length },
    { id: 'finance', label: 'Financial & Loans', count: CALCULATOR_REGISTRY.filter(c => c.category === 'finance').length },
    { id: 'programming', label: 'Programming & CS', count: CALCULATOR_REGISTRY.filter(c => c.category === 'programming').length },
    { id: 'conversion', label: 'Unit Converters', count: CALCULATOR_REGISTRY.filter(c => c.category === 'conversion').length },
    { id: 'date', label: 'Date & Time', count: CALCULATOR_REGISTRY.filter(c => c.category === 'date').length },
  ];

  const filteredCalculators = CALCULATOR_REGISTRY.filter((calc) => {
    const matchesCat = selectedCategory === 'all' || calc.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q ||
      calc.name.toLowerCase().includes(q) ||
      calc.description.toLowerCase().includes(q) ||
      calc.subcategory?.toLowerCase().includes(q) ||
      calc.tags?.some(t => t.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <div id="explore-calculators-page" className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-violet-400" />
            <span>Deterministic Calculator Catalog</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Explore 50+ specialized engineering, financial, mathematical, scientific, and computer science calculation suites.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all engines & tags..."
            className="w-full rounded-xl bg-neutral-900 border border-neutral-800 pl-10 pr-4 py-2 text-xs text-white focus:border-violet-600 focus:outline-none placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Category Selection Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-violet-900/60 text-violet-200 border-violet-700 shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
            }`}
          >
            <span>{cat.label}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-800 text-[10px] text-neutral-300 font-mono">
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid of Calculator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCalculators.map((calc) => (
          <div
            key={calc.id}
            onClick={() => onSelectCalculator(calc.id)}
            className="group rounded-2xl border border-neutral-800/80 bg-neutral-900/80 hover:bg-neutral-900 p-5 space-y-3 cursor-pointer hover:border-violet-600/60 transition-all hover:shadow-xl hover:shadow-violet-950/20 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-950 text-violet-400 border border-violet-800/50">
                  {calc.category} {calc.subcategory ? `• ${calc.subcategory}` : ''}
                </span>
              </div>

              <h3 className="font-bold text-base text-white group-hover:text-violet-300 transition-colors">
                {calc.name}
              </h3>

              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {calc.description}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-850 flex items-center justify-between text-xs font-semibold text-violet-400 group-hover:translate-x-0.5 transition-transform">
              <span>Launch Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

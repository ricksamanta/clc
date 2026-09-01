import React, { useState } from 'react';
import { 
  UNIT_CATEGORIES, UNITS_DATABASE, CURRENCY_RATES, convertUnit 
} from '../../engine/converterEngines';
import { ResultPanel } from '../calculator/ResultPanel';
import { ArrowLeftRight, Sparkles, Copy, Check } from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';

export const UniversalConverter: React.FC = () => {
  const [category, setCategory] = useState<string>('length');
  const [val, setVal] = useState<number>(10);
  
  // Set initial unit dropdowns
  const [fromUnit, setFromUnit] = useState<string>('km');
  const [toUnit, setToUnit] = useState<string>('mi');

  const unitList = UNITS_DATABASE[category] || [];
  const isCurrency = category === 'currency';

  const handleCategoryChange = (newCat: string) => {
    soundEngine.playKeypadClick('fn');
    setCategory(newCat);
    if (newCat === 'currency') {
      setFromUnit('USD');
      setToUnit('INR');
      setVal(1000);
    } else if (newCat === 'temperature') {
      setFromUnit('C');
      setToUnit('F');
      setVal(100);
    } else {
      const units = UNITS_DATABASE[newCat] || [];
      if (units.length >= 2) {
        setFromUnit(units[0].id);
        setToUnit(units[1].id);
      }
    }
  };

  const handleSwap = () => {
    soundEngine.playKeypadClick('fn');
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const result = convertUnit(category, val, fromUnit, toUnit);

  return (
    <div id="universal-converter-page" className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Category Pills Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <span>Universal Unit & Currency Converter</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Linear & non-linear transformations with SI / IEC binary distinctions and forex interbank valuation.
        </p>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          {UNIT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              id={`cat-pill-${cat.id}`}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                category === cat.id
                  ? 'bg-violet-900/60 text-violet-200 border-violet-700 shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Converter Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Converter Inputs */}
        <div className="md:col-span-6 space-y-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/90 p-5 sm:p-6 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Convert {category}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Value to Convert
              </label>
              <input
                id="converter-input-val"
                type="number"
                value={isNaN(val) ? '' : val}
                onChange={(e) => setVal(parseFloat(e.target.value))}
                className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2.5 text-base font-mono text-white focus:border-violet-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-11 items-center gap-2 pt-1">
              {/* From Unit */}
              <div className="sm:col-span-5 space-y-1">
                <label className="text-[11px] font-semibold text-neutral-400">From</label>
                <select
                  id="converter-select-from"
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs font-medium text-neutral-200 focus:border-violet-600 focus:outline-none"
                >
                  {isCurrency ? (
                    Object.entries(CURRENCY_RATES).map(([code, cur]) => (
                      <option key={code} value={code}>
                        {code} - {cur.name} ({cur.symbol})
                      </option>
                    ))
                  ) : (
                    unitList.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center pt-4">
                <button
                  id="converter-swap-btn"
                  onClick={handleSwap}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-violet-300 border border-neutral-700 transition-colors"
                  title="Swap Units"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* To Unit */}
              <div className="sm:col-span-5 space-y-1">
                <label className="text-[11px] font-semibold text-neutral-400">To</label>
                <select
                  id="converter-select-to"
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs font-medium text-neutral-200 focus:border-violet-600 focus:outline-none"
                >
                  {isCurrency ? (
                    Object.entries(CURRENCY_RATES).map(([code, cur]) => (
                      <option key={code} value={code}>
                        {code} - {cur.name} ({cur.symbol})
                      </option>
                    ))
                  ) : (
                    unitList.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Converted Output Panel */}
        <div className="md:col-span-6">
          <ResultPanel
            result={result}
            mode="learn"
            calculatorTitle="Unit Conversion"
          />
        </div>
      </div>
    </div>
  );
};

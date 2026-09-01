import React, { useState } from 'react';
import { HistoryItem } from '../../types';
import { History, Search, Trash2, Download, Play, Copy, Check, Clock, Calendar } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onRestoreItem: (item: HistoryItem) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onClearHistory,
  onRestoreItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = history.filter(h =>
    h.calculatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.expression && h.expression.toLowerCase().includes(searchTerm.toLowerCase())) ||
    h.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `calcrick-history-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="calculation-history-page" className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-violet-400" />
            <span>Calculation Audit & History</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Local session audit log with 1-click parameter recall and JSON export.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                id="export-history-btn"
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-neutral-300 border border-neutral-800 transition-colors"
                title="Export History to JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                id="clear-history-btn"
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-xs font-medium text-rose-300 border border-rose-800/40 transition-colors"
                title="Clear All History"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search Input */}
      {history.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search past calculations by name, expression or result..."
            className="w-full rounded-xl bg-neutral-900 border border-neutral-800 pl-10 pr-4 py-2 text-sm text-white focus:border-violet-600 focus:outline-none placeholder:text-neutral-500"
          />
        </div>
      )}

      {/* Items List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-850 bg-neutral-900/50 p-12 text-center text-neutral-400 space-y-3">
          <Clock className="w-8 h-8 text-neutral-600 mx-auto" />
          <p className="font-semibold text-neutral-300">No calculation history recorded yet</p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Calculations performed in Standard Calculator, Formula engines, and Converters will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-neutral-800/90 bg-neutral-900/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-950 text-violet-400 border border-violet-800/50">
                    {item.category || 'math'}
                  </span>
                  <span className="font-bold text-sm text-white">{item.calculatorName}</span>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {item.expression && (
                  <div className="text-xs font-mono text-neutral-400">
                    Expr: <span className="text-neutral-300">{item.expression}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500 font-semibold">Result:</span>
                  <span className="font-mono font-bold text-base text-violet-300 select-all">
                    {item.result} {item.unit || ''}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleCopy(item.id, `${item.result} ${item.unit || ''}`)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-white transition-colors"
                  title="Copy Result"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => onRestoreItem(item)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-950/60 hover:bg-violet-900/70 text-xs font-semibold text-violet-300 border border-violet-800/50 transition-colors"
                  title="Reopen in Calculator"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Reopen</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

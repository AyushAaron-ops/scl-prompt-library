import { useState } from 'react';
import { ChevronRight, Zap, DollarSign, ChevronDown } from 'lucide-react';
import { AI_MODELS } from '../../data/prompts';
import type { ModelId } from '../../types';

const MODEL_ORDER: ModelId[] = [
  'gpt-5',
  'claude-sonnet-4-5',
  'gemini-2-5-pro',
  'perplexity-sonar-pro',
  'llama-3-3-70b',
  'gpt-4o-mini',
];

const speedColor = { Fast: 'text-emerald-600', Medium: 'text-amber-600', Slow: 'text-red-500' };
const costColor = { Low: 'text-emerald-600', Medium: 'text-amber-600', High: 'text-red-500' };

interface ModelPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ModelPanel({ isOpen, onToggle }: ModelPanelProps) {
  const [expanded, setExpanded] = useState<ModelId | null>(null);

  return (
    <div
      className={`
        transition-all duration-300 overflow-hidden
        ${isOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'}
      `}
    >
      <div className="w-80 h-full border-l border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Model Comparison</h3>
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Close model panel"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 space-y-1">
          {MODEL_ORDER.map((id) => {
            const model = AI_MODELS[id];
            const isExp = expanded === id;
            return (
              <div key={id} className="rounded-lg border border-slate-100 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setExpanded(isExp ? null : id)}
                  className="w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className={`inline-flex items-center border rounded-full px-2 py-0.5 text-xs font-medium ${model.badgeColor}`}>
                    {model.displayName}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex-1">{model.provider}</span>
                  <span className={`text-xs font-medium ${speedColor[model.speed]}`}>{model.speed}</span>
                  <span className={`text-xs font-medium ${costColor[model.costTier]}`}>{model.costTier}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExp ? 'rotate-180' : ''}`} />
                </button>

                {isExp && (
                  <div className="px-3 pb-3 space-y-2.5 bg-slate-50 dark:bg-gray-750 border-t border-slate-100 dark:border-gray-700 pt-2.5">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Best for</p>
                      <ul className="space-y-0.5">
                        {model.bestUseCases.slice(0, 3).map((u) => (
                          <li key={u} className="text-xs text-slate-700 dark:text-slate-300 flex gap-1.5 items-start">
                            <span className="text-brand-500 mt-0.5">•</span>{u}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Strengths</p>
                      <ul className="space-y-0.5">
                        {model.strengths.map((s) => (
                          <li key={s} className="text-xs text-slate-700 dark:text-slate-300 flex gap-1.5 items-start">
                            <Zap className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Limitations</p>
                      <ul className="space-y-0.5">
                        {model.limitations.map((l) => (
                          <li key={l} className="text-xs text-slate-700 dark:text-slate-300 flex gap-1.5 items-start">
                            <DollarSign className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />{l}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">{model.apiNotes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { Heart, Copy, ClipboardList } from 'lucide-react';
import { ModelBadge } from '../models/ModelBadge';
import { useToast } from '../../hooks/useToast';
import { copyToClipboard, buildPromptWithRecommendation } from '../../utils/clipboard';
import { AI_MODELS } from '../../data/prompts';
import type { Prompt } from '../../types';

const complexityStyles: Record<string, string> = {
  Basic: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  Intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

interface PromptCardProps {
  prompt: Prompt;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: () => void;
}

export function PromptCard({ prompt, isFavorite, onToggleFavorite, onClick }: PromptCardProps) {
  const { showToast } = useToast();

  const handleCopy = async (e: React.MouseEvent, withRec = false) => {
    e.stopPropagation();
    try {
      if (withRec) {
        const models = prompt.recommendedModels.map((id) => AI_MODELS[id]).filter(Boolean);
        await copyToClipboard(buildPromptWithRecommendation(prompt, models));
        showToast('Copied with model recommendation', 'success');
      } else {
        await copyToClipboard(prompt.fullPromptText);
        showToast('Prompt copied to clipboard', 'success');
      }
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(prompt.id);
  };

  const visibleModels = prompt.recommendedModels.slice(0, 2);
  const extraCount = prompt.recommendedModels.length - visibleModels.length;

  return (
    <div
      className="prompt-card flex flex-col p-5 group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Open prompt: ${prompt.title}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[140px]">
            {prompt.subcategory}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${complexityStyles[prompt.complexity]}`}>
            {prompt.complexity}
          </span>
        </div>
        <button
          onClick={handleFav}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-300 dark:text-gray-600 group-hover:text-slate-400'
            }`}
          />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5 line-clamp-2 leading-snug">
        {prompt.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 flex-1 leading-relaxed">
        {prompt.shortDescription}
      </p>

      {/* Model badges */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {visibleModels.map((id) => (
          <ModelBadge key={id} modelId={id} />
        ))}
        {extraCount > 0 && (
          <span className="text-xs text-slate-400 dark:text-slate-500">+{extraCount} more</span>
        )}
      </div>

      {/* Footer buttons */}
      <div
        className="flex gap-2 pt-3 border-t border-slate-100 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => handleCopy(e, false)}
          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-slate-200 transition-colors border border-slate-200 dark:border-gray-600"
          aria-label="Copy prompt text"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy Prompt
        </button>
        <button
          onClick={(e) => handleCopy(e, true)}
          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors border border-brand-200 dark:border-brand-800"
          aria-label="Copy prompt with model recommendation"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          + Model Rec.
        </button>
      </div>
    </div>
  );
}

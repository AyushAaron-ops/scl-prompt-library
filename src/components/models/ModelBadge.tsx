import { AI_MODELS } from '../../data/prompts';
import type { ModelId } from '../../types';

interface ModelBadgeProps {
  modelId: ModelId;
  size?: 'sm' | 'md';
}

export function ModelBadge({ modelId, size = 'sm' }: ModelBadgeProps) {
  const model = AI_MODELS[modelId];
  if (!model) return null;

  return (
    <span
      title={`${model.provider} — ${model.bestUseCases[0]}`}
      className={`
        inline-flex items-center border rounded-full font-medium whitespace-nowrap
        ${model.badgeColor}
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
      `}
    >
      {model.displayName}
    </span>
  );
}

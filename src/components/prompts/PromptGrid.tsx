import { useState, useCallback } from 'react';
import { PackageSearch, X } from 'lucide-react';
import { PromptCard } from './PromptCard';
import { PromptModal } from './PromptModal';
import { PromptCardSkeleton } from '../ui/Skeleton';
import type { Prompt } from '../../types';

const PAGE_SIZE = 30;

interface PromptGridProps {
  prompts: Prompt[];
  isFiltering: boolean;
  resultCount: number;
  totalCount: number;
  favoriteIds: Set<string>;
  onToggleFavorite: (id: string) => void;
  onAddRecent: (id: string) => void;
  onClearFilters: () => void;
}

export function PromptGrid({
  prompts,
  isFiltering,
  resultCount,
  totalCount,
  favoriteIds,
  onToggleFavorite,
  onAddRecent,
  onClearFilters,
}: PromptGridProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const openPrompt = useCallback((p: Prompt) => {
    setSelectedPrompt(p);
    setIsModalOpen(true);
    onAddRecent(p.id);
  }, [onAddRecent]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const visiblePrompts = prompts.slice(0, page * PAGE_SIZE);
  const hasMore = visiblePrompts.length < prompts.length;

  if (isFiltering) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PromptCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <PackageSearch className="w-14 h-14 text-slate-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
          No prompts match your filters
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-xs">
          Try adjusting your search or filter criteria to find what you need.
        </p>
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <X className="w-4 h-4" />
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 pt-5 pb-1">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{resultCount.toLocaleString()}</span>
          {' '}of{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">{totalCount.toLocaleString()}</span>
          {' '}prompts
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
        {visiblePrompts.map((p) => (
          <PromptCard
            key={p.id}
            prompt={p}
            isFavorite={favoriteIds.has(p.id)}
            onToggleFavorite={onToggleFavorite}
            onClick={() => openPrompt(p)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pb-8">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-6 py-2.5 border border-slate-200 dark:border-gray-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
          >
            Load more ({(prompts.length - visiblePrompts.length).toLocaleString()} remaining)
          </button>
        </div>
      )}

      <PromptModal
        prompt={selectedPrompt}
        isOpen={isModalOpen}
        onClose={closeModal}
        isFavorite={selectedPrompt ? favoriteIds.has(selectedPrompt.id) : false}
        onToggleFavorite={onToggleFavorite}
        onOpenPrompt={openPrompt}
      />
    </>
  );
}

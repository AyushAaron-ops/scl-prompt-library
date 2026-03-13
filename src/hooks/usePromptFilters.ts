import { useState, useMemo, useCallback } from 'react';
import { PROMPTS } from '../data/prompts';
import type { FilterState, Prompt } from '../types';

const DEFAULT_FILTER: FilterState = {
  searchQuery: '',
  category: 'All',
  model: 'All',
  complexity: 'All',
};

export function usePromptFilters(favoriteIds?: Set<string>, recentIds?: string[]) {
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER);
  const [viewMode, setViewMode] = useState<'all' | 'favorites' | 'recent'>('all');

  const filteredPrompts = useMemo<Prompt[]>(() => {
    let base = PROMPTS;

    if (viewMode === 'favorites' && favoriteIds) {
      base = base.filter((p) => favoriteIds.has(p.id));
    } else if (viewMode === 'recent' && recentIds) {
      const idSet = new Set(recentIds);
      base = base.filter((p) => idSet.has(p.id));
      // preserve recency order
      base = [...base].sort(
        (a, b) => recentIds.indexOf(a.id) - recentIds.indexOf(b.id)
      );
    }

    if (filterState.category !== 'All') {
      base = base.filter((p) => p.category === filterState.category);
    }

    if (filterState.model !== 'All') {
      base = base.filter((p) =>
        p.recommendedModels.includes(filterState.model as import("../types").ModelId)
      );
    }

    if (filterState.complexity !== 'All') {
      base = base.filter((p) => p.complexity === filterState.complexity);
    }

    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase();
      base = base.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.fullPromptText.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }

    return base;
  }, [filterState, viewMode, favoriteIds, recentIds]);

  const clearFilters = useCallback(() => {
    setFilterState(DEFAULT_FILTER);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.category !== 'All') count++;
    if (filterState.model !== 'All') count++;
    if (filterState.complexity !== 'All') count++;
    if (filterState.searchQuery.trim()) count++;
    return count;
  }, [filterState]);

  return {
    filteredPrompts,
    filterState,
    setFilterState,
    clearFilters,
    resultCount: filteredPrompts.length,
    totalCount: PROMPTS.length,
    activeFilterCount,
    viewMode,
    setViewMode,
  };
}

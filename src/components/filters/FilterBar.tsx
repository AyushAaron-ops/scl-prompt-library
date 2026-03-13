import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check, SlidersHorizontal, X } from 'lucide-react';
import type { FilterState, Category, ModelId, ComplexityLevel } from '../../types';
import { AI_MODELS } from '../../data/prompts';

const CATEGORIES: (Category | 'All')[] = [
  'All',
  'Transportation Management',
  'Logistics Network Design',
  'Procurement & Sourcing',
  'Inventory Management',
  'Risk Management',
  'Sustainability & ESG',
  'Documentation & Compliance',
  'Analytics & Reporting',
  'AI & Automation',
];

const MODEL_OPTIONS: (ModelId | 'All')[] = [
  'All',
  'gpt-5',
  'claude-sonnet-4-5',
  'gemini-2-5-pro',
  'perplexity-sonar-pro',
  'llama-3-3-70b',
  'gpt-4o-mini',
];

const COMPLEXITIES: (ComplexityLevel | 'All')[] = ['All', 'Basic', 'Intermediate', 'Advanced'];

const complexityColor: Record<string, string> = {
  Basic: 'text-slate-600',
  Intermediate: 'text-blue-600',
  Advanced: 'text-purple-600',
  All: 'text-slate-600',
};

interface FilterBarProps {
  filterState: FilterState;
  setFilterState: (s: FilterState | ((prev: FilterState) => FilterState)) => void;
  activeFilterCount: number;
  clearFilters: () => void;
  resultCount: number;
  totalCount: number;
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  renderLabel,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
  renderLabel?: (v: T) => React.ReactNode;
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-slate-700 dark:text-slate-300 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-gray-700 transition-colors min-w-[140px] justify-between">
          <span className="truncate max-w-[160px]">
            {renderLabel ? renderLabel(value) : (value === 'All' ? `All ${label}` : value)}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-xl shadow-xl py-1 min-w-[220px] max-h-72 overflow-y-auto">
            {options.map((opt) => (
              <Listbox.Option
                key={opt}
                value={opt}
                className={({ active }) =>
                  `flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer transition-colors ${
                    active ? 'bg-brand-50 dark:bg-gray-700 text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <Check className={`w-3.5 h-3.5 flex-shrink-0 ${selected ? 'text-brand-500' : 'opacity-0'}`} />
                    <span className="truncate">{opt === 'All' ? `All ${label}` : opt}</span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export function FilterBar({
  filterState,
  setFilterState,
  activeFilterCount,
  clearFilters,
  resultCount,
  totalCount,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700">
      <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <SlidersHorizontal className="w-4 h-4" />
        <span className="font-medium">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-brand-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </div>

      <FilterSelect<Category | 'All'>
        label="Categories"
        value={filterState.category}
        options={CATEGORIES}
        onChange={(v) => setFilterState((s) => ({ ...s, category: v }))}
      />

      <FilterSelect<ModelId | 'All'>
        label="Models"
        value={filterState.model}
        options={MODEL_OPTIONS}
        onChange={(v) => setFilterState((s) => ({ ...s, model: v }))}
        renderLabel={(v) => v === 'All' ? 'All Models' : AI_MODELS[v as ModelId]?.displayName ?? v}
      />

      <FilterSelect<ComplexityLevel | 'All'>
        label="Complexity"
        value={filterState.complexity}
        options={COMPLEXITIES}
        onChange={(v) => setFilterState((s) => ({ ...s, complexity: v }))}
        renderLabel={(v) => (
          <span className={complexityColor[v]}>{v === 'All' ? 'All Complexity' : v}</span>
        )}
      />

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium"
        >
          <X className="w-3.5 h-3.5" />
          Clear filters
        </button>
      )}

      <span className="ml-auto text-xs text-slate-400 dark:text-slate-500 font-medium">
        {resultCount.toLocaleString()} of {totalCount.toLocaleString()} prompts
      </span>
    </div>
  );
}

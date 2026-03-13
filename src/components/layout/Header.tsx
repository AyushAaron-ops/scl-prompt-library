import { useRef, useEffect, useState } from 'react';
import {
  Truck, Search, Sun, Moon, BookOpen, Heart,
  Download, ChevronDown, Menu, Columns3
} from 'lucide-react';
import { Fragment } from 'react';
import { Menu as HMenu, Transition } from '@headlessui/react';
import type { FilterState } from '../../types';
import { exportPromptsToJSON, exportPromptsToCSV } from '../../utils/export';
import { PROMPTS } from '../../data/prompts';

interface HeaderProps {
  filterState: FilterState;
  setFilterState: (s: FilterState | ((prev: FilterState) => FilterState)) => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenDictionary: () => void;
  onToggleModelPanel: () => void;
  onToggleSidebar: () => void;
  favoritesCount: number;
  filteredPrompts: import('../../types').Prompt[];
}

export function Header({
  filterState,
  setFilterState,
  isDark,
  onToggleDark,
  onOpenDictionary,
  onToggleModelPanel,
  onToggleSidebar,
  favoritesCount,
  filteredPrompts,
}: HeaderProps) {
  const [inputValue, setInputValue] = useState(filterState.searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue(filterState.searchQuery);
  }, [filterState.searchQuery]);

  const handleSearch = (value: string) => {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilterState((s) => ({ ...s, searchQuery: value }));
    }, 300);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700 flex items-center px-4 gap-3 shadow-sm">
      {/* Mobile sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Truck className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
        </div>
        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[17px] hidden sm:block">
          SC&amp;L Prompt Library
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
        <input
          type="search"
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search 1,600+ supply chain prompts…"
          className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-gray-600 rounded-xl bg-slate-50 dark:bg-gray-800 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white dark:focus:bg-gray-700 transition-colors"
          aria-label="Search prompts"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Dark mode */}
        <button
          onClick={onToggleDark}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} /> : <Moon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />}
        </button>

        {/* Dictionary */}
        <button
          onClick={onOpenDictionary}
          className="hidden sm:flex items-center gap-1.5 p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Open supply chain dictionary"
        >
          <BookOpen className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          <span className="text-sm font-medium hidden md:block">Dictionary</span>
        </button>

        {/* Favorites count */}
        <button
          className="relative p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label={`${favoritesCount} favorites`}
        >
          <Heart className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          {favoritesCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {favoritesCount > 99 ? '99' : favoritesCount}
            </span>
          )}
        </button>

        {/* Model comparison panel */}
        <button
          onClick={onToggleModelPanel}
          className="hidden md:flex p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Toggle model comparison panel"
        >
          <Columns3 className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
        </button>

        {/* Export */}
        <HMenu as="div" className="relative">
          <HMenu.Button
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
            aria-label="Export prompts"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Export</span>
            <ChevronDown className="w-3 h-3" />
          </HMenu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <HMenu.Items className="absolute right-0 mt-1 w-52 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-xl py-1 z-50">
              <HMenu.Item>
                {({ active }) => (
                  <button
                    onClick={() => exportPromptsToJSON(filteredPrompts)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${active ? 'bg-slate-50 dark:bg-gray-700 text-brand-600' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    Export filtered as JSON
                    <span className="block text-xs text-slate-400 mt-0.5">{filteredPrompts.length.toLocaleString()} prompts</span>
                  </button>
                )}
              </HMenu.Item>
              <HMenu.Item>
                {({ active }) => (
                  <button
                    onClick={() => exportPromptsToCSV(filteredPrompts)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${active ? 'bg-slate-50 dark:bg-gray-700 text-brand-600' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    Export filtered as CSV
                    <span className="block text-xs text-slate-400 mt-0.5">{filteredPrompts.length.toLocaleString()} prompts</span>
                  </button>
                )}
              </HMenu.Item>
              <div className="border-t border-slate-100 dark:border-gray-700 my-1" />
              <HMenu.Item>
                {({ active }) => (
                  <button
                    onClick={() => exportPromptsToJSON(PROMPTS)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${active ? 'bg-slate-50 dark:bg-gray-700 text-brand-600' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    Export all as JSON
                    <span className="block text-xs text-slate-400 mt-0.5">All 1,600 prompts</span>
                  </button>
                )}
              </HMenu.Item>
            </HMenu.Items>
          </Transition>
        </HMenu>
      </div>
    </header>
  );
}

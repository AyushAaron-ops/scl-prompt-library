import { useState, useEffect, useContext } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { FilterBar } from './components/filters/FilterBar';
import { PromptGrid } from './components/prompts/PromptGrid';
import { ModelPanel } from './components/models/ModelPanel';
import { DictionaryDrawer } from './components/dictionary/DictionaryDrawer';
import { ToastContainer } from './components/ui/Toast';
import { usePromptFilters } from './hooks/usePromptFilters';
import { useFavorites } from './hooks/useFavorites';
import { useRecentPrompts } from './hooks/useRecentPrompts';
import { ToastContext } from './hooks/useToast';

const DARK_KEY = 'scl_dark_mode';

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem(DARK_KEY);
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isModelPanelOpen, setIsModelPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { recentIds, addRecent } = useRecentPrompts();
  const {
    filteredPrompts,
    filterState,
    setFilterState,
    clearFilters,
    resultCount,
    totalCount,
    activeFilterCount,
    viewMode,
    setViewMode,
  } = usePromptFilters(favorites, recentIds);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(DARK_KEY, String(isDark));
    } catch {}
  }, [isDark]);

  // Brief "filtering" flash for skeleton
  const handleSetFilter = (s: Parameters<typeof setFilterState>[0]) => {
    setIsFiltering(true);
    setFilterState(s);
    setTimeout(() => setIsFiltering(false), 150);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 font-sans">
      <Header
        filterState={filterState}
        setFilterState={handleSetFilter}
        isDark={isDark}
        onToggleDark={() => setIsDark((d) => !d)}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
        onToggleModelPanel={() => setIsModelPanelOpen((p) => !p)}
        onToggleSidebar={() => setIsSidebarOpen((p) => !p)}
        favoritesCount={favorites.size}
        filteredPrompts={filteredPrompts}
      />

      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <Sidebar
          filterState={filterState}
          setFilterState={handleSetFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          favoritesCount={favorites.size}
          recentCount={recentIds.length}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 lg:ml-64 flex flex-col min-w-0">
          <FilterBar
            filterState={filterState}
            setFilterState={handleSetFilter}
            activeFilterCount={activeFilterCount}
            clearFilters={() => {
              clearFilters();
              setViewMode('all');
            }}
            resultCount={resultCount}
            totalCount={totalCount}
          />

          <div className="flex flex-1 min-w-0">
            <div className="flex-1 min-w-0 overflow-hidden">
              <PromptGrid
                prompts={filteredPrompts}
                isFiltering={isFiltering}
                resultCount={resultCount}
                totalCount={totalCount}
                favoriteIds={favorites}
                onToggleFavorite={toggleFavorite}
                onAddRecent={addRecent}
                onClearFilters={() => {
                  clearFilters();
                  setViewMode('all');
                }}
              />
            </div>

            {/* Model panel */}
            <ModelPanel
              isOpen={isModelPanelOpen}
              onToggle={() => setIsModelPanelOpen(false)}
            />
          </div>
        </main>
      </div>

      {/* Dictionary drawer */}
      <DictionaryDrawer
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
      />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}

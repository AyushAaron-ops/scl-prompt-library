import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'scl_recent';
const MAX_RECENT = 20;

export function useRecentPrompts() {
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentIds));
    } catch {
      // Storage unavailable
    }
  }, [recentIds]);

  const addRecent = useCallback((id: string) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((r) => r !== id);
      return [id, ...filtered].slice(0, MAX_RECENT);
    });
  }, []);

  return { recentIds, addRecent };
}

import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Search, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const RECENT_KEY = 'scl_dict_recent';

interface DictResult {
  term: string;
  definition: string;
  relatedTerms: string[];
}

interface DictionaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DictionaryDrawer({ isOpen, onClose }: DictionaryDrawerProps) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<DictResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  const apiKey = (import.meta as unknown as { env: Record<string, string> }).env.VITE_GEMINI_API_KEY as string | undefined;

  const saveRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter((r) => r !== term)].slice(0, 10);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {}
  };

  const lookup = async (term: string) => {
    if (!term.trim()) return;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      setError('no_key');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `You are a supply chain and logistics expert. Provide a concise, professional definition of the following term or concept as used in supply chain management, logistics, and procurement. Return your response as valid JSON matching this exact schema:
{
  "term": "<canonical term name>",
  "definition": "<2–4 sentence professional definition>",
  "relatedTerms": ["<term1>", "<term2>", "<term3>"]
}
Do not include any text outside the JSON object.

Term to define: ${term}`,
              },
            ],
          },
        ],
      };

      const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();
      const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      const parsed: DictResult = JSON.parse(cleaned);
      setResult(parsed);
      saveRecent(parsed.term);
    } catch (err) {
      setError('fetch_error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookup(query);
  };

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResult(null);
      setError(null);
    }
  }, [isOpen]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-y-0 right-0 flex max-w-full">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-out duration-300"
              enterFrom="translate-x-full" enterTo="translate-x-0"
              leave="transform transition ease-in duration-200"
              leaveFrom="translate-x-0" leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-[420px] max-w-full bg-white dark:bg-gray-900 h-full flex flex-col shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-brand-600" />
                    <Dialog.Title className="text-base font-semibold text-slate-800 dark:text-slate-200">
                      SC&L Dictionary
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800"
                    aria-label="Close dictionary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <form onSubmit={handleSubmit} className="px-5 py-4 border-b border-slate-100 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search supply chain terms…"
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-brand-700 transition-colors"
                    >
                      Define
                    </button>
                  </div>
                </form>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {!apiKey || apiKey === 'your_gemini_api_key_here' ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-4">
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">API Key Required</p>
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Add your free Gemini API key to <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">.env</code> as <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">VITE_GEMINI_API_KEY</code> to enable the AI-powered dictionary.
                      </p>
                    </div>
                  ) : isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-7 w-2/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <div className="flex gap-2 mt-4">
                        <Skeleton className="h-7 w-24 rounded-full" />
                        <Skeleton className="h-7 w-20 rounded-full" />
                        <Skeleton className="h-7 w-28 rounded-full" />
                      </div>
                    </div>
                  ) : error === 'fetch_error' ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-4">
                      <p className="text-sm font-medium text-red-700 dark:text-red-400">Unable to retrieve definition</p>
                      <p className="text-xs text-red-600 dark:text-red-500 mt-1">Check your API key in Vercel environment variables and ensure it has Gemini access.</p>
                    </div>
                  ) : result ? (
                    <div className="animate-fade-in">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">{result.term}</h3>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-5">{result.definition}</p>
                      {result.relatedTerms.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Related Terms</p>
                          <div className="flex flex-wrap gap-2">
                            {result.relatedTerms.map((term) => (
                              <button
                                key={term}
                                onClick={() => { setQuery(term); lookup(term); }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700 rounded-full text-xs font-medium hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors"
                              >
                                {term}
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : recentSearches.length > 0 ? (
                    <div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Recent Searches</p>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => { setQuery(term); lookup(term); }}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-between group"
                          >
                            <span>{term}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-slate-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Search any supply chain term</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Powered by Gemini</p>
                    </div>
                  )}
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
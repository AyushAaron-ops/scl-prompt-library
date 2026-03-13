import { Fragment, useState, useRef, useEffect } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { X, Copy, ClipboardList, Zap, AlertTriangle, Tag, ChevronRight } from 'lucide-react';
import { ModelBadge } from '../models/ModelBadge';
import { PromptCard } from './PromptCard';
import { useToast } from '../../hooks/useToast';
import { copyToClipboard, buildPromptWithRecommendation } from '../../utils/clipboard';
import { AI_MODELS, PROMPTS } from '../../data/prompts';
import type { Prompt } from '../../types';

const complexityStyles: Record<string, string> = {
  Basic: 'bg-slate-100 text-slate-600',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
};

interface PromptModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenPrompt: (p: Prompt) => void;
}

export function PromptModal({
  prompt,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenPrompt,
}: PromptModalProps) {
  const { showToast } = useToast();
  const [editedText, setEditedText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prompt) setEditedText(prompt.fullPromptText);
  }, [prompt]);

  if (!prompt) return null;

  const relatedPrompts = PROMPTS.filter(
    (p) => p.subcategory === prompt.subcategory && p.id !== prompt.id
  ).slice(0, 4);

  const models = prompt.recommendedModels.map((id) => AI_MODELS[id]).filter(Boolean);

  const handleCopy = async (withRec = false) => {
    try {
      if (withRec) {
        const text = buildPromptWithRecommendation({ ...prompt, fullPromptText: editedText }, models);
        await copyToClipboard(text);
        showToast('Copied with model recommendation', 'success');
      } else {
        await copyToClipboard(editedText);
        showToast('Prompt copied to clipboard', 'success');
      }
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-40">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                {/* Modal header */}
                <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 dark:border-gray-700">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>{prompt.category}</span>
                      <ChevronRight className="w-3 h-3" />
                      <span>{prompt.subcategory}</span>
                    </div>
                    <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {prompt.title}
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal body */}
                <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-gray-700">
                  {/* Left: editable prompt */}
                  <div className="flex-1 p-6 flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Edit prompt before copying
                    </label>
                    <textarea
                      ref={textareaRef}
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="flex-1 min-h-[260px] w-full p-3 border border-slate-200 dark:border-gray-600 rounded-xl bg-slate-50 dark:bg-gray-800 text-sm text-slate-800 dark:text-slate-200 font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                      aria-label="Prompt text editor"
                    />
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 text-right">
                      {editedText.length.toLocaleString()} characters
                    </p>
                  </div>

                  {/* Right: tabs */}
                  <div className="w-full lg:w-96 flex flex-col">
                    <Tab.Group>
                      <Tab.List className="flex border-b border-slate-200 dark:border-gray-700 px-4">
                        {['Model Recommendations', 'Details'].map((tab) => (
                          <Tab
                            key={tab}
                            className={({ selected }) =>
                              `px-3 py-3.5 text-sm font-medium border-b-2 transition-colors outline-none ${
                                selected
                                  ? 'border-brand-600 text-brand-700 dark:text-brand-400'
                                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                              }`
                            }
                          >
                            {tab}
                          </Tab>
                        ))}
                      </Tab.List>

                      <Tab.Panels className="flex-1 overflow-y-auto p-4 space-y-3">
                        {/* Model Recommendations */}
                        <Tab.Panel className="space-y-3 focus:outline-none">
                          {models.map((model) => (
                            <div
                              key={model.id}
                              className="border border-slate-200 dark:border-gray-700 rounded-xl p-4 bg-slate-50 dark:bg-gray-800"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <ModelBadge modelId={model.id} size="md" />
                                <span className="text-xs text-slate-500 dark:text-slate-400">{model.provider}</span>
                              </div>
                              <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
                                <span className="font-semibold">Best for:</span> {model.bestUseCases[0]}
                              </p>
                              <div className="space-y-1">
                                {model.strengths.slice(0, 2).map((s) => (
                                  <div key={s} className="flex gap-1.5 items-start">
                                    <Zap className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-slate-600 dark:text-slate-400">{s}</span>
                                  </div>
                                ))}
                                {model.limitations.slice(0, 1).map((l) => (
                                  <div key={l} className="flex gap-1.5 items-start">
                                    <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-slate-500 dark:text-slate-500">{l}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </Tab.Panel>

                        {/* Details */}
                        <Tab.Panel className="space-y-4 focus:outline-none">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Best For</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{prompt.bestFor}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Complexity</p>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${complexityStyles[prompt.complexity]}`}>
                              {prompt.complexity}
                            </span>
                          </div>
                          {prompt.tags.length > 0 && (
                            <div>
                              <div className="flex items-center gap-1.5 mb-2">
                                <Tag className="w-3.5 h-3.5 text-slate-400" />
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Tags</p>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {prompt.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 rounded-full text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {prompt.exampleOutput && (
                            <div>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Example Output</p>
                              <pre className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-gray-800 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed border border-slate-200 dark:border-gray-700">
                                {prompt.exampleOutput}
                              </pre>
                            </div>
                          )}
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-gray-800/50 border-t border-slate-200 dark:border-gray-700">
                  <button
                    onClick={() => handleCopy(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Prompt Text
                  </button>
                  <button
                    onClick={() => handleCopy(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-gray-600 rounded-xl text-sm font-medium transition-colors"
                  >
                    <ClipboardList className="w-4 h-4" />
                    Copy with Model Rec.
                  </button>
                  <button
                    onClick={onClose}
                    className="ml-auto text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>

                {/* Related prompts */}
                {relatedPrompts.length > 0 && (
                  <div className="px-6 py-4 border-t border-slate-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                      More from {prompt.subcategory}
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {relatedPrompts.map((p) => (
                        <div key={p.id} className="min-w-[260px] max-w-[260px]">
                          <PromptCard
                            prompt={p}
                            isFavorite={false}
                            onToggleFavorite={onToggleFavorite}
                            onClick={() => onOpenPrompt(p)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

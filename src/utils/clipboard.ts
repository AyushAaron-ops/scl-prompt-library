import type { Prompt, AIModel } from '../types';

export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    if (!success) throw new Error('Copy failed');
  }
}

export function buildPromptWithRecommendation(prompt: Prompt, models: AIModel[]): string {
  const modelLines = models
    .map((m) => `• ${m.displayName} (${m.provider}) — ${m.bestUseCases[0]}`)
    .join('\n');

  return `--- PROMPT ---
${prompt.fullPromptText}

--- RECOMMENDED AI MODEL(S) ---
${modelLines}

--- CONTEXT ---
Category: ${prompt.category} > ${prompt.subcategory}
Complexity: ${prompt.complexity}
Best for: ${prompt.bestFor}`;
}

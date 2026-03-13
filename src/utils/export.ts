import type { Prompt } from '../types';

export function exportPromptsToJSON(prompts: Prompt[]): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `scl-prompts-export-${timestamp}.json`;

  const blob = new Blob([JSON.stringify(prompts, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportPromptsToCSV(prompts: Prompt[]): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `scl-prompts-export-${timestamp}.csv`;

  const headers = ['ID', 'Title', 'Category', 'Subcategory', 'Complexity', 'Recommended Models', 'Tags', 'Prompt Text'];
  const rows = prompts.map((p) => [
    p.id,
    `"${p.title.replace(/"/g, '""')}"`,
    p.category,
    p.subcategory,
    p.complexity,
    p.recommendedModels.join('; '),
    p.tags.join('; '),
    `"${p.fullPromptText.replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

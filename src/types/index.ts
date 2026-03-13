export type ComplexityLevel = 'Basic' | 'Intermediate' | 'Advanced';

export type ModelId =
  | 'gpt-5'
  | 'claude-sonnet-4-5'
  | 'gemini-2-5-pro'
  | 'perplexity-sonar-pro'
  | 'llama-3-3-70b'
  | 'gpt-4o-mini';

export interface AIModel {
  id: ModelId;
  displayName: string;
  provider: string;
  badgeColor: string;
  bestUseCases: string[];
  strengths: string[];
  limitations: string[];
  apiNotes: string;
  speed: 'Fast' | 'Medium' | 'Slow';
  costTier: 'Low' | 'Medium' | 'High';
}

export interface Prompt {
  id: string;
  title: string;
  fullPromptText: string;
  shortDescription: string;
  category: Category;
  subcategory: string;
  recommendedModels: ModelId[];
  complexity: ComplexityLevel;
  bestFor: string;
  tags: string[];
  exampleOutput?: string;
}

export type Category =
  | 'Transportation Management'
  | 'Logistics Network Design'
  | 'Procurement & Sourcing'
  | 'Inventory Management'
  | 'Risk Management'
  | 'Sustainability & ESG'
  | 'Documentation & Compliance'
  | 'Analytics & Reporting'
  | 'AI & Automation';

export interface FilterState {
  searchQuery: string;
  category: Category | 'All';
  model: ModelId | 'All';
  complexity: ComplexityLevel | 'All';
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export interface DictionaryResult {
  term: string;
  definition: string;
  relatedTerms: string[];
  isLoading: boolean;
  error: string | null;
}

export interface BlueprintContext {
  country: string;
  city: string;
  niche1: string;
  niche2: string;
  systemSpec: string;
}

export interface GenerationState {
  isGenerating: boolean;
  content: string;
  error: string | null;
  progress: string; // Describes current action e.g., "Designing Folder Structure..."
}

export enum ViewMode {
  CONFIG = 'CONFIG',
  BLUEPRINT = 'BLUEPRINT',
}
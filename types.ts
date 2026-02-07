export enum AnalysisStage {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  INGESTING = 'INGESTING',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  VERIFYING = 'VERIFYING',
  FINALIZING = 'FINALIZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  tool?: string;
}

export interface ModuleInfo {
  name: string;
  responsibility: string;
}

export interface RiskInfo {
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface RepoAnalysis {
  summary: string;
  file_tree: string[];
  languages: string[];
  architecture: string;
  modules: ModuleInfo[];
  risks: RiskInfo[];
  onboarding: string[];
  confidence: 'Low' | 'Medium' | 'High';
}
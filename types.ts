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

export const MOCK_ANALYSIS: RepoAnalysis = {
  summary: "A distributed system for autonomous agent orchestration.",
  file_tree: ["src/core/agent.ts", "src/network/p2p.ts", "config/protocol.json"],
  languages: ["TypeScript", "Rust"],
  architecture: "Micro-kernel architecture with plugin-based capabilities.",
  modules: [
    { name: "Core", responsibility: "Lifecycle management" },
    { name: "Network", responsibility: "P2P discovery" }
  ],
  risks: [{ title: "Complexity", description: "High cognitive load", severity: "Medium" }],
  onboarding: ["Run npm install", "Start docker"],
  confidence: "Medium"
};
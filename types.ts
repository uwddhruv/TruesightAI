export interface AnalysisResult {
  score: number; // 0-100 (100 = Highly likely Real, 0 = Highly likely Fake)
  verdict: 'REAL' | 'FAKE' | 'UNCERTAIN';
  summary: string;
  artifacts: string[]; // List of specific visual artifacts found
  technicalMetrics: {
    lightingConsistency: number; // 0-10
    textureNaturalness: number; // 0-10
    anatomyCorrectness: number; // 0-10
    backgroundCoherence: number; // 0-10
  };
  reasoning: string;
}

export interface AnalysisHistoryItem {
  id: string;
  thumbnail: string;
  timestamp: number;
  result: AnalysisResult;
}

export enum AppState {
  IDLE,
  ANALYZING,
  RESULT,
  ERROR
}
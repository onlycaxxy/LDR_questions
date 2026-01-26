
export enum Role {
  PARTNER_A = 'A',
  PARTNER_B = 'B'
}

export interface GameState {
  roomId: string;
  a_finished: boolean;
  b_finished: boolean;
  a_answer: string;
  b_answer: string;
  prompt: string;
  updatedAt: number;
}

export interface GeminiAnalysis {
  compatibilityScore: number;
  insight: string;
  suggestion: string;
}

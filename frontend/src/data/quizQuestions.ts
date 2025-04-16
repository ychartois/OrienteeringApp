/**
 * Quiz questions data model
 */

export enum QuizDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface QuizQuestion {
  id: string;
  symbolId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: QuizDifficulty;
  explanation?: string;
}

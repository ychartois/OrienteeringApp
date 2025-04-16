/**
 * Shared type definitions for the Orienteering App
 */

export enum QuizDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface Symbol {
  id: string;
  ref: string;
  name: string;
  column: string;
  type: string;
  image: string;
  description?: string;
  complexity?: number;
}

export interface QuizQuestion {
  id: string;
  symbolId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: number | QuizDifficulty;
  explanation?: string;
}
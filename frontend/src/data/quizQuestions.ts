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

/**
 * Quiz questions organized by difficulty level
 */
export const quizQuestions: Record<QuizDifficulty, QuizQuestion[]> = {
  [QuizDifficulty.EASY]: [
    {
      id: 'e1',
      symbolId: 'd2', // Spur
      question: 'What does this symbol represent?',
      options: ['Spur', 'Hill', 'Knoll', 'Saddle'],
      correctAnswer: 'Spur',
      difficulty: QuizDifficulty.EASY,
      explanation: 'This symbol represents a Spur, which is a contour projection or "nose" rising from the surrounding ground.'
    },
    {
      id: 'e2',
      symbolId: 'w1', // Lake
      question: 'What does this symbol represent?',
      options: ['Pond', 'Lake', 'Waterhole', 'Marsh'],
      correctAnswer: 'Lake',
      difficulty: QuizDifficulty.EASY,
      explanation: 'This symbol represents a Lake, which is a large body of water surrounded by land.'
    },
    {
      id: 'e3',
      symbolId: 'm1', // Road
      question: 'What does this symbol represent?',
      options: ['Road', 'Track', 'Path', 'Railway'],
      correctAnswer: 'Road',
      difficulty: QuizDifficulty.EASY,
      explanation: 'This symbol represents a Road, which is a paved or maintained route for vehicles.'
    },
    {
      id: 'e4',
      symbolId: 'v8', // Prominent tree
      question: 'What does this symbol represent?',
      options: ['Thicket', 'Copse', 'Prominent tree', 'Forest corner'],
      correctAnswer: 'Prominent tree',
      difficulty: QuizDifficulty.EASY,
      explanation: 'This symbol represents a Prominent tree, which is a notable or distinctive tree.'
    },
    {
      id: 'e5',
      symbolId: 'd9', // Hill
      question: 'What does this symbol represent?',
      options: ['Knoll', 'Hill', 'Spur', 'Depression'],
      correctAnswer: 'Hill',
      difficulty: QuizDifficulty.EASY,
      explanation: 'This symbol represents a Hill, which is a raised area of land.'
    }
  ],
  [QuizDifficulty.MEDIUM]: [
    {
      id: 'm1',
      symbolId: 'd3', // Re-entrant
      question: 'What does this symbol represent?',
      options: ['Erosion gully', 'Re-entrant', 'Depression', 'Saddle'],
      correctAnswer: 'Re-entrant',
      difficulty: QuizDifficulty.MEDIUM,
      explanation: 'This symbol represents a Re-entrant, which is a gully or valley cutting into a slope.'
    },
    {
      id: 'm2',
      symbolId: 'r3', // Boulder
      question: 'What does this symbol represent?',
      options: ['Boulder', 'Rock Pillar', 'Boulder cluster', 'Boulder field'],
      correctAnswer: 'Boulder',
      difficulty: QuizDifficulty.MEDIUM,
      explanation: 'This symbol represents a Boulder, which is a large rock.'
    },
    {
      id: 'm3',
      symbolId: 'w7', // Marsh
      question: 'What does this symbol represent?',
      options: ['Narrow marsh', 'Marsh', 'Waterhole', 'Pond'],
      correctAnswer: 'Marsh',
      difficulty: QuizDifficulty.MEDIUM,
      explanation: 'This symbol represents a Marsh, which is an area of wet, soggy ground.'
    },
    {
      id: 'm4',
      symbolId: 'v5', // Thicket
      question: 'What does this symbol represent?',
      options: ['Linear thicket', 'Thicket', 'Copse', 'Forest corner'],
      correctAnswer: 'Thicket',
      difficulty: QuizDifficulty.MEDIUM,
      explanation: 'This symbol represents a Thicket, which is a dense group of bushes or small trees.'
    },
    {
      id: 'm5',
      symbolId: 'm8', // Wall
      question: 'What does this symbol represent?',
      options: ['Fence', 'Wall', 'Earth wall', 'Building'],
      correctAnswer: 'Wall',
      difficulty: QuizDifficulty.MEDIUM,
      explanation: 'This symbol represents a Wall, which is a vertical structure dividing areas.'
    }
  ],
  [QuizDifficulty.HARD]: [
    {
      id: 'h1',
      symbolId: 'd11', // Saddle
      question: 'What does this symbol represent?',
      options: ['Depression', 'Saddle', 'Re-entrant', 'Broken ground'],
      correctAnswer: 'Saddle',
      difficulty: QuizDifficulty.HARD,
      explanation: 'This symbol represents a Saddle, which is a depression between two hills.'
    },
    {
      id: 'h2',
      symbolId: 'r2', // Cave
      question: 'What does this symbol represent?',
      options: ['Cave', 'Pit', 'Tunnel', 'Depression'],
      correctAnswer: 'Cave',
      difficulty: QuizDifficulty.HARD,
      explanation: 'This symbol represents a Cave, which is a natural underground chamber.'
    },
    {
      id: 'h3',
      symbolId: 'w6', // Narrow marsh
      question: 'What does this symbol represent?',
      options: ['Marsh', 'Narrow marsh', 'Minor water channel', 'Stream'],
      correctAnswer: 'Narrow marsh',
      difficulty: QuizDifficulty.HARD,
      explanation: 'This symbol represents a Narrow marsh, which is a thin strip of wetland.'
    },
    {
      id: 'h4',
      symbolId: 'v6', // Linear thicket
      question: 'What does this symbol represent?',
      options: ['Thicket', 'Linear thicket', 'Vegetation boundary', 'Ride'],
      correctAnswer: 'Linear thicket',
      difficulty: QuizDifficulty.HARD,
      explanation: 'This symbol represents a Linear thicket, which is a long, narrow area of dense vegetation.'
    },
    {
      id: 'h5',
      symbolId: 'm7', // Tunnel
      question: 'What does this symbol represent?',
      options: ['Tunnel', 'Bridge', 'Underpass', 'Cave'],
      correctAnswer: 'Tunnel',
      difficulty: QuizDifficulty.HARD,
      explanation: 'This symbol represents a Tunnel, which is an underground passage.'
    }
  ]
};

/**
 * Get quiz questions by difficulty level
 * @param difficulty - The difficulty level
 * @returns Array of quiz questions for the specified difficulty level
 */
export const getQuizQuestionsByDifficulty = (difficulty: QuizDifficulty): QuizQuestion[] => {
  return quizQuestions[difficulty] || [];
};

/**
 * Get all quiz questions
 * @returns Array of all quiz questions
 */
export const getAllQuizQuestions = (): QuizQuestion[] => {
  return [
    ...quizQuestions[QuizDifficulty.EASY],
    ...quizQuestions[QuizDifficulty.MEDIUM],
    ...quizQuestions[QuizDifficulty.HARD]
  ];
};

/**
 * Get a random quiz question by difficulty level
 * @param difficulty - The difficulty level
 * @returns A random quiz question for the specified difficulty level
 */
export const getRandomQuizQuestion = (difficulty: QuizDifficulty): QuizQuestion | null => {
  const questions = quizQuestions[difficulty];
  if (!questions || questions.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

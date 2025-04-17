import { generateQuizQuestion } from '../../utils/assetUtils';
import type { Symbol } from '../../utils/assetUtils';

// Mock the 'getSimilarSymbols' function used inside generateQuizQuestion
jest.mock('../../utils/assetUtils', () => {
  const originalModule = jest.requireActual('../../utils/assetUtils');
  
  return {
    ...originalModule,
    getSimilarSymbols: (symbol: Symbol, count: number) => {
      // Return mock symbols for testing
      return Array.from({ length: count }, (_, i) => ({
        id: `mock-${i}`,
        name: `Mock Symbol ${i}`,
        type: symbol.type,
        complexity: symbol.complexity,
        ref: `mock.${i}`,
        column: 'Column_D',
        image: 'mock-image.png'
      }));
    },
    shuffleArray: (array: any[]) => array // Don't shuffle for predictable test results
  };
});

describe('generateQuizQuestion', () => {
  // Mock symbol for testing
  const mockSymbol: Symbol = {
    id: 'test-id',
    ref: '1.1',
    name: 'Test Symbol',
    column: 'Column_D',
    type: 'Landforms',
    image: 'test-image.png',
    description: 'A test symbol description',
    complexity: 2
  };

  test('generates a question with the correct structure', () => {
    const question = generateQuizQuestion(mockSymbol, 2);
    
    expect(question).toHaveProperty('id');
    expect(question).toHaveProperty('symbolId', 'test-id');
    expect(question).toHaveProperty('question', 'What does this symbol represent?');
    expect(question).toHaveProperty('options');
    expect(question).toHaveProperty('correctAnswer', 'Test Symbol');
    expect(question).toHaveProperty('difficulty', 2);
    expect(question).toHaveProperty('explanation');
  });

  test('generated question includes the correct answer in options', () => {
    const question = generateQuizQuestion(mockSymbol, 2);
    expect(question.options).toContain(mockSymbol.name);
  });

  test('difficulty 1 (easy) generates 2-3 options', () => {
    const question = generateQuizQuestion(mockSymbol, 1);
    expect(question.options.length).toBeGreaterThanOrEqual(2);
    expect(question.options.length).toBeLessThanOrEqual(3);
  });

  test('difficulty 2 (medium) generates 4 options', () => {
    const question = generateQuizQuestion(mockSymbol, 2);
    expect(question.options.length).toBe(4);
  });

  test('difficulty 3 (hard) generates 5-6 options', () => {
    const question = generateQuizQuestion(mockSymbol, 3);
    expect(question.options.length).toBeGreaterThanOrEqual(5);
    expect(question.options.length).toBeLessThanOrEqual(6);
  });

  test('explanation includes the symbol name and description', () => {
    const question = generateQuizQuestion(mockSymbol, 2);
    expect(question.explanation).toContain(mockSymbol.name);
    expect(question.explanation).toContain(mockSymbol.description);
  });
});
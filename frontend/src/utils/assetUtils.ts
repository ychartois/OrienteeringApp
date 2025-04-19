/**
 * Utility functions for handling assets
 */
import symbolsData from '../data/symbols.json';
import { Platform } from 'react-native';

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

// Get the asset path prefix based on environment
const getAssetPrefix = () => {
  // For web platform
  if (Platform.OS === 'web') {
    // Use defined asset path from webpack or default
    return process.env.ASSET_PATH || '/';
  }
  // For native platforms
  return '';
};

/**
 * Get the image path for a symbol
 * @param symbolRef - The reference ID of the symbol (e.g., "1.2")
 * @param symbolType - The type of the symbol (e.g., "Landforms")
 * @param symbolName - The name of the symbol (e.g., "Spur")
 * @returns The path to the image
 */
export const getSymbolImagePath = (symbolRef: string, symbolType: string, symbolName: string): string => {
  // Format the name for the file path
  const formattedName = symbolName.replace(/\s+/g, '_');
  
  // Determine the column based on the reference number
  let column = 'Column_D'; // Default
  const majorNumber = parseInt(symbolRef.split('.')[0], 10);
  
  if (majorNumber === 0) {
    column = 'Column_C';
  } else if (majorNumber >= 8 && majorNumber <= 11) {
    column = 'Column_E';
  } else if (majorNumber === 12) {
    column = 'Column_F';
  } else if (majorNumber >= 13) {
    column = 'Column_G';
  }
  
  // Generate the image filename
  const filename = `${column} - ${symbolType} - ${symbolRef} - ${formattedName}.png`;
  
  // On web, handle the path differently for Metro and webpack
  if (Platform.OS === 'web') {
    // For webpack port 3000, retain the current behavior
    if (window.location.port === '3000') {
      return `../../assets/${filename}`;
    }
    // For Metro port 8081
    return `assets/${filename}`;
  }
  
  // For native platforms
  return `assets/${filename}`;
};

/**
 * Get a portable path to an asset regardless of platform
 * @param imagePath - The name of the image file
 * @returns The path to the image that works in both web and native
 */
export const getAssetPath = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // Handle external URLs
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // On web, handle the path differently based on deployment context
  if (Platform.OS === 'web') {
    // When deployed to GitHub Pages with the /OrienteeringApp/ base path
    if (window.location && window.location.pathname.includes('OrienteeringApp')) {
      if (imagePath.includes('../../assets')) {
        return `/OrienteeringApp${imagePath.replace('../../assets', '/assets')}`;
      }
      return `/OrienteeringApp${imagePath}`;
    }
    
    // For local development or other web deployments
    if (imagePath.includes('../../assets')) {
      return imagePath.replace('../../assets', '/assets');
    }
  }
  
  // For native platforms
  return imagePath;
};

/**
 * Get all symbols with their metadata and image paths
 * @returns Array of symbol objects
 */
export const getAllSymbols = (): Symbol[] => {
  return symbolsData as Symbol[];
};

/**
 * Get symbols by type
 * @param type - The type of symbols to get (e.g., "Landforms")
 * @returns Array of symbol objects of the specified type
 */
export const getSymbolsByType = (type: string): Symbol[] => {
  return (symbolsData as Symbol[]).filter(symbol => symbol.type === type);
};

/**
 * Get symbol by ID
 * @param id - The ID of the symbol to get
 * @returns The symbol object or null if not found
 */
export const getSymbolById = (id: string): Symbol | null => {
  return (symbolsData as Symbol[]).find(symbol => symbol.id === id) || null;
};

/**
 * Get symbol by reference
 * @param ref - The reference of the symbol to get (e.g., "1.2")
 * @returns The symbol object or null if not found
 */
export const getSymbolByRef = (ref: string): Symbol | null => {
  return (symbolsData as Symbol[]).find(symbol => symbol.ref === ref) || null;
};

/**
 * Get all symbol types
 * @returns Array of unique symbol types
 */
export const getAllSymbolTypes = (): string[] => {
  const types = (symbolsData as Symbol[]).map(symbol => symbol.type);
  return [...new Set(types)];
};

/**
 * Get all symbol columns
 * @returns Array of unique symbol columns
 */
export const getAllSymbolColumns = (): string[] => {
  const columns = (symbolsData as Symbol[]).map(symbol => symbol.column);
  return [...new Set(columns)];
};

/**
 * Get symbols by complexity
 * @param complexity - The complexity level (1=Easy, 2=Medium, 3=Hard)
 * @returns Array of symbol objects of the specified complexity
 */
export const getSymbolsByComplexity = (complexity: number): Symbol[] => {
  return (symbolsData as Symbol[]).filter(symbol => symbol.complexity === complexity);
};

/**
 * Get symbols by types and complexity
 * @param types - Array of symbol types to include (e.g., ["Landforms", "Water_Features"])
 * @param complexity - The complexity level (1=Easy, 2=Medium, 3=Hard)
 * @returns Array of symbol objects matching the criteria
 */
export const getSymbolsByTypesAndComplexity = (types: string[], complexity: number): Symbol[] => {
  return (symbolsData as Symbol[]).filter(symbol => 
    (types.length === 0 || types.includes(symbol.type)) && 
    symbol.complexity === complexity
  );
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param array - The array to shuffle
 * @returns A new shuffled array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Get similar symbols for generating plausible distractors
 * @param symbol - The target symbol
 * @param count - Number of similar symbols to return
 * @param excludeIds - Array of symbol IDs to exclude
 * @returns Array of similar symbols
 */
export const getSimilarSymbols = (symbol: Symbol, count: number, excludeIds: string[] = []): Symbol[] => {
  // First try to get symbols of the same type
  let sameTypeSymbols = (symbolsData as Symbol[]).filter(s => 
    s.id !== symbol.id && 
    !excludeIds.includes(s.id) && 
    s.type === symbol.type
  );
  
  // If we don't have enough, add symbols from other types
  if (sameTypeSymbols.length < count) {
    const otherSymbols = (symbolsData as Symbol[]).filter(s => 
      s.id !== symbol.id && 
      !excludeIds.includes(s.id) && 
      s.type !== symbol.type
    );
    
    // Prioritize symbols with similar complexity
    otherSymbols.sort((a, b) => {
      const aDiff = Math.abs((a.complexity || 2) - (symbol.complexity || 2));
      const bDiff = Math.abs((b.complexity || 2) - (symbol.complexity || 2));
      return aDiff - bDiff;
    });
    
    sameTypeSymbols = [...sameTypeSymbols, ...otherSymbols];
  }
  
  // Shuffle and return the requested count
  return shuffleArray(sameTypeSymbols).slice(0, count);
};

/**
 * Generate a quiz question for a symbol
 * @param symbol - The symbol to create a question for
 * @param difficulty - The difficulty level (1=Easy, 2=Medium, 3=Hard)
 * @returns A quiz question object
 */
export const generateQuizQuestion = (symbol: Symbol, difficulty: number): any => {
  // Determine number of options based on difficulty
  let optionCount = 4; // Default for medium
  if (difficulty === 1) {
    optionCount = Math.floor(Math.random() * 2) + 2; // 2-3 options for easy
  } else if (difficulty === 3) {
    optionCount = Math.floor(Math.random() * 2) + 5; // 5-6 options for hard
  }
  
  // Get similar symbols for distractors
  const distractors = getSimilarSymbols(symbol, optionCount - 1);
  
  // Create options array with correct answer and distractors
  const options = [symbol.name, ...distractors.map(d => d.name)];
  
  // Shuffle options
  const shuffledOptions = shuffleArray(options);
  
  // Create question
  return {
    id: `q-${symbol.id}`,
    symbolId: symbol.id,
    question: 'What does this symbol represent?',
    options: shuffledOptions,
    correctAnswer: symbol.name,
    difficulty: difficulty,
    explanation: `This symbol represents a ${symbol.name}, which is ${symbol.description}`
  };
};

/**
 * Generate quiz questions based on difficulty and symbol types
 * @param difficulty - The difficulty level (1=Easy, 2=Medium, 3=Hard)
 * @param types - Array of symbol types to include (empty array means all types)
 * @param count - Number of questions to generate
 * @returns Array of quiz questions
 */
export const generateQuizQuestions = (difficulty: number, types: string[] = [], count?: number): any[] => {
  // Determine complexity based on difficulty
  let complexities: number[] = [];
  
  if (difficulty === 1) { // Easy
    complexities = [1]; // Only easy symbols
    count = count || 10; // Default 10 questions for easy
  } else if (difficulty === 2) { // Medium
    complexities = [1, 2]; // Easy and medium symbols
    count = count || 15; // Default 15 questions for medium
  } else { // Hard
    complexities = [2, 3]; // Medium and hard symbols
    count = count || 20; // Default 20 questions for hard
  }
  
  // Get eligible symbols
  let eligibleSymbols: Symbol[] = [];
  
  complexities.forEach(complexity => {
    if (types.length === 0) {
      // If no types specified, get all symbols of this complexity
      eligibleSymbols = [...eligibleSymbols, ...getSymbolsByComplexity(complexity)];
    } else {
      // Otherwise, get symbols of specified types and complexity
      eligibleSymbols = [...eligibleSymbols, ...getSymbolsByTypesAndComplexity(types, complexity)];
    }
  });
  
  // If we don't have enough eligible symbols, add more from other complexities
  if (eligibleSymbols.length < count) {
    const allSymbols = getAllSymbols();
    const remainingSymbols = allSymbols.filter(s => 
      !eligibleSymbols.some(es => es.id === s.id) && 
      (types.length === 0 || types.includes(s.type))
    );
    
    eligibleSymbols = [...eligibleSymbols, ...remainingSymbols];
  }
  
  // Shuffle and limit to requested count
  const selectedSymbols = shuffleArray(eligibleSymbols).slice(0, count);
  
  // Generate questions
  return selectedSymbols.map(symbol => generateQuizQuestion(symbol, difficulty));
};

/**
 * Get the count of symbols by type
 * @param type - The type of symbols to count
 * @returns The count of symbols of the specified type
 */
export function getSymbolCountByType(type: string): number {
  return getAllSymbols().filter(symbol => symbol.type === type).length;
}

/**
 * Get total number of symbols
 * @returns The total count of symbols
 */
export function getTotalSymbolCount(): number {
  return getAllSymbols().length;
}

/**
 * Calculate the number of symbols available for a quiz based on criteria
 * @param types - Array of symbol types to include (empty array means all types)
 * @param complexities - Array of complexity levels
 * @returns The count of available symbols matching the criteria
 */
export const countAvailableSymbols = (types: string[] = [], complexities: number[] = []): number => {
  let availableSymbols: Symbol[] = [];
  
  if (types.length === 0 && complexities.length === 0) {
    // If no filters, return total symbol count
    return getAllSymbols().length;
  }
  
  complexities.forEach(complexity => {
    if (types.length === 0) {
      // If no types specified, get all symbols of this complexity
      availableSymbols = [...availableSymbols, ...getSymbolsByComplexity(complexity)];
    } else {
      // Otherwise, get symbols of specified types and complexity
      availableSymbols = [...availableSymbols, ...getSymbolsByTypesAndComplexity(types, complexity)];
    }
  });
  
  // If complexities array is empty, just filter by types
  if (complexities.length === 0 && types.length > 0) {
    availableSymbols = getAllSymbols().filter(s => types.includes(s.type));
  }
  
  return availableSymbols.length;
};

/**
 * Utility functions for handling assets
 */
import symbolsData from '../data/symbols.json';

/**
 * Get the image path for a symbol
 * @param {string} symbolRef - The reference ID of the symbol (e.g., "1.2")
 * @param {string} symbolType - The type of the symbol (e.g., "Landforms")
 * @param {string} symbolName - The name of the symbol (e.g., "Spur")
 * @returns {string} - The path to the image
 */
export const getSymbolImagePath = (symbolRef, symbolType, symbolName) => {
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
  
  // Build the path
  return `../../assets/${column} - ${symbolType} - ${symbolRef} - ${formattedName}.png`;
};

/**
 * Get all symbols with their metadata and image paths
 * @returns {Array} - Array of symbol objects
 */
export const getAllSymbols = () => {
  return symbolsData;
};

/**
 * Get symbols by type
 * @param {string} type - The type of symbols to get (e.g., "Landforms")
 * @returns {Array} - Array of symbol objects of the specified type
 */
export const getSymbolsByType = (type) => {
  return symbolsData.filter(symbol => symbol.type === type);
};

/**
 * Get symbol by ID
 * @param {string} id - The ID of the symbol to get
 * @returns {Object|null} - The symbol object or null if not found
 */
export const getSymbolById = (id) => {
  return symbolsData.find(symbol => symbol.id === id) || null;
};

/**
 * Get symbol by reference
 * @param {string} ref - The reference of the symbol to get (e.g., "1.2")
 * @returns {Object|null} - The symbol object or null if not found
 */
export const getSymbolByRef = (ref) => {
  return symbolsData.find(symbol => symbol.ref === ref) || null;
};

/**
 * Get all symbol types
 * @returns {Array} - Array of unique symbol types
 */
export const getAllSymbolTypes = () => {
  const types = symbolsData.map(symbol => symbol.type);
  return [...new Set(types)];
};

/**
 * Get all symbol columns
 * @returns {Array} - Array of unique symbol columns
 */
export const getAllSymbolColumns = () => {
  const columns = symbolsData.map(symbol => symbol.column);
  return [...new Set(columns)];
};

/**
 * Get symbols by complexity
 * @param {number} complexity - The complexity level (1=Easy, 2=Medium, 3=Hard)
 * @returns {Array} - Array of symbol objects of the specified complexity
 */
export const getSymbolsByComplexity = (complexity) => {
  return symbolsData.filter(symbol => symbol.complexity === complexity);
};

/**
 * Get symbols by types and complexity
 * @param {Array} types - Array of symbol types to include (e.g., ["Landforms", "Water_Features"])
 * @param {number} complexity - The complexity level (1=Easy, 2=Medium, 3=Hard)
 * @returns {Array} - Array of symbol objects matching the criteria
 */
export const getSymbolsByTypesAndComplexity = (types, complexity) => {
  return symbolsData.filter(symbol => 
    (types.length === 0 || types.includes(symbol.type)) && 
    symbol.complexity === complexity
  );
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} - A new shuffled array
 */
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Get similar symbols for generating plausible distractors
 * @param {Object} symbol - The target symbol
 * @param {number} count - Number of similar symbols to return
 * @param {Array} excludeIds - Array of symbol IDs to exclude
 * @returns {Array} - Array of similar symbols
 */
export const getSimilarSymbols = (symbol, count, excludeIds = []) => {
  // First try to get symbols of the same type
  let sameTypeSymbols = symbolsData.filter(s => 
    s.id !== symbol.id && 
    !excludeIds.includes(s.id) && 
    s.type === symbol.type
  );
  
  // If we don't have enough, add symbols from other types
  if (sameTypeSymbols.length < count) {
    const otherSymbols = symbolsData.filter(s => 
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
 * @param {Object} symbol - The symbol to create a question for
 * @param {number} difficulty - The difficulty level (1=Easy, 2=Medium, 3=Hard)
 * @returns {Object} - A quiz question object
 */
export const generateQuizQuestion = (symbol, difficulty) => {
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
 * @param {number} difficulty - The difficulty level (1=Easy, 2=Medium, 3=Hard)
 * @param {Array} types - Array of symbol types to include (empty array means all types)
 * @param {number} count - Number of questions to generate
 * @returns {Array} - Array of quiz questions
 */
export const generateQuizQuestions = (difficulty, types = [], count) => {
  // Determine complexity based on difficulty
  let complexities = [];
  
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
  let eligibleSymbols = [];
  
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

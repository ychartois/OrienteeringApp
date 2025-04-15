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

/**
 * Utility functions for handling assets
 */
import symbolsData from '../data/symbols.json';

export interface Symbol {
  id: string;
  ref: string;
  name: string;
  column: string;
  type: string;
  image: string;
  description?: string;
}

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
  
  // Build the path
  return `../../assets/${column} - ${symbolType} - ${symbolRef} - ${formattedName}.png`;
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

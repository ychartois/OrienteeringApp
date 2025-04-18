import { countAvailableSymbols } from '../../utils/assetUtils';

describe('countAvailableSymbols', () => {
  test('returns total symbol count when no filters are specified', () => {
    const result = countAvailableSymbols([], []);
    // We should have at least some symbols in our database
    expect(result).toBeGreaterThan(0);
  });

  test('returns filtered count when types are specified', () => {
    // First get count for a specific type
    const landformsCount = countAvailableSymbols(['Landforms'], []);
    
    // Then get count for all types
    const allTypesCount = countAvailableSymbols([], []);
    
    // The filtered count should be less than or equal to the total count
    expect(landformsCount).toBeLessThanOrEqual(allTypesCount);
    expect(landformsCount).toBeGreaterThan(0);
  });

  test('returns filtered count when complexities are specified', () => {
    // Get count for complexity level 1 (easy)
    const easySymbolsCount = countAvailableSymbols([], [1]);
    
    // Get count for all complexities
    const allComplexitiesCount = countAvailableSymbols([], []);
    
    // The filtered count should be less than or equal to the total count
    expect(easySymbolsCount).toBeLessThanOrEqual(allComplexitiesCount);
    expect(easySymbolsCount).toBeGreaterThan(0);
  });

  test('returns correct count when both types and complexities are specified', () => {
    // Get count for Landforms with complexity 1
    const easyLandformsCount = countAvailableSymbols(['Landforms'], [1]);
    
    // Get count for all Landforms
    const allLandformsCount = countAvailableSymbols(['Landforms'], []);
    
    // Get count for all easy symbols
    const allEasyCount = countAvailableSymbols([], [1]);
    
    // The filtered count should be less than or equal to both individual filters
    expect(easyLandformsCount).toBeLessThanOrEqual(allLandformsCount);
    expect(easyLandformsCount).toBeLessThanOrEqual(allEasyCount);
  });

  test('returns zero when no symbols match criteria', () => {
    // This assumes a non-existent type
    const result = countAvailableSymbols(['NonExistentType'], []);
    expect(result).toBe(0);
  });

  test('handles multiple types and complexities correctly', () => {
    const result = countAvailableSymbols(['Landforms', 'Water_Features'], [1, 2]);
    
    // These combined filters should return more symbols than just one type and complexity
    const singleFilter = countAvailableSymbols(['Landforms'], [1]);
    
    // Multiple filters should generally capture more symbols (or at least the same amount)
    // This might not always be true if the additional filters don't match any symbols
    expect(result).toBeGreaterThanOrEqual(singleFilter);
  });
});
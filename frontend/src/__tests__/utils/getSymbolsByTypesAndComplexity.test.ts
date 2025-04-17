import { getSymbolsByTypesAndComplexity } from '../../utils/assetUtils';
import type { Symbol } from '../../utils/assetUtils';

describe('getSymbolsByTypesAndComplexity', () => {
  test('returns symbols of specified complexity when no types are specified', () => {
    const result = getSymbolsByTypesAndComplexity([], 1);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(s => s.complexity === 1)).toBe(true);
  });

  test('returns symbols of specified type and complexity', () => {
    const result = getSymbolsByTypesAndComplexity(['Landforms'], 2);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(s => s.type === 'Landforms')).toBe(true);
    expect(result.every(s => s.complexity === 2)).toBe(true);
  });

  test('returns symbols of multiple specified types with correct complexity', () => {
    const result = getSymbolsByTypesAndComplexity(['Landforms', 'Water_Features'], 1);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(s => s.complexity === 1)).toBe(true);
    expect(result.some(s => s.type === 'Landforms') || result.some(s => s.type === 'Water_Features')).toBe(true);
  });

  test('returns symbols matching criteria only', () => {
    const result = getSymbolsByTypesAndComplexity(['Landforms'], 3);
    // If there are matching symbols, they should meet the criteria
    if (result.length > 0) {
      expect(result.every(s => s.type === 'Landforms')).toBe(true);
      expect(result.every(s => s.complexity === 3)).toBe(true);
    }
  });
});
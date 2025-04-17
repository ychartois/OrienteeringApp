import { shuffleArray } from '../../utils/assetUtils';

describe('shuffleArray', () => {
  test('returns an array of the same length', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    expect(shuffled.length).toBe(original.length);
  });

  test('contains all the same elements as the original array', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    expect(shuffled).toEqual(expect.arrayContaining(original));
    expect(original).toEqual(expect.arrayContaining(shuffled));
  });

  test('does not mutate the original array', () => {
    const original = [1, 2, 3, 4, 5];
    const originalCopy = [...original];
    shuffleArray(original);
    expect(original).toEqual(originalCopy);
  });

  test('returns a different array order in most cases', () => {
    // This test could theoretically fail due to random chance,
    // but the probability is extremely low with a large array
    const original = Array.from({ length: 20 }, (_, i) => i);
    let sameOrderCount = 0;
    
    // Run multiple shuffle attempts
    for (let i = 0; i < 10; i++) {
      const shuffled = shuffleArray(original);
      let allSamePosition = true;
      
      // Check if all elements are in the same position
      for (let j = 0; j < original.length; j++) {
        if (original[j] !== shuffled[j]) {
          allSamePosition = false;
          break;
        }
      }
      
      if (allSamePosition) {
        sameOrderCount++;
      }
    }
    
    // It's extremely unlikely to get the same order more than once in 10 attempts
    expect(sameOrderCount).toBeLessThan(2);
  });
});
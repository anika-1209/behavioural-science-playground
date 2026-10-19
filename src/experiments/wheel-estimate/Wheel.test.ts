import { describe, expect, it } from 'vitest';
import { rotationFor } from './Wheel';

describe('wheel', () => {
  it('lands the target value under the pointer', () => {
    for (const v of [10, 65]) {
      const rest = (rotationFor(v) + (v / 5) * 18) % 360;
      expect(rest).toBe(0);
    }
  });
});

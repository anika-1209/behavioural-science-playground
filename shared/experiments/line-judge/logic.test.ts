import { describe, expect, it } from 'vitest';
import { ROUNDS, correctOf, wasPulled, wentWithGroup, whatHappened } from './logic';

const allRight = ROUNDS.map(correctOf).join('');
const allGroup = ROUNDS.map((r) => r.group).join('');

describe('rounds', () => {
  it('has exactly one matching line per round', () => {
    for (const r of ROUNDS) expect(r.opts.filter((o) => o === r.ref)).toHaveLength(1);
  });

  it('scripts a wrong group answer on critical rounds only', () => {
    for (const r of ROUNDS) expect(r.group === correctOf(r)).toBe(!r.critical);
    expect(ROUNDS[0]!.critical).toBeFalsy(); // Asch opened with neutral rounds
    expect(ROUNDS[1]!.critical).toBeFalsy();
  });

  it('keeps every wrong line at least 20% off the reference', () => {
    for (const r of ROUNDS) {
      for (const o of r.opts.filter((x) => x !== r.ref)) expect(Math.abs(o - r.ref) / r.ref).toBeGreaterThanOrEqual(0.2);
    }
  });
});

describe('result logic', () => {
  it('counts critical rounds where the player went with the group', () => {
    expect(wentWithGroup({ picks: allGroup })).toBe(6);
    expect(wentWithGroup({ picks: allRight })).toBe(0);
    expect(wasPulled({ picks: allRight })).toBe(false);
  });

  it('describes the user’s own answers, reveals the script and never names the bias (P3-1, P3-4)', () => {
    expect(whatHappened(null, { picks: allGroup })).toContain('On 6 of the 6 rounds');
    const resisted = whatHappened(null, { picks: allRight });
    expect(resisted).toContain('resisted');
    for (const text of [resisted, whatHappened(null, { picks: allGroup })]) {
      expect(text).toContain('scripted');
      expect(text.toLowerCase()).not.toContain('conformity');
    }
  });
});

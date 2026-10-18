import type { Answers } from '../../lib/progress';

// experimentConfig + resultLogic for exp-01.
export const ANCHOR: Record<string, number> = { low: 10, high: 65 };
/** Median estimates per condition in the original study. */
export const STUDY_MEDIAN: Record<string, number> = { low: 25, high: 45 };
/** 54 of 193 UN member states. */
export const TRUE_PCT = 28;
/** Midpoint between the two study medians: which side of it the user landed on. */
const SPLIT = 35;

export const anchorFor = (condition: string | null) => ANCHOR[condition ?? 'low'] ?? ANCHOR.low!;

export function parseEstimate(raw: string): number | null {
  const s = raw.trim();
  if (!/^\d{1,3}$/.test(s)) return null;
  const n = Number(s);
  return n >= 0 && n <= 100 ? n : null;
}

export function wasPulled(condition: string | null, estimate: number) {
  return condition === 'high' ? estimate >= SPLIT : estimate <= SPLIT;
}

export function whatHappened(condition: string | null, answers: Answers): string {
  const e = Number(answers.estimate);
  const pulled = wasPulled(condition, e);
  if (condition === 'high') {
    return pulled
      ? `Your wheel showed 65 and you guessed ${e}%, well above the real answer of 28%. That matches the high-wheel group in the original study, who guessed 45%. A number you knew was meaningless still pulled your estimate up.`
      : `Your wheel showed 65, but your guess of ${e}% stayed near the real answer of 28%. You resisted the pull this time. Most people don't: in the original study, people who saw 65 guessed 45%.`;
  }
  return pulled
    ? `Your wheel showed 10 and you guessed ${e}%, close to the low-wheel group in the original study, who guessed 25%. The real answer, 28%, happens to sit near that group's guess. Had your wheel shown 65, you would most likely have guessed around 20 points higher.`
    : `Your wheel showed 10, but you guessed ${e}%, well above the low-wheel group in the original study, who guessed 25%. You resisted the pull of the small number this time. Most people don't.`;
}

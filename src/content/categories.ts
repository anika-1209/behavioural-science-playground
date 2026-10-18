import type { CategoryId } from './types';

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'judgement', label: 'Judgement & estimation' },
  { id: 'choices', label: 'Choices & framing' },
  { id: 'memory', label: 'Memory & perception' },
  { id: 'social', label: 'Social influence' },
  { id: 'self', label: 'Self & time' },
];

export const categoryLabel = (id: CategoryId) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

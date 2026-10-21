import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { live } from './live';
import { whatHappened } from '../../../shared/experiments/first-impressions/logic';

// exp-16 "First impressions": rate a note by Sam, described as warm or as cold.
const firstImpressions: ExperimentDefinition = { Task, Result, whatHappened, live };

export default firstImpressions;

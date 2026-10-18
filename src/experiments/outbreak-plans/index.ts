import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { whatHappened } from './logic';

// exp-04 "The outbreak": choose a plan worded as lives saved or lives lost.
const outbreakPlans: ExperimentDefinition = { Task, Result, whatHappened };

export default outbreakPlans;

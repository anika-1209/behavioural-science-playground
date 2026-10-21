import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { live } from './live';
import { whatHappened } from '../../../shared/experiments/before-after/logic';

// exp-13 "Before and after": six estimates, the real answers, then recall the estimates.
const beforeAfter: ExperimentDefinition = { Task, Result, whatHappened, live };

export default beforeAfter;

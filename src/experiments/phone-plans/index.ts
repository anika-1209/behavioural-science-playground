import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { live } from './live';
import { whatHappened } from '../../../shared/experiments/phone-plans/logic';

// exp-05 "Pick a plan": choose a phone plan from two main plans and a third.
const phonePlans: ExperimentDefinition = { Task, Result, whatHappened, live };

export default phonePlans;

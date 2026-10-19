import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { live } from './live';
import { whatHappened } from '../../../shared/experiments/wheel-estimate/logic';

// exp-01 "Guess the number": spin a wheel set to 10 or 65, then estimate.
const wheelEstimate: ExperimentDefinition = { Task, Result, whatHappened, live };

export default wheelEstimate;

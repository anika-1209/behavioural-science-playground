import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { live } from './live';
import { whatHappened } from '../../../shared/experiments/next-flip/logic';

// exp-11 "Next flip": bet on the next toss of a fair coin after six sequences.
const nextFlip: ExperimentDefinition = { Task, Result, whatHappened, live };

export default nextFlip;

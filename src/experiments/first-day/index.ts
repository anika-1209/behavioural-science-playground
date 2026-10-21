import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { live } from './live';
import { whatHappened } from '../../../shared/experiments/first-day/logic';

// exp-14 "First day forms": a new starter form with every choice already set, one way or the other.
const firstDay: ExperimentDefinition = { Task, Result, whatHappened, live };

export default firstDay;

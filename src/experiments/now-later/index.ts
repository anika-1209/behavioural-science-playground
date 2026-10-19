import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { live } from './live';
import { whatHappened } from '../../../shared/experiments/now-later/logic';

// exp-10 "Now or later": £100 sooner or more a week later, today or a year out.
const nowLater: ExperimentDefinition = { Task, Result, whatHappened, live };

export default nowLater;

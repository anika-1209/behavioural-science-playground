import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { whatHappened } from './logic';

// exp-10 "Now or later": £100 sooner or more a week later, today or a year out.
const nowLater: ExperimentDefinition = { Task, Result, whatHappened };

export default nowLater;

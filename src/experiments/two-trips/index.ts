import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { whatHappened } from './logic';

// exp-06 "The weekend away": two non-refundable trips on the same weekend.
const twoTrips: ExperimentDefinition = { Task, Result, whatHappened };

export default twoTrips;

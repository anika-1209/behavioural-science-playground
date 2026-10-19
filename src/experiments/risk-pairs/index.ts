import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { live } from './live';
import { whatHappened } from '../../../shared/experiments/risk-pairs/logic';

// exp-02 "Which is more common?": pick the deadlier cause in five pairs.
const riskPairs: ExperimentDefinition = { Task, Result, whatHappened, live };

export default riskPairs;

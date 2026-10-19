import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { live } from './live';
import { whatHappened } from '../../../shared/experiments/line-judge/logic';

// exp-09 "Line up": match line lengths after seeing scripted "previous players".
const lineJudge: ExperimentDefinition = { Task, Result, whatHappened, live };

export default lineJudge;

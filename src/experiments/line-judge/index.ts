import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { whatHappened } from '../../../shared/experiments/line-judge/logic';

// exp-09 "Line up": match line lengths after seeing scripted "previous players".
const lineJudge: ExperimentDefinition = { Task, Result, whatHappened };

export default lineJudge;

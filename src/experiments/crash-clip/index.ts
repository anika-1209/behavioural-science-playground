import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { whatHappened } from './logic';

// exp-08 "Eyewitness": watch a crash clip, then answer questions about it.
const crashClip: ExperimentDefinition = { Task, Result, whatHappened };

export default crashClip;

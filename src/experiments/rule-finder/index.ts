import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { whatHappened } from './logic';

// exp-07 "Crack the rule": test number triples to find the rule behind 2, 4, 6.
const ruleFinder: ExperimentDefinition = { Task, Result, whatHappened };

export default ruleFinder;

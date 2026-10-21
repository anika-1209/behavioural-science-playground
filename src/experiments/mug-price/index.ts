import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { live } from './live';
import { whatHappened } from '../../../shared/experiments/mug-price/logic';

// exp-15 "What's it worth?": price a mug as its new owner or as a buyer.
const mugPrice: ExperimentDefinition = { Task, Result, whatHappened, live };

export default mugPrice;

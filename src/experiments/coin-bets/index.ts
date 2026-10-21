import type { ExperimentDefinition } from '../types';
import { Task } from './Task';
import { Result } from './Result';
import { live } from './live';
import { whatHappened } from '../../../shared/experiments/coin-bets/logic';

// exp-12 "Coin toss bets": six 50/50 bets, lose £10 or win £10–£30.
const coinBets: ExperimentDefinition = { Task, Result, whatHappened, live };

export default coinBets;

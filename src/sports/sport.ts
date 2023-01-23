import { Sport } from '../victor-bet-types';

const _compFunc = (firstSport: Sport, secondSport: Sport) =>
  firstSport.pos - secondSport.pos;
export const sortSportsByPos = (sports: Sport[]): Sport[] =>
  [...sports].sort(_compFunc);

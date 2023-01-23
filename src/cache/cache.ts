import NodeCache from 'node-cache';
import { SUPPORTED_LANGUAGES } from '../enums';
import { Either } from '../types/generic-types';
import { toSuccess } from '../helpers';
import { GameEvent, VictorBetResult } from '../types/victor-bet-types';
import { DEFAULT_LANGUAGE } from '../const';
import { sortSportsByPos } from '../sports/sport';
import { getVictorBetResult } from '../victor-bet/victor-bet';

export const cleanUpCache = (cache: NodeCache): void => {
  cache.flushAll();
  cache.close();
};

export const cacheContainsDataForLanguage = (
  cache: NodeCache,
  lang: SUPPORTED_LANGUAGES
): boolean => !!cache.get(`${lang}_sortedSports`);

export const populateCacheWithSportsAndEvents = (
  cache: NodeCache,
  data: VictorBetResult,
  lang = DEFAULT_LANGUAGE
): void => {
  const sports = data.sports;
  // collect all events and add the to the cache at the end
  let allEvents: GameEvent[] = [];
  for (const sport of sports) {
    const currentSportKey = 'sport_' + sport.id;
    const currentSportEventsKey = currentSportKey + '_events';

    // set the sport data with the sport key
    cache.set(currentSportKey, sport);

    // collect all the events per current sport
    let eventsPerSport: GameEvent[] = [];
    for (const comp of sport.comp) {
      eventsPerSport = [...eventsPerSport, ...comp.events];

      for (const event of comp.events) {
        // insert individually each event for later usage
        cache.set('event_' + event.id, event);
      }
    }

    cache.set(currentSportEventsKey, eventsPerSport);
    allEvents = [...allEvents, ...eventsPerSport];
  }

  const sortedSports = sortSportsByPos(sports);
  cache.set(lang + '_sortedSports', sortedSports);
  cache.set(lang + '_allEvents', allEvents);
};

export const getCacheData = async (
  cache: NodeCache,
  victorBetBaseURL: string,
  victorBetSuffixURL: string,
  lang = DEFAULT_LANGUAGE
): Promise<Either<Error, NodeCache>> => {
  if (!cacheContainsDataForLanguage(cache, lang)) {
    const url = `${victorBetBaseURL}${lang}${victorBetSuffixURL}`;
    const maybeVictorBetResult = await getVictorBetResult(url);
    if (!maybeVictorBetResult.ok) {
      return maybeVictorBetResult;
    }

    populateCacheWithSportsAndEvents(cache, maybeVictorBetResult.value, lang);
  }

  return toSuccess(200, cache);
};

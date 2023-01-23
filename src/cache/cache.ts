import NodeCache from 'node-cache';
import { ERROR_MESSAGES, SUPPORTED_LANGUAGES } from '../enums';
import axios from 'axios';
import { Either } from '../types/generic-types';
import { toFailure, toSuccess } from '../helpers';
import { GameEvent, VictorBetResult } from '../types/victor-bet-types';
import { DEFAULT_LANGUAGE } from '../const';
import { sortSportsByPos } from '../sports/sport';

export const cleanUpCache = (cache: NodeCache): void => {
  cache.flushAll();
  cache.close();
};

export const cacheContainsDataForLanguage = (
  cache: NodeCache,
  lang: SUPPORTED_LANGUAGES
): boolean => {
  const result = cache.get(`${lang}_sortedSports`);
  if (!result) {
    return false;
  }
  return Object.keys(result).length !== 0;
};

export const getVictorBetResult = async (
  eventsSourceUrl: string
): Promise<Either<Error, VictorBetResult>> => {
  const response = await axios.get(eventsSourceUrl);

  // handle errors for most common http error codes
  if (response.status === 400) {
    console.log(
      `[getVictorBetResult]: Error while retrieving data from ${eventsSourceUrl}. 400 Bad Request`
    );
    return toFailure(
      400,
      `[getVictorBetResult]: ${ERROR_MESSAGES.DATA_NOT_AVAILABLE}`
    );
  }

  if (response.status === 404) {
    console.log(
      `[getVictorBetResult]: Error while retrieving data from ${eventsSourceUrl}. 404 Not Found`
    );
    return toFailure(
      404,
      `[getVictorBetResult]: ${ERROR_MESSAGES.DATA_NOT_AVAILABLE}`
    );
  }

  if (response.status === 500) {
    console.log(
      `[getVictorBetResult]: Error while retrieving data from ${eventsSourceUrl}. 500 Internal Server Error`
    );
    return toFailure(
      500,
      `[getVictorBetResult]: ${ERROR_MESSAGES.DATA_NOT_AVAILABLE}`
    );
  }

  // extra custom error handling
  if (!response.data.status.success) {
    const { errorCode, extraInfo } = response.data.status;
    console.log(
      `[getVictorBetResult]: Error while retrieving data from ${eventsSourceUrl}, errorCode: ${errorCode}, extraInfo: ${extraInfo}`
    );
    return toFailure(
      500,
      `[getVictorBetResult]: ${ERROR_MESSAGES.DATA_NOT_AVAILABLE}`
    );
  }

  return toSuccess(200, response.data.result);
};

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

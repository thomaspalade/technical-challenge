import NodeCache from 'node-cache';
import { ERROR_MESSAGES, SUPPORTED_LANGUAGES } from '../enums';
import axios from 'axios';
import { Either } from '../generic-types';
import { toFailure, toSuccess } from '../helpers';
import { VictorBetResult } from '../victor-bet-types';

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

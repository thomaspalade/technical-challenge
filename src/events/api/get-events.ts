import { Request, RequestHandler, Response } from 'express';
import { getCacheData } from '../../cache/cache';
import { ENV_CONFIG } from '../../env';
import { ERROR_MESSAGES } from '../../enums';
import { DEFAULT_LANGUAGE } from '../../const';

export const getEvents: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const maybeCachedData = await getCacheData(
    ENV_CONFIG.cacheInstance,
    ENV_CONFIG.victorBetBaseURL,
    ENV_CONFIG.victorBetSuffixURL
  );
  if (!maybeCachedData.ok) {
    res.status(maybeCachedData.status).send({
      message: ERROR_MESSAGES.CACHED_DATA_NOT_AVAILABLE,
    });
    return;
  }

  const cachedData = maybeCachedData.value;
  if (req.query && req.query.sportId) {
    res.status(200).send({
      eventsBySportId: cachedData.get('sport_' + req.query.sportId + '_events'),
    });
    return;
  }

  res.status(200).send({
    allEvents: cachedData.get(DEFAULT_LANGUAGE + '_allEvents'),
  });
  return;
};

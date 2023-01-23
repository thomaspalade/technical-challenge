import { Request, RequestHandler, Response } from 'express';
import { ENV_CONFIG } from '../../env';
import { getCacheData } from '../../cache/cache';
import { DEFAULT_LANGUAGE } from '../../const';
import { ERROR_MESSAGES } from '../../enums';

export const getAllSports: RequestHandler = async (
  _req: Request,
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
  res.status(200).send({
    sortedSports: cachedData.get(DEFAULT_LANGUAGE + '_sortedSports'),
  });
};

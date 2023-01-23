import { Request, RequestHandler, Response } from 'express';
import { getCacheData } from '../../cache/cache';
import { ENV_CONFIG } from '../../env';
import { ERROR_MESSAGES } from '../../enums';

export const getEventData: RequestHandler = async (
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
  const maybeEventData = cachedData.get('event_' + req.params.eventId);
  if (!maybeEventData) {
    res.status(404).send({
      message: ERROR_MESSAGES.EVENT_NOT_FOUND,
    });
    return;
  }

  res.status(200).send({
    eventData: maybeEventData,
  });
};

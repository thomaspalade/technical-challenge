import { Request, RequestHandler, Response } from 'express';
import { ENV_CONFIG } from '../../env';
import { getCacheData } from '../../cache/cache';
import { isSupportedLanguage } from '../../helpers';
import { ERROR_MESSAGES, SUPPORTED_LANGUAGES } from '../../enums';

export const getAllSportsInAllLanguanges: RequestHandler = async (
  req: Request,
  res: Response
) => {
  if (
    req.params.languageCode &&
    !isSupportedLanguage(req.params.languageCode as SUPPORTED_LANGUAGES)
  ) {
    res.status(400).send({
      message: ERROR_MESSAGES.LANGUAGE_NOT_SUPPORTED,
    });
    return;
  }

  const lang = req.params.languageCode as SUPPORTED_LANGUAGES;
  const maybeCachedData = await getCacheData(
    ENV_CONFIG.cacheInstance,
    ENV_CONFIG.victorBetBaseURL,
    ENV_CONFIG.victorBetSuffixURL,
    lang
  );
  if (!maybeCachedData.ok) {
    res.status(maybeCachedData.status).send({
      message: ERROR_MESSAGES.CACHED_DATA_NOT_AVAILABLE,
    });
    return;
  }

  const cachedData = maybeCachedData.value;
  const maybeSortedSports = cachedData.get(lang + '_sortedSports');
  if (!maybeSortedSports) {
    res.status(404).send({
      message: ERROR_MESSAGES.SPORTS_NOT_FOUND,
    });
    return;
  }

  res.status(200).send({
    sortedSports: maybeSortedSports,
  });
};

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
      message: 'Language not supported yet',
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
      message: 'Sports not found for the current language',
    });
    return;
  }

  res.status(200).send({
    sortedSports: maybeSortedSports,
  });
};

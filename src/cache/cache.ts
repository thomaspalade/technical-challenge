import NodeCache from "node-cache";
import { SUPPORTED_LANGUAGES } from "../enums";

export const cleanUpCache = (cache: NodeCache): void => {
  cache.flushAll();
  cache.close();
};

export const cacheContainsDataForLanguage = 
  (cache: NodeCache, lang: SUPPORTED_LANGUAGES): boolean => {
    const result = cache.get(`${lang}_sortedSports`);
    if (!result) {
      return false;
    }
    return Object.keys(result).length !== 0;
  };
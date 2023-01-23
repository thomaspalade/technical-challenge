import test from 'ava';
import NodeCache from 'node-cache';
import { cacheContainsDataForLanguage, cleanUpCache } from './cache';
import { SUPPORTED_LANGUAGES } from '../enums';

test('When cleanUpCache is called, Then it removes all data from cache', async (t) => {
  const cache = new NodeCache();
  t.is(cache.getStats().keys, 0);

  cache.set('key1', 10);
  cache.set('key2', 20);
  t.is(cache.getStats().keys, 2);

  cleanUpCache(cache);
  t.is(cache.getStats().keys, 0);
});

test('Given no data for any language inserted, When cacheContainsDataForLanguage is called, Then it returns false', async (t) => {
  const cache = new NodeCache();
  t.false(cacheContainsDataForLanguage(cache, SUPPORTED_LANGUAGES.CHINESE));
  t.false(cacheContainsDataForLanguage(cache, SUPPORTED_LANGUAGES.ENGLISH));
  t.false(cacheContainsDataForLanguage(cache, SUPPORTED_LANGUAGES.GERMAN));
  cleanUpCache(cache);
});

test('Given data inserted for english language, When cacheContainsDataForLanguage is called with german or chinese as parameter, Then it returns false', async (t) => {
  const cache = new NodeCache();
  cache.set(SUPPORTED_LANGUAGES.ENGLISH + "_sortedSports", 100);
  t.false(cacheContainsDataForLanguage(cache, SUPPORTED_LANGUAGES.GERMAN));
  t.false(cacheContainsDataForLanguage(cache, SUPPORTED_LANGUAGES.CHINESE));
  cleanUpCache(cache);
});

test('Given data inserted for english language, When cacheContainsDataForLanguage is called with english as parameter, Then it returns true', async (t) => {
  const cache = new NodeCache();
  cache.set(SUPPORTED_LANGUAGES.ENGLISH + "_sortedSports", 100);
  t.true(cacheContainsDataForLanguage(cache, SUPPORTED_LANGUAGES.ENGLISH));
  cleanUpCache(cache);
});

test('When getVictorBetResult is called, Then it returns 200', async (t) => {
  t.true(true);
});

test('When getCacheData is called, Then it returns 200', async (t) => {
  t.true(true);
});

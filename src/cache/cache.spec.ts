import test from 'ava';
import NodeCache from 'node-cache';
import {
  cacheContainsDataForLanguage,
  cleanUpCache,
  getCacheData,
} from './cache';
import { SUPPORTED_LANGUAGES } from '../enums';
import nock from 'nock';
import { VICTOR_BET_RESULT } from '../test-support/data/victor-bet';
import { Success } from '../types/generic-types';
import sinon from 'sinon';
import * as victorBetFunctions from '../victor-bet/victor-bet';
import * as cacheFunctions from './cache';
import { toFailure, toSuccess } from '../helpers';

test.afterEach(async () => {
  nock.cleanAll();
  sinon.restore();
});

test('When `cleanUpCache` is called, Then it removes all data from cache', async (t) => {
  const cache = new NodeCache();
  t.is(cache.getStats().keys, 0);

  cache.set('key1', 10);
  cache.set('key2', 20);
  t.is(cache.getStats().keys, 2);

  cleanUpCache(cache);
  t.is(cache.getStats().keys, 0);
});

test('Given no data for any language inserted, When `cacheContainsDataForLanguage` is called, Then it returns false', async (t) => {
  const cache = new NodeCache();
  t.false(cacheContainsDataForLanguage(cache, SUPPORTED_LANGUAGES.CHINESE));
  t.false(cacheContainsDataForLanguage(cache, SUPPORTED_LANGUAGES.ENGLISH));
  t.false(cacheContainsDataForLanguage(cache, SUPPORTED_LANGUAGES.GERMAN));
  cleanUpCache(cache);
});

test('Given data inserted for english language, When `cacheContainsDataForLanguage` is called with german or chinese as parameter, Then it returns false', async (t) => {
  const cache = new NodeCache();
  cache.set(SUPPORTED_LANGUAGES.ENGLISH + '_sortedSports', 100);
  t.false(cacheContainsDataForLanguage(cache, SUPPORTED_LANGUAGES.GERMAN));
  t.false(cacheContainsDataForLanguage(cache, SUPPORTED_LANGUAGES.CHINESE));
  cleanUpCache(cache);
});

test('Given data inserted for english language, When `cacheContainsDataForLanguage` is called with english as parameter, Then it returns true', async (t) => {
  const cache = new NodeCache();
  cache.set(SUPPORTED_LANGUAGES.ENGLISH + '_sortedSports', 100);
  t.true(cacheContainsDataForLanguage(cache, SUPPORTED_LANGUAGES.ENGLISH));
  cleanUpCache(cache);
});

test('When `getCacheData` is called, Then it returns 200 status', async (t) => {
  const cache = new NodeCache();
  const result = await getCacheData(
    cache,
    'https://partners.betvictor.mobi/',
    '/in-play/1/events'
  );
  t.is(result.status, 200);
});

test('When `getCacheData` is called, Then it returns a `Success` object that contains the cache data', async (t) => {
  const cache = new NodeCache();
  cache.set('key1', 200);
  cache.set('key2', 300);
  cache.set('en-gb_sortedSports', 300);
  const resultCache = (
    (await getCacheData(
      cache,
      'https://partners.betvictor.mobi/',
      '/in-play/1/events'
    )) as Success<NodeCache>
  ).value;
  t.is(resultCache.get('key1'), 200);
  t.is(resultCache.get('key2'), 300);
});

test('When `getCacheData` is called for a new language, Then it calls the `getVictorBetResult` function', async (t) => {
  const cache = new NodeCache();

  const getVictorBetResultStub = sinon
    .stub(victorBetFunctions, 'getVictorBetResult')
    .resolves(
      toSuccess(200, {
        ...VICTOR_BET_RESULT,
      })
    );

  await getCacheData(
    cache,
    'https://partners.betvictor.mobi/',
    '/in-play/1/events'
  );

  t.true(getVictorBetResultStub.called);
});

test('When `getCacheData` is called for a new language, Then it calls the `populateCacheWithSportsAndEvents` function', async (t) => {
  const cache = new NodeCache();

  const getVictorBetResultStub = sinon
    .stub(victorBetFunctions, 'getVictorBetResult')
    .resolves(
      toSuccess(200, {
        ...VICTOR_BET_RESULT,
      })
    );

  const populateCacheWithSportsAndEventsStub = sinon.stub(
    cacheFunctions,
    'populateCacheWithSportsAndEvents'
  );

  await getCacheData(
    cache,
    'https://partners.betvictor.mobi/',
    '/in-play/1/events'
  );

  t.true(getVictorBetResultStub.called);
  t.true(populateCacheWithSportsAndEventsStub.called);
});

test('When `getCacheData` is called and the `getVictorBetResult` function returns a failure, Then it returns a failure, as well', async (t) => {
  const cache = new NodeCache();

  const getVictorBetResultStub = sinon
    .stub(victorBetFunctions, 'getVictorBetResult')
    .resolves(toFailure(400, 'Some Error'));

  const result = await getCacheData(
    cache,
    'https://partners.betvictor.mobi/',
    '/in-play/1/events'
  );

  t.is(result.status, 400);
  t.true(getVictorBetResultStub.called);
});

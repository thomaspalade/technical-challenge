import test from 'ava';
import nock from 'nock';
import {
  DEFAULT_VICTOR_BET_URL,
  VICTOR_BET_DEFAULT_RESPONSE,
  VICTOR_BET_ERROR_RESPONSE,
  VICTOR_BET_RESULT,
} from '../test-support/data/victor-bet';
import { Success } from '../types/generic-types';
import { VictorBetResult } from '../types/victor-bet-types';
import sinon from 'sinon';
import { getVictorBetResult } from './victor-bet';

test.afterEach(async () => {
  nock.cleanAll();
  sinon.restore();
});

test('When `getVictorBetResult` is hit, Then it returns 200 status', async (t) => {
  const scope = nock(DEFAULT_VICTOR_BET_URL)
    .get('')
    .reply(200, VICTOR_BET_DEFAULT_RESPONSE);

  const response = await getVictorBetResult(DEFAULT_VICTOR_BET_URL);
  t.is(response.status, 200);
  t.true(scope.isDone());
});

test('When `getVictorBetResult` is hit and the source url returns 200, Then it returns a VictorBetResult', async (t) => {
  const scope = nock(DEFAULT_VICTOR_BET_URL)
    .get('')
    .reply(200, VICTOR_BET_DEFAULT_RESPONSE);

  const result = (
    (await getVictorBetResult(
      DEFAULT_VICTOR_BET_URL
    )) as Success<VictorBetResult>
  ).value;
  t.deepEqual(result, VICTOR_BET_RESULT);
  t.true(scope.isDone());
});

test('When `getVictorBetResult` is hit and the source url returns 400, Then it returns 400 status further', async (t) => {
  const scope = nock(DEFAULT_VICTOR_BET_URL)
    .get('')
    .reply(400, VICTOR_BET_DEFAULT_RESPONSE);

  const result = await getVictorBetResult(DEFAULT_VICTOR_BET_URL);
  t.is(result.status, 400);
  t.true(scope.isDone());
});

test('When `getVictorBetResult` is hit and the source url returns 404, Then it returns 404 status further', async (t) => {
  const scope = nock(DEFAULT_VICTOR_BET_URL)
    .get('')
    .reply(404, VICTOR_BET_DEFAULT_RESPONSE);

  const result = await getVictorBetResult(DEFAULT_VICTOR_BET_URL);
  t.is(result.status, 404);
  t.true(scope.isDone());
});

test('When `getVictorBetResult` is hit and the source url returns 500, Then it returns 500 status further', async (t) => {
  const scope = nock(DEFAULT_VICTOR_BET_URL)
    .get('')
    .reply(500, VICTOR_BET_DEFAULT_RESPONSE);

  const result = await getVictorBetResult(DEFAULT_VICTOR_BET_URL);
  t.is(result.status, 500);
  t.true(scope.isDone());
});

test('When `getVictorBetResult` is hit and the source url returns 200 but with a custom error, Then it returns 500 status failure', async (t) => {
  const scope = nock(DEFAULT_VICTOR_BET_URL)
    .get('')
    .reply(200, VICTOR_BET_ERROR_RESPONSE);

  const result = await getVictorBetResult(DEFAULT_VICTOR_BET_URL);
  t.is(result.status, 500);
  t.true(scope.isDone());
});

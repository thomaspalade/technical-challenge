import test from 'ava';
import nock from 'nock';
import { StoppableServer } from 'stoppable';
import request from 'supertest';
import {
  VICTOR_BET_BIG_RESULT,
  VICTOR_BET_RESULT,
  VICTOR_BET_SPORT_EXAMPLE,
} from '../../test-support/data/victor-bet';
import { ERROR_MESSAGES } from '../../enums';
import * as cacheFunctions from '../../cache/cache';
import { toFailure, toSuccess } from '../../helpers';
import sinon from 'sinon';
import { ENV_CONFIG } from '../../env';
import * as victorBetFunctions from '../../victor-bet/victor-bet';

let server: StoppableServer;

test.before(async () => {
  server = require('../../index').default;
});

test.afterEach(async () => {
  nock.cleanAll();
  sinon.restore();
  ENV_CONFIG.cacheInstance.flushAll();
});

test.after(async () => {
  server.close();
});

const sendAuthenticatedRequestWithoutLanguage =
  async (): Promise<request.Test> => {
    return request(server).get(`/v1/sports`).send();
  };

const sendAuthenticatedRequestWithLanguage = async (
  languageCode: string
): Promise<request.Test> => {
  return request(server).get(`/v1/sports/lang/${languageCode}`).send();
};

test('Given no data, When `GET /v1/sports/lang/:languageCode` is hit, Then it responds with an empty array', async (t) => {
  const getVictorBetResultStub = sinon
    .stub(victorBetFunctions, 'getVictorBetResult')
    .resolves(
      toSuccess(200, {
        ...VICTOR_BET_RESULT,
      })
    );

  const response = await sendAuthenticatedRequestWithoutLanguage();
  t.is(response.status, 200);
  t.deepEqual(response.body.sortedSports, []);
  t.true(getVictorBetResultStub.called);
});

test('Given the cache data is not available, When `GET /v1/sports/lang/:languageCode` is hit without sport parameter, Then it responds with a correct status and a relevant message', async (t) => {
  const getVictorBetResultStub = sinon
    .stub(cacheFunctions, 'getCacheData')
    .resolves(toFailure(402, 'Some Error'));

  const response = await sendAuthenticatedRequestWithoutLanguage();
  t.is(response.status, 402);
  t.is(response.body.message, ERROR_MESSAGES.CACHED_DATA_NOT_AVAILABLE);
  t.is(getVictorBetResultStub.called, true);
});

test('When `GET /v1/sports/lang/:languageCode` is hit, Then it responds with a correct data', async (t) => {
  const getVictorBetResultStub = sinon
    .stub(victorBetFunctions, 'getVictorBetResult')
    .resolves(
      toSuccess(200, {
        ...VICTOR_BET_BIG_RESULT,
      })
    );

  const response = await sendAuthenticatedRequestWithoutLanguage();
  t.is(response.status, 200);
  t.deepEqual(response.body.sortedSports, [VICTOR_BET_SPORT_EXAMPLE]);
  t.is(getVictorBetResultStub.called, true);
});

test('When `GET /v1/sports/lang/:languageCode` is hit with an invalid language, Then it responds an error', async (t) => {
  const response = await sendAuthenticatedRequestWithLanguage('fr');
  t.is(response.status, 400);
  t.deepEqual(response.body.message, ERROR_MESSAGES.LANGUAGE_NOT_SUPPORTED);
});

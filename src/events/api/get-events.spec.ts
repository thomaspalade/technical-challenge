import test from 'ava';
import nock from 'nock';
import { StoppableServer } from 'stoppable';
import request from 'supertest';
import {
  SPORT_ID,
  VICTOR_BET_BIG_RESULT,
  VICTOR_BET_EVENT_EXAMPLE,
  VICTOR_BET_RESULT,
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

const sendAuthenticatedRequestWithoutSportId =
  async (): Promise<request.Test> => {
    return request(server).get(`/v1/events`).send();
  };

const sendAuthenticatedRequestWithSportId = async (
  sportId: string
): Promise<request.Test> => {
  return request(server).get(`/v1/events`).query({ sportId }).send();
};

test('Given no data, When `GET /v1/events` is hit, Then it responds with an empty array', async (t) => {
  const getVictorBetResultStub = sinon
    .stub(victorBetFunctions, 'getVictorBetResult')
    .resolves(
      toSuccess(200, {
        ...VICTOR_BET_RESULT,
      })
    );

  const response = await sendAuthenticatedRequestWithoutSportId();
  t.is(response.status, 200);
  t.deepEqual(response.body.allEvents, []);
  t.true(getVictorBetResultStub.called);
});

test('Given the cache data is not available, When `GET /v1/events` is hit without sport parameter, Then it responds with a correct status and a relevant message', async (t) => {
  const getVictorBetResultStub = sinon
    .stub(cacheFunctions, 'getCacheData')
    .resolves(toFailure(402, 'Some Error'));

  const response = await sendAuthenticatedRequestWithoutSportId();
  t.is(response.status, 402);
  t.is(response.body.message, ERROR_MESSAGES.CACHED_DATA_NOT_AVAILABLE);
  t.is(getVictorBetResultStub.called, true);
});

test('Given the cache data is not available, When `GET /v1/events` is hit with sport parameter, Then it responds with a correct status and a relevant message', async (t) => {
  const getVictorBetResultStub = sinon
    .stub(cacheFunctions, 'getCacheData')
    .resolves(toFailure(402, 'Some Error'));

  const response = await sendAuthenticatedRequestWithSportId(SPORT_ID);
  t.is(response.status, 402);
  t.is(response.body.message, ERROR_MESSAGES.CACHED_DATA_NOT_AVAILABLE);
  t.is(getVictorBetResultStub.called, true);
});

test('When `GET /v1/events` is hit, Then it responds with a correct data', async (t) => {
  const getVictorBetResultStub = sinon
    .stub(victorBetFunctions, 'getVictorBetResult')
    .resolves(
      toSuccess(200, {
        ...VICTOR_BET_BIG_RESULT,
      })
    );

  const response = await sendAuthenticatedRequestWithoutSportId();
  t.is(response.status, 200);
  t.deepEqual(response.body.allEvents, [VICTOR_BET_EVENT_EXAMPLE]);
  t.is(getVictorBetResultStub.called, true);
});

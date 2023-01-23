import { VictorBetResult, VictorBetStatus } from '../../types/victor-bet-types';

const VICTOR_BET_SUCCESS_STATUS: VictorBetStatus = {
  success: true,
  errorCode: 0,
  extraInfo: {},
};

const VICTOR_BET_ERROR_STATUS: VictorBetStatus = {
  success: false,
  errorCode: 0,
  extraInfo: {},
};

export const VICTOR_BET_RESULT: VictorBetResult = {
  transitions_pgate_path: '',
  total_number_of_events: 0,
  sports: [],
};

export const VICTOR_BET_DEFAULT_RESPONSE = {
  status: VICTOR_BET_SUCCESS_STATUS,
  result: VICTOR_BET_RESULT,
};

export const VICTOR_BET_ERROR_RESPONSE = {
  status: VICTOR_BET_ERROR_STATUS,
  result: VICTOR_BET_RESULT,
};

export const DEFAULT_VICTOR_BET_URL =
  'https://partners.betvictor.mobi/en-gb/in-play/1/events';
export const GERMAN_VICTOR_BET_URL =
  'https://partners.betvictor.mobi/de/in-play/1/events';
export const CHINESE_VICTOR_BET_URL =
  'https://partners.betvictor.mobi/zh/in-play/1/events';

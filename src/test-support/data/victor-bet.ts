import { VictorBetResult, VictorBetStatus } from '../../types/victor-bet-types';

export const VICTOR_BET_EVENT_EXAMPLE = {
  id: 1865213200,
  event_type: 'GAME_EVENT',
  event_path_id: 618008510,
  sport_id: 1041100,
  desc: 'MAD Lions v Team Vitality',
  oppADesc: 'MAD Lions',
  oppAId: 302303400,
  oppBDesc: 'Team Vitality',
  oppBId: 303885600,
  american: null,
  inPlay: true,
  time: 1674510000000,
  pos: 9999,
  markets: [],
  eventPathTree: {
    table: {},
  },
  metadata: {
    badges: [],
  },
  has_stream: false,
  scoreboard: {},
};

export const EVENT_ID = '1865213200';

export const SPORT_ID = '1041100';

export const VICTOR_BET_SPORT_EXAMPLE = {
  id: 1041100,
  epId: 431839010,
  desc: 'Esports League of Legends',
  pos: 33,
  ne: 10,
  eic: 10,
  v: false,
  mc: false,
  ncmc: 2,
  nemc: 2,
  hasInplayEvents: true,
  hasUpcomingEvents: false,
  marketTypes: [
    {
      mtId: 10411001,
      pos: 3,
      desc: 'Match Betting',
      mtDesc: 'Match Betting',
      coupon_name: 'template_b',
      headers: ['1', '2'],
      periods: [
        {
          desc: 'Match',
          long_desc: 'Match (1041100201 - pre-event)',
          pIds: [1041100201],
          config: {
            filter: '',
          },
        },
      ],
      pId: 1041100201,
      pDesc: 'Match (1041100201 - pre-event)',
      sport_id: 1041100,
    },
  ],
  comp: [
    {
      id: 436965910,
      desc: 'EU LEC',
      pos: 9,
      events: [{ ...VICTOR_BET_EVENT_EXAMPLE }],
    },
  ],
};

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

export const VICTOR_BET_BIG_RESULT: VictorBetResult = {
  transitions_pgate_path: '',
  total_number_of_events: 0,
  sports: [{ ...VICTOR_BET_SPORT_EXAMPLE }],
};

export const VICTOR_BET_DEFAULT_RESPONSE = {
  status: VICTOR_BET_SUCCESS_STATUS,
  result: VICTOR_BET_RESULT,
};

export const VICTOR_BET_BIG_RESPONSE = {
  status: VICTOR_BET_SUCCESS_STATUS,
  result: VICTOR_BET_BIG_RESULT,
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

import NodeCache from 'node-cache';
import { EnvConfig } from './generic-types';

export const ENV_CONFIG: EnvConfig = {
  cacheInstance: new NodeCache(),
  victorBetBaseURL: process.env.VICTOR_BET_BASE_URL || '',
  victorBetSuffixURL: process.env.VICTOR_BET_URL_SUFFIX || '',
  port: Number(process.env.PORT) || 3000,
};

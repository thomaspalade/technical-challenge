import axios, { AxiosResponse, AxiosError } from 'axios';
import { ERROR_MESSAGES } from '../enums';
import { toFailure, toSuccess } from '../helpers';
import { Either } from '../types/generic-types';
import { VictorBetResult, VictorBetResponse } from '../types/victor-bet-types';

export const getVictorBetResult = async (
  eventsSourceUrl: string
): Promise<Either<Error, VictorBetResult>> =>
  axios
    .get(eventsSourceUrl)
    .then((res: AxiosResponse<VictorBetResponse>) => {
      if (!res.data.status.success) {
        const { errorCode, extraInfo } = res.data.status;
        console.log(
          `[getVictorBetResult]: Error while retrieving data from ${eventsSourceUrl}, errorCode: ${errorCode}, extraInfo: ${extraInfo}`
        );
        return toFailure(
          500,
          `[getVictorBetResult]: ${ERROR_MESSAGES.DATA_NOT_AVAILABLE}`
        );
      }

      return toSuccess(200, res.data.result);
    })
    .catch((error: AxiosError) => {
      const [status, message] = error.response
        ? [
            error.response.status,
            `[getVictorBetResult]: Failed ${JSON.stringify(
              error.response.data
            )}.`,
          ]
        : error.request
        ? [
            1, // no response
            `[getVictorBetResult]: No response: ${JSON.stringify(
              error.request._currentUrl
            )}.`,
          ]
        : [
            0, // failed to send
            `[getVictorBetResult]: Unknown error: ${JSON.stringify(
              error.message
            )}.`,
          ];

      return toFailure(status, message);
    });

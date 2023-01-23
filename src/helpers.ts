import { SUPPORTED_LANGUAGES } from './enums';
import { Failure, Success } from './types/generic-types';

export const toFailure = (status: number, message: string): Failure<Error> => ({
  ok: false,
  status,
  error: new Error(message),
});

export const toSuccess = <T>(status: number, value: T): Success<T> => ({
  ok: true,
  status,
  value,
});

export const isSupportedLanguage = (language: SUPPORTED_LANGUAGES): boolean =>
  [
    SUPPORTED_LANGUAGES.CHINESE,
    SUPPORTED_LANGUAGES.ENGLISH,
    SUPPORTED_LANGUAGES.GERMAN,
  ].includes(language);

import test from 'ava';
import { isSupportedLanguage, toFailure, toSuccess } from './helpers';
import { SUPPORTED_LANGUAGES } from './enums';

test('When `toFailure` is called with an object T, Then it returns an object of type Failure<T>', (t) => {
  const res = toFailure(400, 'error message');
  t.deepEqual(res, {
    ok: false,
    status: 400,
    error: new Error('error message'),
  });
});

test('When `toSuccess` is called with an object T, Then it returns an object of type Success<T>', (t) => {
  const res = toSuccess(200, { message: 'expected data' });
  t.deepEqual(res, {
    ok: true,
    status: 200,
    value: { message: 'expected data' },
  });
});

test('When isSupportedLanguage is called with english language as parameter, Then it returns true', async (t) => {
  t.true(isSupportedLanguage(SUPPORTED_LANGUAGES.ENGLISH));
});

test('When isSupportedLanguage is called  with german language as parameter, Then it returns true', async (t) => {
  t.true(isSupportedLanguage(SUPPORTED_LANGUAGES.GERMAN));
});

test('When isSupportedLanguage is called with chinese language as parameter, Then it returns true', async (t) => {
  t.true(isSupportedLanguage(SUPPORTED_LANGUAGES.CHINESE));
});

test('When isSupportedLanguage is called with an unsupported language, Then it returns false', async (t) => {
  t.false(isSupportedLanguage('fr' as SUPPORTED_LANGUAGES));
});

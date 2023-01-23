import NodeCache from 'node-cache';

export type Failure<T = Error> = {
  readonly ok: false;
  readonly status: number;
  readonly error: T;
};

export type Success<T> = {
  readonly ok: true;
  readonly status: number;
  readonly value: T;
};

export type Either<E, A> = Failure<E> | Success<A>;

export type EnvConfig = {
  cacheInstance: NodeCache;
  victorBetBaseURL: string;
  victorBetSuffixURL: string;
  port: number;
};

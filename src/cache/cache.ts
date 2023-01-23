import NodeCache from "node-cache";

export const cleanUpCache = (cache: NodeCache): void => {
  cache.flushAll();
  cache.close();
};
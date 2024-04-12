import type { Context, MiddlewareHandler, Next } from "hono";
import Pino, { type Logger } from "pino";

// Note: this logger is based off Hono's official logger, but uses Pino instead of console.log.
// https://github.com/honojs/hono/blob/main/src/middleware/logger/index.ts

export const getPath = (request: Request): string => {
  // Optimized: indexOf() + slice() is faster than RegExp
  const url = request.url;
  const queryIndex = url.indexOf("?", 8);
  return url.slice(
    url.indexOf("/", 8),
    queryIndex === -1 ? undefined : queryIndex,
  );
};

function logRequest(logger: Logger, request: Request) {
  const { method } = request;
  const url = getPath(request);

  logger.info({
    type: "webserver-request",
    // id: 1,
    method,
    url,
    headers: Bun.env.NODE_ENV === "production" ? request.headers : undefined,
  });
}

function logResponse(
  logger: Logger,
  request: Request,
  response: Response,
  start: number,
) {
  const { method } = request;
  const url = getPath(request);
  const status = response.status;

  logger.info({
    type: "webserver-response",
    // id: 1,
    method,
    url,
    status,
    headers: Bun.env.NODE_ENV === "production" ? response.headers : undefined,
    elapsed: Date.now() - start,
  });
}

export const loggerInstance = Pino({
  name: "hono",
  level: Bun.env.NODE_ENV === "production" ? "info" : "debug",
});

export const logger = (): MiddlewareHandler => {
  return async function logger(c: Context, next: Next) {
    logRequest(loggerInstance, c.req.raw);
    const start = Date.now();

    await next();

    logResponse(loggerInstance, c.req.raw, c.res, start);
  };
};

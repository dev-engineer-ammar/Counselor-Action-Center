import { ErrorRequestHandler } from 'express';
import { HttpError } from '../errors/httpError';
import { RequestWithMetadata } from '../types/requestMetadata';

export const errorHandler: ErrorRequestHandler = (error, req, res, _next): void => {
  const requestWithMetadata = req as RequestWithMetadata;
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = error instanceof HttpError ? error.message : 'Internal Server Error';

  if (statusCode >= 500) {
    console.error(JSON.stringify({
      level: 'error',
      message: 'request_failed',
      requestId: requestWithMetadata.requestId,
      method: req.method,
      path: req.originalUrl,
      error: error instanceof Error ? error.message : 'Unknown error'
    }));
  }

  res.status(statusCode).json({
    error: message,
    requestId: requestWithMetadata.requestId
  });
};

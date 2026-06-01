import { NextFunction, Request, Response } from 'express';
import { RequestWithMetadata } from '../types/requestMetadata';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const requestWithMetadata = req as RequestWithMetadata;

  res.on('finish', () => {
    const durationMs = Date.now() - requestWithMetadata.startedAt;

    console.info(JSON.stringify({
      level: 'info',
      message: 'http_request',
      requestId: requestWithMetadata.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      contentLength: res.getHeader('content-length') || null
    }));
  });

  next();
};

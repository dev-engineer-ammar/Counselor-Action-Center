import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { RequestWithMetadata } from '../types/requestMetadata';

export const requestContext = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = req.header('x-request-id') || randomUUID();
  const requestWithMetadata = req as RequestWithMetadata;

  requestWithMetadata.requestId = requestId;
  requestWithMetadata.startedAt = Date.now();
  res.setHeader('x-request-id', requestId);

  next();
};

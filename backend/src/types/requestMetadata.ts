import { Request } from 'express';

export type RequestWithMetadata = Request & {
  requestId: string;
  startedAt: number;
};

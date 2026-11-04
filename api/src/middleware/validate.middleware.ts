import type { Request, Response, NextFunction } from 'express';
import type { ZodTypeAny } from 'zod';
import { MESSAGES } from '../constants/messages.js';
import { StatusCodes } from 'http-status-codes';

export const validate = (schema: ZodTypeAny, mode: 'body' | 'request' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {

    const input = mode === 'request'
      ? { params: req.params, body: req.body }
      : req.body;

    const result = schema.safeParse(input);

    if (!result.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.VALIDATION_FAILED,
        errors: result.error.issues.map((issue) => ({
          field  : issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    if (mode === 'request') {
      req.params = result.data.params as Record<string, string>;
      req.body   = result.data.body;
    } else {
      req.body = result.data;
    }

    next();
  };
};

import { MESSAGES } from '../constants/messages.js';
import { StatusCodes } from 'http-status-codes';

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.VALIDATION_FAILED,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    req.body = result.data;

    next();
  };
};

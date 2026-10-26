
import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '../../../generated/prisma/client.js';
import { createUserService } from './users.service.js';
import type { CreateUserInput } from './users.validation.js';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // The validation middleware has already validated the request.
    const input = req.body as CreateUserInput;

    const createdRecord = await createUserService(input);

    const isBuyer = input.entityType === 'Buyer';

    return res.status(201).json({
      success: true,
      message: isBuyer
        ? 'Buyer created successfully'
        : 'User created successfully',
      data: createdRecord,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        success: false,
        message: 'A record with this email already exists.',
      });
    }

    next(error);
  }
};


import { type Request, type Response, type NextFunction, response } from 'express';
import { Prisma } from '../../../generated/prisma/client.js';
import { createUserService, getAllUsersService } from './users.service.js';
import type { CreateUserInput } from './users.validation.js';

import { MESSAGES } from '../../constants/messages.js';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction,) => {
  try {
    const users = await getAllUsersService();

    return res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.USERS_RETRIEVED,
      data: users
    })
  } catch (error) {
    next(error)
  }
}

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = req.body as CreateUserInput;

    const createdRecord = await createUserService(input);

    const isBuyer = input.entityType === 'Buyer';

    return res.status(201).json({
      success: true,
      message: isBuyer
        ? MESSAGES.SUCCESS.BUYER_CREATED
        : MESSAGES.SUCCESS.USER_CREATED,
      data: createdRecord,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        success: false,
        message: MESSAGES.ERROR.EMAIL_ALREADY_EXISTS,
      });
    }

    next(error);
  }
};

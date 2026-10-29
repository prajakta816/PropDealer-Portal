
import { type Request, type Response, type NextFunction} from 'express';
import { Prisma } from '../../../generated/prisma/client.js';
import { createUserService, getAllUsersService } from './users.service.js';
import type { CreateUserInput } from './users.validation.js';

import { MESSAGES } from '../../constants/messages.js';
import { StatusCodes } from 'http-status-codes';
import { ROLES } from '../../constants/roles.js';
import { ENTITY_TYPES } from '../../constants/entityTypes.js';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction,) => {
  try {
    const users = await getAllUsersService();

    return res.status(StatusCodes.OK).json({
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

    if (
      input.entityType === ENTITY_TYPES.USER &&
      req.user?.role !== ROLES.ADMIN
    ) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: MESSAGES.ERROR.UNAUTHORIZED,
      });
    }

    const createdRecord = await createUserService(input);

    const isBuyer = input.entityType === ENTITY_TYPES.BUYER;

    return res.status(StatusCodes.CREATED).json({
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
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: MESSAGES.ERROR.EMAIL_ALREADY_EXISTS,
      });
    }

    next(error);
  }
};

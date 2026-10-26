
import { prisma } from '../../../prisma/prisma.js';

export const createUser = (userData) => {
  return prisma.user.create({
    data: userData,
  });
};

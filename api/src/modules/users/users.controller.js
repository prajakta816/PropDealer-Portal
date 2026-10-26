
import { createUserService } from './users.service.js';

export const createUser = async (req, res, next) => {
  try {
    const user = await createUserService(req.body);

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
        createdById: user.createdById,
        updatedAt: user.updatedAt,
        updatedById: user.updatedById,
       },
    });
  } catch (error) {
    next(error);
  }
};

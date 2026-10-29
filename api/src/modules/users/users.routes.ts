
import { Router } from 'express';

import { createUserSchema } from './users.validation.js';
import { createUser , getAllUsers} from './users.controller.js';


import { validate } from '../../middleware/validate.middleware.js';
import { authenticateToken , autherizeRole } from '../../middleware/auth.middleware.js';

import { ROLES } from '../../constant/constant.js';

const router = Router();

router.get(
  '/',
  authenticateToken,
  autherizeRole(ROLES.ADMIN),
  getAllUsers
);

router.post(
  '/',
  authenticateToken,
  autherizeRole(ROLES.ADMIN),
  validate(createUserSchema),
  createUser,
);

export default router;

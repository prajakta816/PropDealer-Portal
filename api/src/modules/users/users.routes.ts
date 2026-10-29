
import { Router } from 'express';

import { createUserSchema } from './users.validation.js';
import { createUser , getAllUsers} from './users.controller.js';


import { validate } from '../../middleware/validate.middleware.js';
import { authenticateToken , authorizeRole } from '../../middleware/auth.middleware.js';

import { ROLES } from '../../constants/roles.js';

const router = Router();

router.get(
  '/',
  authenticateToken,
  authorizeRole(ROLES.ADMIN),
  getAllUsers
);

router.post(
  '/',
  authenticateToken,
  authorizeRole(ROLES.ADMIN , ROLES.AGENT),
  validate(createUserSchema),
  createUser,
);

export default router;

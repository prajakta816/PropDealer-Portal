
import { Router } from 'express';

import { createUserSchema } from './users.validation.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createUser , getAllUsers} from './users.controller.js';

const router = Router();

router.get(
  '/',
  getAllUsers
);

router.post(
  '/',
  validate(createUserSchema),
  createUser,
);

export default router;

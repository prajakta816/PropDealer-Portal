import { Router } from 'express';
import {
  authenticateToken,
  authorizeRole,
} from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { ROLES } from '../../constants/roles.js';
import {
  createBuyerSchema,
  updateBuyerRequestSchema,
  buyerIdParamSchema,
} from './validation.js';
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from './controller.js';

const router = Router();

router.use(authenticateToken);

router.get(
  '/',
  authorizeRole(ROLES.AGENT, ROLES.ADMIN),
  getAll,
);

router.get(
  '/:id',
  authorizeRole(ROLES.AGENT, ROLES.ADMIN),
  validate(buyerIdParamSchema, 'request'),
  getById,
);

router.post(
  '/',
  authorizeRole(ROLES.AGENT),
  validate(createBuyerSchema),
  create,
);

router.patch(
  '/:id',
  authorizeRole(ROLES.AGENT),
  validate(updateBuyerRequestSchema, 'request'),
  update,
);

router.delete(
  '/:id',
  authorizeRole(ROLES.AGENT),
  validate(buyerIdParamSchema, 'request'),
  remove,
);

export default router;
import { Router } from 'express';
import {
  authenticateToken,
  authorizeRole,
} from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { ROLES } from '../../constants/roles.js';
import {
  createDealRequestSchema,
  updateDealRequestSchema,
  dealIdParamSchema,
  propertyIdParamSchema,
} from './validation.js';
import {
  getByProperty,
  getById,
  create,
  update,
} from './controller.js';

const router = Router();

router.use(authenticateToken);

router.get(
  '/property/:id',
  authorizeRole(ROLES.ADMIN, ROLES.AGENT, ROLES.COMMISSION_MANAGER),
  validate(propertyIdParamSchema, 'request'),
  getByProperty,
);

router.post(
  '/property/:id',
  authorizeRole(ROLES.AGENT),
  validate(createDealRequestSchema, 'request'),
  create,
);

router.get(
  '/:id',
  authorizeRole(ROLES.ADMIN, ROLES.AGENT, ROLES.COMMISSION_MANAGER),
  validate(dealIdParamSchema, 'request'),
  getById,
);

router.patch(
  '/:id',
  authorizeRole(ROLES.AGENT),
  validate(updateDealRequestSchema, 'request'),
  update,
);

export default router;
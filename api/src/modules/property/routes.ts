import { Router } from 'express';
import {
  authenticateToken,
  authorizeRole,
} from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { ROLES } from '../../constants/roles.js';
import {
  createPropertySchema,
  updatePropertyRequestSchema,
  propertyIdParamSchema,
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
  authorizeRole(ROLES.ADMIN, ROLES.AGENT, ROLES.COMMISSION_MANAGER),
  getAll,
);

router.get(
  '/:id',
  authorizeRole(ROLES.ADMIN, ROLES.AGENT, ROLES.COMMISSION_MANAGER),
  validate(propertyIdParamSchema, 'request'),
  getById,
);

router.post(
  '/',
  authorizeRole(ROLES.ADMIN),
  validate(createPropertySchema),
  create,
);

router.patch(
  '/:id',
  authorizeRole(ROLES.ADMIN),
  validate(updatePropertyRequestSchema, 'request'),
  update,
);

router.delete(
  '/:id',
  authorizeRole(ROLES.ADMIN),
  validate(propertyIdParamSchema, 'request'),
  remove,
);

export default router;
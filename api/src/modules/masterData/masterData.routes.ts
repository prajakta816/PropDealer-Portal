import { Router } from 'express';

import {
  authenticateToken,
  authorizeRole,
} from '../../middleware/auth.middleware.js';

import { validate } from '../../middleware/validate.middleware.js';

import { ROLES } from '../../constants/roles.js';

import {
  createMasterDataSchema,
  updateMasterDataSchema,
} from './masterData.validation.js';

import {
  getAllMasterData,
  createMasterData,
  updateMasterData,
} from './masterData.controller.js';

const router = Router();

router.use(authenticateToken, authorizeRole(ROLES.ADMIN));

router.get('/', getAllMasterData);
router.post('/', validate(createMasterDataSchema), createMasterData);
router.put('/:id', validate(updateMasterDataSchema), updateMasterData);

export default router;
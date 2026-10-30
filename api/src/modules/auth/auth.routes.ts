import { Router } from "express";

import { validate } from "../../middleware/validate.middleware.js";
import { loginSchema } from "./auth.validation.js";
import { login , getCurrentUser } from "./auth.controller.js";

import { authenticateToken, authorizeRole } from "../../middleware/auth.middleware.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

router.post(
    '/login',
    validate(loginSchema),
    login
)

router.get(
    '/me',
    authenticateToken,
    authorizeRole(ROLES.ADMIN,ROLES.AGENT,ROLES.COMMISSION_MANAGER),
    getCurrentUser
)

export default router;
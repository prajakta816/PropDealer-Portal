import { Router } from "express";

import { validate } from "../../middleware/validate.middleware.js";
import { loginSchema } from "./auth.validation.js";
import { login , getCurrentUser } from "./auth.controller.js";

import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
    '/login',
    validate(loginSchema),
    login
)

router.get(
    '/me',
    authenticateToken,
    getCurrentUser
)

export default router;
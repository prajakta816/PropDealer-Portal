import { Router } from "express";

import { validate } from "../../middleware/validate.middleware.js";
import { loginSchema } from "./auth.validation.js";
import { login , getCurrentUser } from "./auth.controller.js";

const router = Router();

router.post(
    '/login',
    validate(loginSchema),
    login
)

router.get(
    '/me',
    getCurrentUser
)

export default router;
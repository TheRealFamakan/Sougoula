import { Router } from "express";
import { register, login, currentUser } from "../controllers/authController";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/me", authenticate, asyncHandler(currentUser));

export default router;


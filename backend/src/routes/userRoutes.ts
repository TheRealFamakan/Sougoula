import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getSellerProfile, getMe, updateMe } from "../controllers/userController";

const router = Router();

router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateMe);
router.get("/:id", getSellerProfile);

export default router;


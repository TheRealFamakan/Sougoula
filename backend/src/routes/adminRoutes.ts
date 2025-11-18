import { Router } from "express";
import {
  deleteListingAsAdmin,
  deleteUser,
  listAllListings,
  listUsers,
} from "../controllers/adminController";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/users", listUsers);
router.delete("/users/:id", deleteUser);
router.get("/listings", listAllListings);
router.delete("/listings/:id", deleteListingAsAdmin);

export default router;


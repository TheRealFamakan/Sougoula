import { Router } from "express";
import {
  listListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  myListings,
} from "../controllers/listingController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", listListings);
router.get("/mine", authenticate, myListings);
router.get("/:id", getListing);
router.post("/", authenticate, createListing);
router.put("/:id", authenticate, updateListing);
router.delete("/:id", authenticate, deleteListing);

export default router;
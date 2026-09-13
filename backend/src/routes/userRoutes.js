import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  login,
  register,
  addToActivity,
  getAllActivity,
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Credential endpoints are the ones worth guessing at, so they get a tighter
// budget than the authenticated history endpoints.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

router.route("/login").post(authLimiter, login);
router.route("/register").post(authLimiter, register);
router.route("/add_to_activity").post(requireAuth, addToActivity);
router.route("/get_all_activity").get(requireAuth, getAllActivity);

export default router;

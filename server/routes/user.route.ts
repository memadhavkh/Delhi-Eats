import express from "express";
import { checkAuth, forgotPassword, login, logout, resetPassword, register, updateProfile, verifyEmail } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/register").post(register)
router.route("/reset-password/:token").post(resetPassword);
router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/profile/update").put(isAuthenticated,updateProfile);

export default router;
import { Router } from "express";
import { authController } from "../container/index";
import { validateBody, protect } from "../middleware";
import {
  adminLoginSchema,
  studentAuthSchema,
  verifyOtpSchema,
  inviteAdminSchema,
  acceptInviteSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from "../features/auth/auth.schema";

const router = Router();

router.post("/admin/login", validateBody(adminLoginSchema), (req, res, next) => {
  authController.adminLogin(req, res).catch(next);
});

router.post("/student", validateBody(studentAuthSchema), (req, res, next) => {
  authController.studentAuth(req, res).catch(next);
});

router.post("/verify-otp", validateBody(verifyOtpSchema), (req, res, next) => {
  authController.verifyOtp(req, res).catch(next);
});

router.post("/refresh", (req, res, next) => {
  authController.refreshToken(req, res).catch(next);
});

router.post("/logout", (req, res, next) => {
  authController.logout(req, res).catch(next);
});

router.post("/invite", protect, validateBody(inviteAdminSchema), (req, res, next) => {
  authController.inviteAdmin(req, res).catch(next);
});

router.post("/accept-invite", validateBody(acceptInviteSchema), (req, res, next) => {
  authController.acceptInvite(req, res).catch(next);
});

router.post(
  "/password-reset-request",
  validateBody(resetPasswordRequestSchema),
  (req, res, next) => {
    authController.requestPasswordReset(req, res).catch(next);
  }
);

router.post("/reset-password", validateBody(resetPasswordSchema), (req, res, next) => {
  authController.resetPassword(req, res).catch(next);
});

export const authRoutes = router;

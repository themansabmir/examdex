import { Router } from "express";
import { authController } from "../container/index";
import { validateBody, protect } from "../middleware";
import {
  adminLoginSchema,
  studentAuthSchema,
  verifyOtpSchema,
  refreshTokenSchema,
  inviteAdminSchema,
  acceptInviteSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from "../features/auth/auth.schema";

const router = Router();

router.post("/admin/login", validateBody(adminLoginSchema), authController.adminLogin);

router.post("/student", validateBody(studentAuthSchema), authController.studentAuth);

router.post("/verify-otp", validateBody(verifyOtpSchema), authController.verifyOtp);

router.post(
  "/refresh",
  (req, _res, next) => {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    req.body = {
      ...body,
      refreshToken: body.refreshToken ?? req.cookies?.refreshToken,
    };
    next();
  },
  validateBody(refreshTokenSchema),
  authController.refreshToken
);

router.post("/logout", authController.logout);

router.post("/invite", protect, validateBody(inviteAdminSchema), authController.inviteAdmin);

router.post("/accept-invite", validateBody(acceptInviteSchema), authController.acceptInvite);

router.post(
  "/password-reset-request",
  validateBody(resetPasswordRequestSchema),
  authController.requestPasswordReset
);

router.post("/reset-password", validateBody(resetPasswordSchema), authController.resetPassword);

export const authRoutes = router;

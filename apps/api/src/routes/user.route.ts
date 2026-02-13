import { Router } from "express";
import { userController } from "../container/index";
import { validateBody, validateParams, protect } from "../middleware";
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  updateProfileSchema,
} from "../features/user/user.schema";

const router = Router();

router.post("/", validateBody(createUserSchema), (req, res, next) => {
  userController.createUser(req, res).catch(next);
});

router.get("/", (req, res, next) => {
  userController.getAllUsers(req, res).catch(next);
});

router.get("/:id", validateParams(userIdParamSchema), (req, res, next) => {
  userController.getUserById(req, res).catch(next);
});

router.get("/me", protect, (req, res, next) => {
  userController.getMe(req, res).catch(next);
});

router.patch("/me", protect, validateBody(updateProfileSchema), (req, res, next) => {
  userController.updateMe(req, res).catch(next);
});

router.patch(
  "/:id",
  validateParams(userIdParamSchema),
  validateBody(updateUserSchema),
  (req, res, next) => {
    userController.updateUser(req, res).catch(next);
  }
);

export const userRoutes = router;

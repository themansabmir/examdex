import { Router } from "express";
import { userController } from "../container/index";
import { validateBody, validateParams, validateQuery, protect } from "../middleware";
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  updateProfileSchema,
  userListQuerySchema,
} from "../features/user/user.schema";

const router = Router();

router.post("/", validateBody(createUserSchema), userController.createUser);

router.get("/", validateQuery(userListQuerySchema), userController.getAllUsers);

router.get("/me", protect, userController.getMe);

router.patch("/me", protect, validateBody(updateProfileSchema), userController.updateMe);

router.get("/:id", validateParams(userIdParamSchema), userController.getUserById);

router.patch(
  "/:id",
  validateParams(userIdParamSchema),
  validateBody(updateUserSchema),
  userController.updateUser
);

export const userRoutes = router;

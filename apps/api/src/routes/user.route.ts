import { Router } from "express";
import { userController } from "../container/index";
import { validateBody, validateParams } from "../middleware";
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
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

router.patch(
  "/:id",
  validateParams(userIdParamSchema),
  validateBody(updateUserSchema),
  (req, res, next) => {
    userController.updateUser(req, res).catch(next);
  }
);

export const userRoutes = router;

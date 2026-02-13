import { Router } from "express";
import { devController } from "../container/index";

const router = Router();

router.post("/seed-admin", (req, res, next) => {
  devController.seedAdmin(req, res).catch(next);
});

export const devRoutes = router;

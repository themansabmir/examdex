import { Router } from "express";
import { creditMasterController } from "../container/index";
import { validateBody, validateParams } from "../middleware";
import {
  createCreditMasterSchema,
  updateCreditMasterSchema,
  creditMasterIdParamSchema,
} from "../features/creditMaster/credit-master.schema";

const router = Router();

router.post("/", validateBody(createCreditMasterSchema), (req, res, next) => {
  creditMasterController.create(req, res).catch(next);
});

router.get("/", (req, res, next) => {
  creditMasterController.getAll(req, res).catch(next);
});

router.get("/active", (req, res, next) => {
  creditMasterController.getActive(req, res).catch(next);
});

router.get("/:id", validateParams(creditMasterIdParamSchema), (req, res, next) => {
  creditMasterController.getById(req, res).catch(next);
});

router.patch(
  "/:id",
  validateParams(creditMasterIdParamSchema),
  validateBody(updateCreditMasterSchema),
  (req, res, next) => {
    creditMasterController.update(req, res).catch(next);
  }
);

router.delete("/:id", validateParams(creditMasterIdParamSchema), (req, res, next) => {
  creditMasterController.delete(req, res).catch(next);
});

export const creditMasterRoutes = router;

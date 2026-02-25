import { prisma } from "../lib";
import {
  CreditMasterService,
  CreditMasterController,
  PrismaCreditMasterRepository,
} from "../features/creditMaster";

export const creditMasterRepository = new PrismaCreditMasterRepository(prisma);
export const creditMasterService = new CreditMasterService(creditMasterRepository);
export const creditMasterController = new CreditMasterController(creditMasterService);

import { prisma } from "../lib";
import { CreditService, CreditController, PrismaCreditRepository } from "../features";

export const creditRepository = new PrismaCreditRepository(prisma);
export const creditService = new CreditService(creditRepository);
export const creditController = new CreditController(creditService);

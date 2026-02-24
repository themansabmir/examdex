import { CreditTransaction } from "./credit.entity";
import type { CreditTransactionProps, CreditBalanceInfo } from "./credit.entity";

import type {
  GetBalanceOutputDTO,
  DeductCreditInputDTO,
  DeductCreditOutputDTO,
  AddCreditsInputDTO,
  AddCreditsOutputDTO,
  CreditTransactionOutputDTO,
  GetTransactionsInputDTO,
  GetTransactionsOutputDTO,
  VerifyLedgerIntegrityOutputDTO,
} from "./credit.dto";

import type { ICreditRepository } from "./credit.repository";
import { PrismaCreditRepository } from "./credit.repository";

import type { ICreditService } from "./credit.service";
import { CreditService } from "./credit.service";

import { CreditController } from "./credit.controller";

export * from "./credit.schema";

export { CreditTransaction };
export type { CreditTransactionProps, CreditBalanceInfo };
export type {
  GetBalanceOutputDTO,
  DeductCreditInputDTO,
  DeductCreditOutputDTO,
  AddCreditsInputDTO,
  AddCreditsOutputDTO,
  CreditTransactionOutputDTO,
  GetTransactionsInputDTO,
  GetTransactionsOutputDTO,
  VerifyLedgerIntegrityOutputDTO,
};
export type { ICreditRepository };
export { PrismaCreditRepository };
export type { ICreditService };
export { CreditService };
export { CreditController };

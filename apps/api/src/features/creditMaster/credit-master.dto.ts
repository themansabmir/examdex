export interface CreateCreditMasterInputDTO {
  creditsPerNewStudent: number;
  description?: string;
  isActive?: boolean;
  updatedById?: string;
}

export interface UpdateCreditMasterInputDTO {
  creditsPerNewStudent?: number;
  description?: string;
  isActive?: boolean;
  updatedById?: string;
}

export interface CreditMasterOutputDTO {
  id: string;
  creditsPerNewStudent: number;
  description: string | null;
  isActive: boolean;
  updatedById: string | null;
  updatedAt: Date;
  createdAt: Date;
}

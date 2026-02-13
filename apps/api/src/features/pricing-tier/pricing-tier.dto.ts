export interface CreatePricingTierInputDTO {
  tierCode: string;
  tierName: string;
  description?: string;
  priceINR: number;
  credits: number;
  bonusCredits: number;
  displayOrder?: number;
}

export interface UpdatePricingTierInputDTO {
  tierName?: string;
  description?: string;
  priceINR?: number;
  credits?: number;
  bonusCredits?: number;
  displayOrder?: number;
  isActive?: boolean;
}

export interface PricingTierOutputDTO {
  id: string;
  tierCode: string;
  tierName: string;
  description: string | null;
  priceINR: number;
  credits: number;
  bonusCredits: number;
  totalCredits: number;
  costPerCredit: number;
  displayOrder: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

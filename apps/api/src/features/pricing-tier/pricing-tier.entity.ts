export interface PricingTierProps {
  id: string;
  tierCode: string;
  tierName: string;
  description?: string | null;
  priceINR: number;
  credits: number;
  bonusCredits: number;
  displayOrder: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PricingTier {
  readonly id: string;
  readonly tierCode: string;
  readonly tierName: string;
  readonly description: string | null;
  readonly priceINR: number;
  readonly credits: number;
  readonly bonusCredits: number;
  readonly displayOrder: number | null;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: PricingTierProps) {
    this.id = props.id;
    this.tierCode = props.tierCode;
    this.tierName = props.tierName;
    this.description = props.description ?? null;
    this.priceINR = props.priceINR;
    this.credits = props.credits;
    this.bonusCredits = props.bonusCredits;
    this.displayOrder = props.displayOrder ?? null;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  getTotalCredits(): number {
    return this.credits + this.bonusCredits;
  }

  getCostPerCredit(): number {
    return this.priceINR / this.getTotalCredits();
  }
}

import { httpClient } from "../../../infrastructure/http/client";
import type { PricingTier, CreatePricingTierInput, UpdatePricingTierInput } from "../domain/PricingTier";

export const pricingTierApi = {
  getAll: async (params?: { active?: boolean }): Promise<PricingTier[]> => {
    const response = await httpClient.get<{ success: boolean; data: PricingTier[] }>("/pricing-tiers", { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<PricingTier> => {
    const response = await httpClient.get<{ success: boolean; data: PricingTier }>(`/pricing-tiers/${id}`);
    return response.data.data;
  },

  getByCode: async (code: string): Promise<PricingTier> => {
    const response = await httpClient.get<{ success: boolean; data: PricingTier }>(`/pricing-tiers/code/${code}`);
    return response.data.data;
  },

  create: async (data: CreatePricingTierInput): Promise<PricingTier> => {
    const response = await httpClient.post<{ success: boolean; data: PricingTier }>("/pricing-tiers", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdatePricingTierInput): Promise<PricingTier> => {
    const response = await httpClient.patch<{ success: boolean; data: PricingTier }>(`/pricing-tiers/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/pricing-tiers/${id}`);
  },
};

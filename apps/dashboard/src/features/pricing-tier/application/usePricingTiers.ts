import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pricingTierApi } from "../infrastructure/pricing-tier.api";
import type { CreatePricingTierInput, UpdatePricingTierInput } from "../domain/PricingTier";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const pricingTierKeys = {
  all: ["pricing-tiers"] as const,
  lists: () => [...pricingTierKeys.all, "list"] as const,
  list: (filters: { active?: boolean }) => [...pricingTierKeys.lists(), { filters }] as const,
  details: () => [...pricingTierKeys.all, "detail"] as const,
  detail: (id: string) => [...pricingTierKeys.details(), id] as const,
};

export function usePricingTiers(params?: { active?: boolean }) {
  return useQuery({
    queryKey: pricingTierKeys.list(params || {}),
    queryFn: () => pricingTierApi.getAll(params),
  });
}

export function usePricingTier(id?: string) {
  return useQuery({
    queryKey: pricingTierKeys.detail(id!),
    queryFn: () => pricingTierApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreatePricingTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePricingTierInput) => pricingTierApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingTierKeys.all });
      toast.success("Pricing tier created successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to create pricing tier");
    },
  });
}

export function useUpdatePricingTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePricingTierInput }) =>
      pricingTierApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pricingTierKeys.all });
      queryClient.invalidateQueries({ queryKey: pricingTierKeys.detail(data.id) });
      toast.success("Pricing tier updated successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to update pricing tier");
    },
  });
}

export function useDeletePricingTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pricingTierApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingTierKeys.all });
      toast.success("Pricing tier deleted successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to delete pricing tier");
    },
  });
}

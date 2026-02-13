import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePricingTierSchema, UpdatePricingTierSchema, type PricingTierFormInput, type PricingTier } from "../domain/PricingTier";
import { useCreatePricingTier, useUpdatePricingTier } from "../application/usePricingTiers";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { Textarea } from "@/shared/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes.config";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface PricingTierFormProps {
  initialData?: PricingTier;
}

export function PricingTierForm({ initialData }: PricingTierFormProps) {
  const navigate = useNavigate();
  const { mutate: createTier, isPending: isCreating } = useCreatePricingTier();
  const { mutate: updateTier, isPending: isUpdating } = useUpdatePricingTier();

  const isEditing = !!initialData;

  const form = useForm<PricingTierFormInput>({
    resolver: zodResolver(isEditing ? UpdatePricingTierSchema : CreatePricingTierSchema),
    defaultValues: initialData
      ? {
          tierCode: initialData.tierCode,
          tierName: initialData.tierName,
          description: initialData.description || "",
          priceINR: initialData.priceINR,
          credits: initialData.credits,
          bonusCredits: initialData.bonusCredits,
          displayOrder: initialData.displayOrder || undefined,
          isActive: initialData.isActive,
        }
      : {
          tierCode: "",
          tierName: "",
          description: "",
          priceINR: 0,
          credits: 0,
          bonusCredits: 0,
          displayOrder: undefined,
          isActive: true,
        },
  });

  const onSubmit = (data: PricingTierFormInput) => {
    if (isEditing) {
      updateTier(
        { id: initialData.id, data },
        {
          onSuccess: () => navigate(ROUTES.MASTER.PRICING_TIERS.LIST),
        }
      );
    } else {
      createTier(data, {
        onSuccess: () => navigate(ROUTES.MASTER.PRICING_TIERS.LIST),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Pricing Tier" : "Create Pricing Tier"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tierCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. SILVER_PLAN" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the tier (cannot be changed later).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tierName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Silver Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe this pricing tier..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="priceINR"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (INR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 999"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 100"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bonusCredits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bonus Credits</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 10"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing && (
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Is this pricing tier currently active?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.MASTER.PRICING_TIERS.LIST)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isEditing ? "Update Tier" : "Create Tier"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

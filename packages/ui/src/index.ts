export * from "./components/ui/button";
export * from "./components/ui/card";
export * from "./components/ui/input";
export * from "./components/ui/label";
export * from "./lib/utils";

// Re-export common dependencies for centralized version management
export * from "lucide-react";
export { toast, Toaster } from "sonner";
export { z } from "zod";
export { zodResolver } from "@hookform/resolvers/zod";
export { useForm, useFieldArray, useWatch, useFormContext, FormProvider } from "react-hook-form";
export type { UseFormReturn, FieldValues, SubmitHandler } from "react-hook-form";

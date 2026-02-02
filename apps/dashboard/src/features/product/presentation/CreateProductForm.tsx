import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import type { UseCategoryList } from "../domain/contracts";

interface Props {
  // 2. Injection: We ask for the capability, not the implementation
  useCategories: UseCategoryList;
  onSubmit: (data: any) => void;
}

export function CreateProductForm({ useCategories, onSubmit }: Props) {
  // 3. Usage: We use it like any other hook, but we don't own it
  const { data: categories, isLoading } = useCategories();

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Product Name</label>
          <input className="input-base w-full px-3 rounded-md" placeholder="iPhone 15" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Category</label>
          <select className="input-base w-full px-3 rounded-md" disabled={isLoading}>
            <option value="">Select a Category...</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          {isLoading && (
            <span className="text-xs text-muted-foreground">Loading categories...</span>
          )}
        </div>

        <Button className="btn-primary w-full" onClick={() => onSubmit({})}>
          Create Product
        </Button>
      </CardContent>
    </Card>
  );
}

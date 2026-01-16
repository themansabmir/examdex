// 1. The Contract (What Product features expects)
export interface CategoryOption {
  id: string;
  label: string;
}

export type UseCategoryList = () => {
  data: CategoryOption[];
  isLoading: boolean;
};

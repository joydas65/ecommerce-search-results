import type { ProductViewMode } from "@/types/product";

export const productViewModes: ProductViewMode[] = ["grid", "list"];

export const defaultPageSizeByView: Record<ProductViewMode, number> = {
  grid: 12,
  list: 8,
};

export const pageSizeOptionsByView: Record<ProductViewMode, number[]> = {
  grid: [8, 12, 16],
  list: [4, 8, 12],
};

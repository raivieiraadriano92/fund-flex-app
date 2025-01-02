export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategoryBreakdownData {
  categoryId: string;
  categoryTitle: string;
  categoryEmoji: string;
  total: number;
  percentage: number;
}

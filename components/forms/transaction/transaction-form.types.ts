export interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  defaultValues?: TransactionFormData;
  isEditing?: boolean;
}

export interface TransactionFormData {
  type: "income" | "expense";
  amount: number;
  title: string;
  date: Date;
  goalId?: string;
  categoryId: string;
  receipt?: string;
}

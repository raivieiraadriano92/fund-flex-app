import EventEmitter from "eventemitter3";

import { TransactionFiltersFormData } from "../types/transaction";

interface Events {
  "category:selected": (categoryId: string) => void;
  "goal:selected": (goalId: string, index?: number) => void;
  "transaction:applyFilter": (filters: TransactionFiltersFormData) => void;
}

export const events = new EventEmitter<Events>();

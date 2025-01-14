import { addDays, addWeeks, addMonths, addYears, parseISO } from "date-fns";

import { TransactionFrequency } from "../types/transaction";

interface RecurringOptions {
  frequency: TransactionFrequency;
  startDate: string;
  endDate?: string;
  occurrences?: number;
}

export function generateRecurringDates(options: RecurringOptions): Date[] {
  const dates: Date[] = [];

  const startDate = parseISO(options.startDate);

  const endDate = options.endDate ? parseISO(options.endDate) : undefined;

  let currentDate = startDate;

  let count = 0;

  while (
    (endDate ? currentDate < endDate : true) &&
    (options.occurrences ? count < options.occurrences : true)
  ) {
    dates.push(currentDate);

    count++;

    // Calculate next date based on frequency
    switch (options.frequency) {
      case "daily":
        currentDate = addDays(currentDate, 1);

        break;

      case "weekly":
        currentDate = addWeeks(currentDate, 1);

        break;

      case "monthly":
        currentDate = addMonths(currentDate, 1);

        break;

      case "yearly":
        currentDate = addYears(currentDate, 1);

        break;
    }
  }

  return dates;
}

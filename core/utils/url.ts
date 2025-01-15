export function objectToQueryString(obj: Record<string, any>): string {
  return Object.entries(obj)
    .filter(([_, value]) => !!value)
    .map(([key, value]) => {
      if (value instanceof Date) {
        return `${key}=${value.toISOString()}`;
      }

      return `${key}=${value}`;
    })
    .join("&");
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  decimalPlaces: number;
  symbolPosition: "prefix" | "suffix";
  spaceAfterSymbol: boolean;
}

export const currencies: Currency[] = [
  {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    locale: "en-US",
    decimalPlaces: 2,
    symbolPosition: "prefix",
    spaceAfterSymbol: false
  },
  {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    locale: "de-DE",
    decimalPlaces: 2,
    symbolPosition: "suffix",
    spaceAfterSymbol: true
  },
  {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    locale: "en-GB",
    decimalPlaces: 2,
    symbolPosition: "prefix",
    spaceAfterSymbol: false
  },
  {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    locale: "ja-JP",
    decimalPlaces: 0,
    symbolPosition: "prefix",
    spaceAfterSymbol: false
  },
  {
    code: "CAD",
    symbol: "$",
    name: "Canadian Dollar",
    locale: "en-CA",
    decimalPlaces: 2,
    symbolPosition: "prefix",
    spaceAfterSymbol: false
  },
  {
    code: "AUD",
    symbol: "$",
    name: "Australian Dollar",
    locale: "en-AU",
    decimalPlaces: 2,
    symbolPosition: "prefix",
    spaceAfterSymbol: false
  },
  {
    code: "CNY",
    symbol: "¥",
    name: "Chinese Yuan",
    locale: "zh-CN",
    decimalPlaces: 2,
    symbolPosition: "prefix",
    spaceAfterSymbol: false
  },
  {
    code: "BRL",
    symbol: "R$",
    name: "Brazilian Real",
    locale: "pt-BR",
    decimalPlaces: 2,
    symbolPosition: "prefix",
    spaceAfterSymbol: false
  },
  {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    locale: "en-IN",
    decimalPlaces: 2,
    symbolPosition: "prefix",
    spaceAfterSymbol: false
  },
  {
    code: "CHF",
    symbol: "Fr",
    name: "Swiss Franc",
    locale: "de-CH",
    decimalPlaces: 2,
    symbolPosition: "prefix",
    spaceAfterSymbol: true
  },
  {
    code: "MXN",
    symbol: "$",
    name: "Mexican Peso",
    locale: "es-MX",
    decimalPlaces: 2,
    symbolPosition: "prefix",
    spaceAfterSymbol: false
  },
  {
    code: "SGD",
    symbol: "$",
    name: "Singapore Dollar",
    locale: "en-SG",
    decimalPlaces: 2,
    symbolPosition: "prefix",
    spaceAfterSymbol: false
  }
];

export function getCurrencyByCode(code: string): Currency | undefined {
  return currencies.find((currency) => currency.code === code);
}

export function formatCurrency(amount: number, currencyCode: string) {
  const currency = currencies.find((c) => c.code === currencyCode);

  if (!currency) return amount.toString();

  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code
  }).format(amount);
}

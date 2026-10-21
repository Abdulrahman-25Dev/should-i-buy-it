export const DEFAULT_CURRENCY = "SAR"; // ريال سعودي
export const DEFAULT_MONTHLY_HOURS = 160; // 40 ساعة أسبوعياً * 4 أسابيع

export const CURRENCIES = [
  { label: "ريال سعودي (SAR)", value: "SAR", symbol: "⃁" },
  { label: "درهم إماراتي (AED)", value: "AED", symbol: "د.إ" },
  { label: "دينار كويتي (KWD)", value: "KWD", symbol: "د.ك" },
  { label: "دولار أمريكي (USD)", value: "USD", symbol: "$" },
];

export function getCurrencyLabel(currency: string, language: string) {
  if (!language.startsWith("ar")) return currency;

  const label = CURRENCIES.find((option) => option.value === currency)?.label;
  return label?.replace(/ \([A-Z]+\)$/, "") ?? currency;
}

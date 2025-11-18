export type Currency = "DH" | "FCFA";

/**
 * Format a numeric price according to the chosen currency.
 * - DH: displays value with grouping and "DH" suffix
 * - FCFA: displays value with grouping and "FCFA" suffix (no decimals)
 *
 * Uses Intl.NumberFormat with fr-FR locale for readable grouping.
 */
export const formatCurrency = (amount: number, currency: Currency = "DH") => {
  if (amount == null || Number.isNaN(amount)) return "";

  // Use no decimal places for these marketplace prices
  const formatter = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  const formatted = formatter.format(Math.round(amount));

  if (currency === "FCFA") {
    return `${formatted} FCFA`;
  }

  // Default to DH
  return `${formatted} DH`;
};



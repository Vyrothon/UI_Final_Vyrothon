/** US dollar formatting for billing UI. */
export function formatUsd(amount: number, fractionDigits: 0 | 2 = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount)
}

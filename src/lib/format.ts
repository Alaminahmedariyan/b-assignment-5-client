
export function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return typeof value === 'number' ? value : Number(value);
}

export function formatTaka(value: string | number): string {
  return `৳${toNumber(value).toLocaleString('en-BD')}`;
}

export function calculateDiscountPercent(
  originalPrice: string | number | null,
  currentPrice: string | number,
): number | null {
  const original = toNumber(originalPrice);
  const current = toNumber(currentPrice);

  if (!original || original <= current) {
    return null;
  }

  return Math.round(((original - current) / original) * 100);
}
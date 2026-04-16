const countFormatter = new Intl.NumberFormat('en-US');

export function formatCount(value: number | null | undefined) {
  return countFormatter.format(value ?? 0);
}

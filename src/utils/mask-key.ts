export function maskKey(key: string): string {
  if (key.length <= 8) return key;
  return `${key.slice(0, 4)}${"\u2022".repeat(16)}${key.slice(-4)}`;
}

/**
 * Returns the French version of a field if available, otherwise falls back to the default (German).
 * Usage: loc(item, 'title', language) → item.title_fr || item.title
 */
export function loc<T extends Record<string, any>>(
  item: T,
  field: string,
  language: string
): string {
  if (language === "fr") {
    const frValue = item[`${field}_fr`];
    if (frValue && (typeof frValue === "string" ? frValue.trim() : true)) return frValue;
  }
  return item[field] ?? "";
}

/**
 * Returns the French version of a JSON array field if available.
 */
export function locArray<T extends Record<string, any>>(
  item: T,
  field: string,
  language: string
): any[] {
  if (language === "fr") {
    const frValue = item[`${field}_fr`];
    if (Array.isArray(frValue) && frValue.length > 0) return frValue;
  }
  return Array.isArray(item[field]) ? item[field] : [];
}

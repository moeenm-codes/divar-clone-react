export function normalizePersian(str = "") {
  return String(str)
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200C/g, "")
    .replace(/ـ/g, "")
    .toLowerCase();
}

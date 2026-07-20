function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function toCsv<T extends object>(
  rows: T[],
  columns: { key: keyof T; header: string }[]
): string {
  const headerRow = columns.map((c) => escapeCsvCell(c.header)).join(",");
  const dataRows = rows.map((row) =>
    columns.map((c) => escapeCsvCell(row[c.key])).join(",")
  );
  return [headerRow, ...dataRows].join("\r\n");
}

/**
 * Converts "GRUPO 1" → "GRUPO A", "GRUPO 2" → "GRUPO B", etc.
 * Used when DB stores numbers but UI should show letters.
 */
export function groupNumberToLetter(name: string): string {
  return name.replace(/^(GRUPO)\s+(\d+)$/i, (_, prefix, n) => {
    const letter = String.fromCharCode(64 + parseInt(n));
    return `${prefix} ${letter}`;
  });
}

/**
 * Converts "GRUPO A" → "GRUPO 1", "GRUPO B" → "GRUPO 2", etc.
 * Used to map back from display name to DB name.
 */
export function groupLetterToNumber(name: string): string {
  return name.replace(/^(GRUPO)\s+([A-H])$/i, (_, prefix, l) => {
    const num = l.toUpperCase().charCodeAt(0) - 64;
    return `${prefix} ${num}`;
  });
}

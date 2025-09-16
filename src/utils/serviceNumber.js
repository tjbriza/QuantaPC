// generates a service request number.
// format: SR-YYYYMMDD-XXXX (X are base36 chars)
export function generateServiceNumber() {
  const ts = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const date = `${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SR-${date}-${rand}`;
}

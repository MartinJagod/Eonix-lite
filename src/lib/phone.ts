import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function toE164(raw: string, country: string = 'AR'): string | null {
  const p = parsePhoneNumberFromString(raw, country);
  return p?.isValid() ? p.number : null;
}

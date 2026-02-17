import en from "./messages/en.json";
import fr from "./messages/fr.json";

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

const messages: Record<Locale, typeof en> = { en, fr };

/** Get messages for a locale, falling back to English */
export function getMessages(locale: Locale = defaultLocale): typeof en {
  return messages[locale] ?? messages.en;
}

/**
 * Simple translation helper.
 * Supports dot-notation keys like "timer.begin"
 */
export function createT(locale: Locale = defaultLocale) {
  const msgs = getMessages(locale);

  return function t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split(".");
    let value: unknown = msgs;
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // fallback to key
      }
    }

    if (typeof value !== "string") return key;

    if (params) {
      return value.replace(
        /\{(\w+)\}/g,
        (_, name: string) => String(params[name] ?? `{${name}}`)
      );
    }

    return value;
  };
}

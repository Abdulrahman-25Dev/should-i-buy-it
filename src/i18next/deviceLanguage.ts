export type AppLanguage = "ar" | "en";

export function getDeviceLanguage(): AppLanguage {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return locale.toLowerCase().startsWith("en") ? "en" : "ar";
  } catch {
    return "ar";
  }
}

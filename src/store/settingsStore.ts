import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import i18n from "../i18next/i18n";
import { getDeviceLanguage, type AppLanguage } from "../i18next/deviceLanguage";
import { zustandStorage } from "../lib/storage";

export type AppTheme = "light" | "dark" | "system";
export type { AppLanguage } from "../i18next/deviceLanguage";

interface SettingsState {
  theme: AppTheme;
  language: AppLanguage;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (language: AppLanguage) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      language: getDeviceLanguage(),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => {
        set({ language });
        void i18n.changeLanguage(language);
      },
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    },
  ),
);

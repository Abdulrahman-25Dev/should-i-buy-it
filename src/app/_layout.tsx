// src/app/_layout.tsx
import "./global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { CustomAlertProvider } from "../components/CustomAlert";
import i18n from "../i18next/i18n";
import { useSettingsStore } from "../store/settingsStore";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <SafeAreaProvider>
      <CustomAlertProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="item/[id]" options={{ presentation: "modal" }} />
        </Stack>
      </CustomAlertProvider>
    </SafeAreaProvider>
  );
}

// src/app/_layout.tsx
import "./global.css";
import { useCallback, useEffect, useState } from "react";
import { router, Stack, useSegments } from "expo-router";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { CustomAlertProvider } from "../components/CustomAlert";
import CustomSplash from "../components/CustomSplash";
import i18n from "../i18next/i18n";
import { useIncomeStore } from "../store/incomeStore";
import { useSettingsStore } from "../store/settingsStore";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const onboardingCompleted = useIncomeStore(
    (state) => state.onboardingCompleted,
  );
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const { setColorScheme } = useColorScheme();
  const segments = useSegments();
  const [incomeHydrated, setIncomeHydrated] = useState(
    useIncomeStore.persist.hasHydrated(),
  );
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const hideSplash = useCallback(() => setIsSplashVisible(false), []);

  useEffect(() => {
    if (incomeHydrated) return;
    if (useIncomeStore.persist.hasHydrated()) {
      setIncomeHydrated(true);
      return;
    }
    return useIncomeStore.persist.onFinishHydration(() => {
      setIncomeHydrated(true);
    });
  }, [incomeHydrated]);

  useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);

  useEffect(() => {
    if (!incomeHydrated) return;

    const isOnboardingRoute = segments[0] === "onboarding";
    if (onboardingCompleted && isOnboardingRoute) {
      router.replace("/(tabs)");
    } else if (!onboardingCompleted && !isOnboardingRoute) {
      router.replace("/onboarding/welcome");
    }
  }, [incomeHydrated, onboardingCompleted, segments]);

  return (
    <SafeAreaProvider>
      <CustomAlertProvider>
        <View className="flex-1">
          {incomeHydrated ? (
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="item/[id]"
                options={{ presentation: "modal" }}
              />
            </Stack>
          ) : null}
          {isSplashVisible ? (
            <View className="absolute inset-0 z-50">
              <CustomSplash isReady={incomeHydrated} onReady={hideSplash} />
            </View>
          ) : null}
        </View>
      </CustomAlertProvider>
    </SafeAreaProvider>
  );
}

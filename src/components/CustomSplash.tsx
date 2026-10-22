import { useEffect, useRef, useState } from "react";
import { Animated, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import { Clock3, Coins, Sparkles } from "lucide-react-native";

export interface CustomSplashProps {
  isReady?: boolean;
  onReady?: () => void;
}

export default function CustomSplash({
  isReady = false,
  onReady,
}: CustomSplashProps) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const [isVisible, setIsVisible] = useState(true);
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const copyOpacity = useRef(new Animated.Value(0)).current;
  const copyTranslateY = useRef(new Animated.Value(10)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          damping: 14,
          stiffness: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(copyOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(copyTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [copyOpacity, copyTranslateY, logoOpacity, logoScale]);

  useEffect(() => {
    if (!isReady || !isVisible) return;

    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;

      setIsVisible(false);
      onReady?.();
    });
  }, [isReady, isVisible, onReady, screenOpacity]);

  if (!isVisible) return null;

  const isDarkMode = colorScheme === "dark";

  return (
    <Animated.View style={{ flex: 1, opacity: screenOpacity }}>
      <SafeAreaView
        className="flex-1 items-center justify-center bg-light-bg px-8 dark:bg-dark-bg"
        edges={["top", "bottom", "left", "right"]}
      >
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

        <View className="absolute left-8 top-1/4 h-2 w-2 rounded-full bg-emerald-500/60" />
        <View className="absolute bottom-1/4 right-10 h-3 w-3 rounded-full bg-amber-400/70" />

        <Animated.View
          accessibilityLabel={t("home.appName")}
          className="mb-9 h-36 w-36 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
        >
          <View className="h-24 w-24 items-center justify-center rounded-full bg-emerald-600 shadow-lg shadow-emerald-900/20">
            <Clock3 size={43} color="#ffffff" strokeWidth={1.8} />
          </View>
          <View className="absolute -right-1 bottom-2 h-11 w-11 items-center justify-center rounded-full border-4 border-light-bg bg-amber-400 dark:border-dark-bg">
            <Coins size={21} color="#422006" strokeWidth={2} />
          </View>
          <Sparkles
            accessibilityElementsHidden
            importantForAccessibility="no"
            size={17}
            color={isDarkMode ? "#6ee7b7" : "#059669"}
            style={{ position: "absolute", top: 12, right: 15 }}
          />
        </Animated.View>

        <Animated.View
          className="items-center"
          style={{
            opacity: copyOpacity,
            transform: [{ translateY: copyTranslateY }],
          }}
        >
          <Text className="mb-3 text-center text-4xl font-black text-light-text dark:text-dark-text">
            {t("home.appName")}
          </Text>
          <Text className="max-w-sm text-center text-base font-medium leading-7 text-light-muted dark:text-dark-muted">
            {t("onboarding.welcome.description")}
          </Text>
        </Animated.View>

        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className="absolute bottom-12 h-1 w-16 overflow-hidden rounded-full bg-light-border dark:bg-dark-border"
        >
          <View className="h-full w-2/3 rounded-full bg-emerald-600" />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

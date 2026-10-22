import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Clock3 } from "lucide-react-native";

export interface CustomSplashProps {
  isReady?: boolean;
  onReady?: () => void;
  onFinish?: () => void;
}

export default function CustomSplash({
  isReady = true,
  onReady,
  onFinish,
}: CustomSplashProps) {
  const { t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();
  const [isVisible, setIsVisible] = useState(true);
  const [hasMinimumDurationElapsed, setHasMinimumDurationElapsed] =
    useState(false);
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const copyOpacity = useRef(new Animated.Value(0)).current;
  const copyTranslateY = useRef(new Animated.Value(10)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const hasStartedExit = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasMinimumDurationElapsed(true), 2000);

    return () => clearTimeout(timer);
  }, []);

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
    if (
      !isReady ||
      !hasMinimumDurationElapsed ||
      !isVisible ||
      hasStartedExit.current
    ) {
      return;
    }

    hasStartedExit.current = true;

    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;

      setIsVisible(false);
      onFinish?.();
      onReady?.();
    });
  }, [
    hasMinimumDurationElapsed,
    isReady,
    isVisible,
    onFinish,
    onReady,
    screenOpacity,
  ]);

  if (!isVisible) return null;

  const isArabic = i18n.resolvedLanguage?.startsWith("ar") ?? false;
  const isDarkMode = colorScheme === "dark";

  return (
    <Animated.View style={{ flex: 1, opacity: screenOpacity }}>
      <SafeAreaView
        className="flex-1 items-center justify-center bg-light-bg px-8 dark:bg-dark-bg"
        edges={["top", "bottom", "left", "right"]}
      >
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={isDarkMode ? "#0f172a" : "#f8fafc"}
        />

        <Animated.View
          accessibilityLabel={t("home.appName")}
          className="mb-9 h-36 w-36 items-center justify-center rounded-full border border-amber-300/20 bg-amber-400/10"
          style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
        >
          <Clock3 size={62} color="#fbbf24" strokeWidth={1.7} />
          <View className="absolute right-7 top-7 h-10 w-10 items-center justify-center rounded-full border-4 border-light-bg bg-amber-400 dark:border-dark-bg">
            <ArrowUpRight size={22} color="#422006" strokeWidth={2.7} />
          </View>
        </Animated.View>

        <Animated.View
          className="items-center"
          style={{
            opacity: copyOpacity,
            transform: [{ translateY: copyTranslateY }],
          }}
        >
          <Text className="mb-3 text-center text-4xl font-black text-light-text dark:text-dark-text">
            {isArabic ? "تستاهل؟" : "Worth It?"}
          </Text>
          <Text className="max-w-sm text-center text-base font-medium leading-7 text-light-muted dark:text-dark-muted">
            {isArabic
              ? "احسب تكلفتك بالوقت، واعرف إذا كان يستاهل."
              : "Calculate the cost in time and decide if it is worth it."}
          </Text>
        </Animated.View>

        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className="absolute bottom-12"
        >
          <ActivityIndicator size="small" color="#fbbf24" />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

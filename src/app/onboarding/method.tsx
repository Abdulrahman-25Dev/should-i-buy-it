import { router } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { useSettingsStore } from "../../store/settingsStore";

type IncomeMethod = "monthly" | "hourly";

export default function MethodScreen() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const language = useSettingsStore((state) => state.language);
  const isArabic = language === "ar";
  const [method, setMethod] = useState<IncomeMethod>("monthly");
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

  return (
    <SafeAreaView
      className="flex-1 bg-light-bg dark:bg-dark-bg"
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingVertical: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          onPress={() => router.back()}
          className={`mb-8 h-11 w-11 items-center justify-center rounded-full border border-light-border dark:border-dark-border ${isArabic ? "self-end" : "self-start"}`}
        >
          <BackArrow
            size={20}
            color={colorScheme === "dark" ? "#f8fafc" : "#0f172a"}
          />
        </Pressable>

        <View className="mb-8">
          <Text
            className={`mb-2 text-xs font-bold uppercase tracking-[2px] text-emerald-700 dark:text-emerald-400 ${isArabic ? "text-right" : "text-left"}`}
          >
            {t("onboarding.progress", { current: 1, total: 2 })}
          </Text>
          <Text
            className={`text-3xl font-black leading-10 text-light-text dark:text-dark-text ${isArabic ? "text-right" : "text-left"}`}
          >
            {t("onboarding.method.title")}
          </Text>
          <Text
            className={`mt-3 text-sm leading-6 text-light-muted dark:text-dark-muted ${isArabic ? "text-right" : "text-left"}`}
          >
            {t("onboarding.method.description")}
          </Text>
        </View>

        <View className="gap-4">
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ selected: method === "monthly" }}
            onPress={() => setMethod("monthly")}
            className={`rounded-2xl border p-5 ${method === "monthly" ? "border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/10" : "border-light-border bg-light-card dark:border-dark-border dark:bg-dark-card"}`}
          >
            <View
              className={`mb-4 flex-row items-start justify-between ${isArabic ? "flex-row-reverse" : ""}`}
            >
              <View className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-500/15">
                <Calendar size={22} color="#059669" />
              </View>
              <View
                className={`h-6 w-6 items-center justify-center rounded-full border ${method === "monthly" ? "border-emerald-600 bg-emerald-600" : "border-light-border dark:border-dark-border"}`}
              >
                {method === "monthly" ? (
                  <Check size={15} color="#ffffff" />
                ) : null}
              </View>
            </View>
            <Text
              className={`text-base font-black text-light-text dark:text-dark-text ${isArabic ? "text-right" : "text-left"}`}
            >
              {t("onboarding.method.monthlyTitle")}
            </Text>
            <Text
              className={`mt-2 text-sm leading-6 text-light-muted dark:text-dark-muted ${isArabic ? "text-right" : "text-left"}`}
            >
              {t("onboarding.method.monthlyDescription")}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ selected: method === "hourly" }}
            onPress={() => setMethod("hourly")}
            className={`rounded-2xl border p-5 ${method === "hourly" ? "border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/10" : "border-light-border bg-light-card dark:border-dark-border dark:bg-dark-card"}`}
          >
            <View
              className={`mb-4 flex-row items-start justify-between ${isArabic ? "flex-row-reverse" : ""}`}
            >
              <View className="rounded-xl bg-amber-100 p-3 dark:bg-amber-500/15">
                <View className="flex-row items-center gap-1">
                  <DollarSign size={19} color="#d97706" />
                  <Clock size={18} color="#d97706" />
                </View>
              </View>
              <View
                className={`h-6 w-6 items-center justify-center rounded-full border ${method === "hourly" ? "border-emerald-600 bg-emerald-600" : "border-light-border dark:border-dark-border"}`}
              >
                {method === "hourly" ? (
                  <Check size={15} color="#ffffff" />
                ) : null}
              </View>
            </View>
            <Text
              className={`text-base font-black text-light-text dark:text-dark-text ${isArabic ? "text-right" : "text-left"}`}
            >
              {t("onboarding.method.hourlyTitle")}
            </Text>
            <Text
              className={`mt-2 text-sm leading-6 text-light-muted dark:text-dark-muted ${isArabic ? "text-right" : "text-left"}`}
            >
              {t("onboarding.method.hourlyDescription")}
            </Text>
          </Pressable>
        </View>

        <View className="mt-auto pt-8">
          <Button
            onPress={() =>
              router.push({
                pathname: "/onboarding/amount",
                params: { method },
              })
            }
            className="min-h-14 rounded-2xl"
            contentClassName="flex-row-reverse"
          >
            {isArabic ? (
              <ChevronRight size={20} color="#ffffff" />
            ) : (
              <ChevronLeft size={20} color="#ffffff" />
            )}
            <Text className="text-base font-bold text-white">
              {t("common.continue")}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

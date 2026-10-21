import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { getCurrencyLabel } from "../../lib/constants";
import { useIncomeStore } from "../../store/incomeStore";
import { useSettingsStore } from "../../store/settingsStore";

type IncomeMethod = "monthly" | "hourly";

function parseLocalizedNumber(value: string): number {
  const normalized = value
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٬,\s]/g, "")
    .replace(/٫/g, ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function AmountScreen() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const { method: routeMethod } = useLocalSearchParams<{
    method?: IncomeMethod;
  }>();
  const language = useSettingsStore((state) => state.language);
  const isArabic = language === "ar";
  const monthlyIncome = useIncomeStore((state) => state.monthlyIncome);
  const storedHourlyRate = useIncomeStore((state) => state.hourlyRate);
  const workHoursPerDay = useIncomeStore((state) => state.workHoursPerDay);
  const workDaysPerWeek = useIncomeStore((state) => state.workDaysPerWeek);
  const setMonthlyIncome = useIncomeStore((state) => state.setMonthlyIncome);
  const setWorkHoursPerDay = useIncomeStore(
    (state) => state.setWorkHoursPerDay,
  );
  const setWorkDaysPerWeek = useIncomeStore(
    (state) => state.setWorkDaysPerWeek,
  );
  const setHourlyRate = useIncomeStore((state) => state.setHourlyRate);
  const completeOnboarding = useIncomeStore(
    (state) => state.completeOnboarding,
  );
  const method: IncomeMethod = routeMethod === "hourly" ? "hourly" : "monthly";
  const isMonthly = method === "monthly";
  const [income, setIncome] = useState(
    monthlyIncome > 0 ? String(monthlyIncome) : "",
  );
  const [hours, setHours] = useState(String(workHoursPerDay || 8));
  const [days, setDays] = useState(String(workDaysPerWeek || 5));
  const [directRate, setDirectRate] = useState(
    monthlyIncome === 0 && storedHourlyRate !== 50
      ? String(storedHourlyRate)
      : "",
  );
  const [error, setError] = useState("");
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;
  const currency = useIncomeStore((state) => state.currency);
  const currencyLabel = getCurrencyLabel(currency, language);

  const incomeValue = parseLocalizedNumber(income);
  const hoursValue = parseLocalizedNumber(hours);
  const daysValue = parseLocalizedNumber(days);
  const hourlyValue = parseLocalizedNumber(directRate);
  const monthlyHours = hoursValue * daysValue * 4.33;
  const calculatedRate = isMonthly
    ? monthlyHours > 0
      ? Math.round((incomeValue / monthlyHours) * 100) / 100
      : 0
    : hourlyValue;

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-SA", {
      maximumFractionDigits: 2,
    }).format(amount);

  const handleConfirm = () => {
    if (isMonthly) {
      if (
        incomeValue <= 0 ||
        hoursValue <= 0 ||
        hoursValue > 24 ||
        daysValue <= 0 ||
        daysValue > 7
      ) {
        setError(t("onboarding.amount.validation"));
        return;
      }
      setWorkHoursPerDay(hoursValue);
      setWorkDaysPerWeek(daysValue);
      setMonthlyIncome(incomeValue);
    } else {
      if (hourlyValue <= 0) {
        setError(t("onboarding.amount.validation"));
        return;
      }
      setMonthlyIncome(0);
      setHourlyRate(hourlyValue);
    }

    setError("");
    completeOnboarding();
    router.replace("/(tabs)");
  };

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
        keyboardShouldPersistTaps="handled"
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

        <View className="mb-7">
          <Text
            className={`mb-2 text-xs font-bold uppercase tracking-[2px] text-emerald-700 dark:text-emerald-400 ${isArabic ? "text-right" : "text-left"}`}
          >
            {t("onboarding.progress", { current: 2, total: 2 })}
          </Text>
          <Text
            className={`text-3xl font-black leading-10 text-light-text dark:text-dark-text ${isArabic ? "text-right" : "text-left"}`}
          >
            {t(
              isMonthly
                ? "onboarding.amount.monthlyTitle"
                : "onboarding.amount.hourlyTitle",
            )}
          </Text>
          <Text
            className={`mt-3 text-sm leading-6 text-light-muted dark:text-dark-muted ${isArabic ? "text-right" : "text-left"}`}
          >
            {t("onboarding.amount.description")}
          </Text>
        </View>

        <View className="gap-5">
          {isMonthly ? (
            <>
              <Input
                label={t("onboarding.amount.monthlyIncome")}
                value={income}
                onChangeText={(value) => {
                  setIncome(value);
                  setError("");
                }}
                placeholder="0"
                keyboardType="decimal-pad"
                accessibilityLabel={t("onboarding.amount.monthlyIncome")}
                style={{
                  textAlign: isArabic ? "right" : "left",
                  writingDirection: isArabic ? "rtl" : "ltr",
                }}
              />
              <View className="flex-row gap-3">
                <Input
                  containerClassName="flex-1"
                  label={t("onboarding.amount.dailyHours")}
                  value={hours}
                  onChangeText={(value) => {
                    setHours(value);
                    setError("");
                  }}
                  placeholder="8"
                  keyboardType="decimal-pad"
                  accessibilityLabel={t("onboarding.amount.dailyHours")}
                  style={{
                    textAlign: isArabic ? "right" : "left",
                    writingDirection: isArabic ? "rtl" : "ltr",
                  }}
                />
                <Input
                  containerClassName="flex-1"
                  label={t("onboarding.amount.weeklyDays")}
                  value={days}
                  onChangeText={(value) => {
                    setDays(value);
                    setError("");
                  }}
                  placeholder="5"
                  keyboardType="decimal-pad"
                  accessibilityLabel={t("onboarding.amount.weeklyDays")}
                  style={{
                    textAlign: isArabic ? "right" : "left",
                    writingDirection: isArabic ? "rtl" : "ltr",
                  }}
                />
              </View>
            </>
          ) : (
            <Input
              label={t("onboarding.amount.hourlyRate")}
              value={directRate}
              onChangeText={(value) => {
                setDirectRate(value);
                setError("");
              }}
              placeholder="0"
              keyboardType="decimal-pad"
              accessibilityLabel={t("onboarding.amount.hourlyRate")}
              style={{
                textAlign: isArabic ? "right" : "left",
                writingDirection: isArabic ? "rtl" : "ltr",
              }}
            />
          )}
        </View>

        <View className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <View
            className={`mb-3 flex-row items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
          >
            {isMonthly ? (
              <Calendar size={18} color="#059669" />
            ) : (
              <Clock size={18} color="#059669" />
            )}
            <Text className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              {t("onboarding.amount.previewTitle")}
            </Text>
          </View>
          <View
            className={`flex-row items-end gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
          >
            <Text className="text-3xl font-black text-emerald-800 dark:text-emerald-300">
              {formatAmount(calculatedRate)}
            </Text>
            <Text className="pb-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {currencyLabel} {t("onboarding.amount.perHour")}
            </Text>
          </View>
          {isMonthly ? (
            <Text
              className={`mt-2 text-xs leading-5 text-emerald-800/80 dark:text-emerald-200/80 ${isArabic ? "text-right" : "text-left"}`}
            >
              {t("onboarding.amount.monthlyBasis", {
                hours: formatAmount(monthlyHours),
              })}
            </Text>
          ) : null}
        </View>

        {error ? (
          <Text
            accessibilityRole="alert"
            className={`mt-3 text-sm font-semibold text-rose-600 dark:text-rose-400 ${isArabic ? "text-right" : "text-left"}`}
          >
            {error}
          </Text>
        ) : null}

        <View className="mt-auto pt-7">
          <Button
            onPress={handleConfirm}
            className="min-h-14 rounded-2xl"
            contentClassName="flex-row-reverse"
          >
            <Check size={19} color="#ffffff" />
            <Text className="text-base font-bold text-white">
              {t("onboarding.amount.confirm")}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

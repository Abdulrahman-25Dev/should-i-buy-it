import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
  DollarSign,
  Calendar,
  Clock,
  Moon,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Coins,
  Languages,
} from "lucide-react-native";
import { useIncomeStore } from "../../store/incomeStore";
import {
  AppLanguage,
  AppTheme,
  useSettingsStore,
} from "../../store/settingsStore";
import { useCustomAlert } from "../../components/CustomAlert";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { showAlert } = useCustomAlert();
  const {
    monthlyIncome,
    workHoursPerDay,
    workDaysPerWeek,
    currency,
    setMonthlyIncome,
  } = useIncomeStore();

  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  // حساب أجر الساعة الحقيقي
  const calculatedHourlyRate = () => {
    const income = monthlyIncome || 0;
    const hours = workHoursPerDay || 8;
    const days = workDaysPerWeek || 5;
    if (income <= 0 || hours <= 0 || days <= 0) return 0;
    const monthlyHours = hours * days * 4.33;
    return Math.round((income / monthlyHours) * 100) / 100;
  };

  const handleResetData = () => {
    showAlert(t("settings.resetTitle"), t("settings.resetConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.confirm"),
        style: "destructive",
        onPress: () => {
          setMonthlyIncome(0);
          showAlert(t("common.done"), t("settings.resetComplete"));
        },
      },
    ]);
  };

  const isArabic = language === "ar"; // Assuming you have a translation key for the current language

  return (
    <SafeAreaView
      className="flex-1 bg-light-bg dark:bg-dark-bg"
      edges={["top", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="pt-4 pb-6 border-b border-light-border dark:border-dark-border mb-6">
          <Text
            className={`text-2xl font-black text-light-text dark:text-dark-text ${isArabic ? "text-right" : "text-left"}`}
          >
            {t("settings.title")}
          </Text>
          <Text
            className={`text-xs font-semibold text-light-muted dark:text-dark-muted ${isArabic ? "text-right" : "text-left"} mt-1`}
          >
            {t("settings.subtitle")}
          </Text>
        </View>

        {/* Calculated Hourly Rate Preview Card */}
        <View className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 mb-6 items-center justify-center shadow-md">
          <Text className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
            {t("settings.hourlyRate")}
          </Text>
          <Text className="text-4xl font-black text-emerald-700 dark:text-emerald-400">
            {calculatedHourlyRate()} {currency}
          </Text>
          <Text className="text-xs text-light-muted dark:text-dark-muted mt-1">
            {t("settings.perWorkHour")}
          </Text>
        </View>

        {/* Section 1: App Preferences */}
        <Text
          className={`text-sm font-bold text-light-muted dark:text-dark-muted mb-3 ${isArabic ? "text-right" : "text-left"}`}
        >
          {t("settings.preferences")}
        </Text>

        <View className="p-4 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border mb-6 gap-4">
          <View className="pb-3 border-b border-light-border dark:border-dark-border">
            <View
              className={`flex-row items-center gap-2 mb-3 ${isArabic ? "justify-end" : "justify-start"}`}
            >
              {isArabic ? (
                <>
                  <Moon size={18} color="#f59e0b" />
                  <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                    {t("settings.theme")}
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                    {t("settings.theme")}
                  </Text>
                  <Moon size={18} color="#f59e0b" />
                </>
              )}
            </View>
            <View className="flex-row gap-2">
              {(
                [
                  ["system", "settings.themeSystem"],
                  ["light", "settings.themeLight"],
                  ["dark", "settings.themeDark"],
                ] as const
              ).map(([value, label]) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => setTheme(value as AppTheme)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: theme === value }}
                  className={`flex-1 items-center rounded-lg border px-2 py-2 ${
                    theme === value
                      ? "bg-emerald-600 border-emerald-500"
                      : "bg-light-input dark:bg-dark-input border-light-border dark:border-dark-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${theme === value ? "text-white" : "text-light-muted dark:text-dark-muted"}`}
                  >
                    {t(label)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Language Selection */}
          <View className="border-t border-light-border pt-4 dark:border-dark-border">
            <View
              className={`mb-3 flex-row items-center gap-2 ${isArabic ? "justify-end" : "justify-start"}`}
            >
              {isArabic ? (
                <>
                  <Languages size={18} color="#3b82f6" />
                  <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                    {t("settings.language")}
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                    {t("settings.language")}
                  </Text>
                  <Languages size={18} color="#3b82f6" />
                </>
              )}
            </View>
            <View className="flex-row gap-2">
              {["ar", "en"].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => setLanguage(lang as AppLanguage)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: language === lang }}
                  className={`min-h-11 flex-1 items-center justify-center rounded-lg border px-3 py-2 ${
                    language === lang
                      ? "bg-emerald-600 border-emerald-500"
                      : "bg-light-input dark:bg-dark-input border-light-border dark:border-dark-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold uppercase ${
                      language === lang
                        ? "text-white"
                        : "text-light-muted dark:text-dark-muted"
                    }`}
                  >
                    {t(lang === "ar" ? "settings.arabic" : "settings.english")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Section 1: Financial Profile Cards (Prepped for BottomSheet) */}
        <Text
          className={`text-sm font-bold text-light-muted dark:text-dark-muted mb-3 ${isArabic ? "text-right" : "text-left"}`}
        >
          {t("settings.financialProfile")}
        </Text>

        <View className="mb-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border overflow-hidden">
          {/* الدخل الشهري الصافي */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              showAlert(t("common.alert"), t("settings.bottomSheetNotice"))
            }
            className={` ${isArabic ? "flex-row" : "flex-row-reverse"} p-4 items-center justify-between border-b border-light-border dark:border-dark-border`}
          >
            {isArabic ? (
              <ChevronLeft size={18} color="#64748b" />
            ) : (
              <ChevronRight size={18} color="#64748b" className="rotate-180" />
            )}
            <View
              className={` ${isArabic ? "items-end" : "items-start"} flex-1 px-3`}
            >
              <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                {t("settings.monthlyIncome")}
              </Text>
              <Text className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                {monthlyIncome || 0} {currency}
              </Text>
            </View>
            <View className="p-2.5 rounded-xl bg-emerald-500/10">
              <DollarSign size={18} color="#10b981" />
            </View>
          </TouchableOpacity>

          {/* ساعات العمل اليومية */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              showAlert(t("common.alert"), t("settings.bottomSheetNotice"))
            }
            className={` ${isArabic ? "flex-row" : "flex-row-reverse"} p-4 items-center justify-between border-b border-light-border dark:border-dark-border`}
          >
            {isArabic ? (
              <ChevronLeft size={18} color="#64748b" />
            ) : (
              <ChevronRight size={18} color="#64748b" />
            )}
            <View
              className={` ${isArabic ? "items-end" : "items-start"} flex-1 px-3`}
            >
              <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                {t("settings.dailyHours")}
              </Text>
              <Text className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                {t("settings.hoursPerDay", { count: workHoursPerDay || 8 })}
              </Text>
            </View>
            <View className="p-2.5 rounded-xl bg-amber-500/10">
              <Clock size={18} color="#f59e0b" />
            </View>
          </TouchableOpacity>

          {/* أيام العمل في الأسبوع */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              showAlert(t("common.alert"), t("settings.bottomSheetNotice"))
            }
            className={` ${isArabic ? "flex-row" : "flex-row-reverse"} p-4 items-center justify-between border-b border-light-border dark:border-dark-border`}
          >
            {isArabic ? (
              <ChevronLeft size={18} color="#64748b" />
            ) : (
              <ChevronRight size={18} color="#64748b" />
            )}
            <View
              className={` ${isArabic ? "items-end" : "items-start"} flex-1 px-3`}
            >
              <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                {t("settings.weeklyDays")}
              </Text>
              <Text className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                {t("settings.daysPerWeek", { count: workDaysPerWeek || 5 })}
              </Text>
            </View>
            <View className="p-2.5 rounded-xl bg-blue-500/10">
              <Calendar size={18} color="#3b82f6" />
            </View>
          </TouchableOpacity>

          {/* العملة المفضلة */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              showAlert(t("common.alert"), t("settings.bottomSheetNotice"))
            }
            className={` ${isArabic ? "flex-row" : "flex-row-reverse"} p-4 items-center justify-between`}
          >
            {isArabic ? (
              <ChevronLeft size={18} color="#64748b" />
            ) : (
              <ChevronRight size={18} color="#64748b" />
            )}
            <View
              className={` ${isArabic ? "items-end" : "items-start"} flex-1 px-3`}
            >
              <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                {t("settings.currency")}
              </Text>
              <Text className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                {currency}
              </Text>
            </View>
            <View className="p-2.5 rounded-xl bg-purple-500/10">
              <Coins size={18} color="#a855f7" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Danger Zone: Reset Data */}
        <TouchableOpacity
          onPress={handleResetData}
          activeOpacity={0.8}
          className="py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex-row items-center justify-center gap-2 mb-6"
        >
          <Trash2 size={16} color="#f43f5e" />
          <Text className="text-rose-500 font-bold text-xs">
            {t("settings.reset")}
          </Text>
        </TouchableOpacity>

        {/* App Info Footer */}
        <View className="items-center justify-center pt-2">
          <Text className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {t("settings.version")}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

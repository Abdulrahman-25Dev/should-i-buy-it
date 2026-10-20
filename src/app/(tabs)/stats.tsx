import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Award, Clock, TrendingUp } from "lucide-react-native";
import { useIncomeStore } from "../../store/incomeStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { calculateTrueCost } from "../../lib/calculations";
import { useTranslation } from "react-i18next";
import i18n from "@/i18next/i18n";

function formatNumber(value: number, maximumFractionDigits = 0) {
  return value.toLocaleString("en-US", { maximumFractionDigits });
}

export default function StatsScreen() {
  const { t } = useTranslation();
  const { items } = useWishlistStore();
  const { currency, hourlyRate } = useIncomeStore();
  const currentHourlyRate = hourlyRate > 0 ? hourlyRate : 50;
  const savedItems = items.filter((item) => item.isSaved && !item.isPurchased);
  const savedAmount = savedItems.reduce((total, item) => total + item.price, 0);
  const protectedHours = savedItems.reduce(
    (total, item) =>
      total + calculateTrueCost(item.price, currentHourlyRate).hours,
    0,
  );
  const savedPercentage =
    items.length > 0 ? Math.round((savedItems.length / items.length) * 100) : 0;

    const isArabic = i18n.language === "ar"; // Assuming you have a translation key for the current language

  return (
    <SafeAreaView
      className="flex-1 bg-light-bg dark:bg-dark-bg"
      edges={["top", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-4 pb-6 border-b border-light-border dark:border-dark-border mb-6">
          <Text className={`text-2xl font-black text-light-text dark:text-dark-text ${isArabic ? "text-right" : "text-left"}`}>
            {t("stats.title")}
          </Text>
          <Text className={`text-xs font-semibold text-light-muted dark:text-dark-muted ${isArabic ? "text-right" : "text-left"} mt-1`}>
            {t("stats.subtitle")}
          </Text>
        </View>

        <View className="flex-row-reverse gap-3 mb-3">
          <View className="flex-1 min-h-[150px] p-4 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border justify-between">
            <View className="flex-row-reverse items-center justify-between">
              <TrendingUp size={20} color="#10b981" />
              <Text className={`flex-1 text-[11px] font-bold text-light-muted dark:text-dark-muted ${isArabic ? "text-right" : "text-left"} mr-2`}>
                {t("stats.savedMoney")}
              </Text>
            </View>
            <View>
              <Text
                className="text-lg font-black text-emerald-700 dark:text-emerald-400"
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatNumber(savedAmount, 2)}
              </Text>
              <Text className={`text-xs font-semibold text-slate-500 dark:text-slate-400 ${isArabic ? "text-right" : "text-left"} mt-1`}>
                {currency}
              </Text>
            </View>
          </View>

          <View className="flex-1 min-h-[150px] p-4 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border justify-between">
            <View className="flex-row-reverse items-center justify-between">
              <Clock size={20} color="#3b82f6" />
              <Text className={`flex-1 text-[11px] font-bold text-light-muted dark:text-dark-muted ${isArabic ? "text-right" : "text-left"} mr-2`}>
                {t("stats.protectedHours")}
              </Text>
            </View>
            <View>
              <Text
                className={`text-lg font-black text-blue-700 dark:text-blue-400 ${isArabic ? "text-right" : "text-left"}`}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatNumber(protectedHours, 1)}
              </Text>
              <Text className={`text-xs font-semibold text-slate-500 dark:text-slate-400 ${isArabic ? "text-right" : "text-left"} mt-1`}>
                {t("stats.workHour")}
              </Text>
            </View>
          </View>
        </View>

        <View className={`p-4 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border mb-7 items-center justify-between ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
          <View className={` ${isArabic ? "flex-row-reverse" : "flex-row"} items-center flex-1 gap-4`}>
            <View className="w-11 h-11 rounded-xl bg-amber-500/10 items-center justify-center ml-3">
              <Award size={22} color="#f59e0b" />
            </View>
            <View className="flex-1">
              <Text className={`text-sm font-bold text-light-text dark:text-dark-text ${isArabic ? "text-right" : "text-left"}`}>
                {t("stats.awareness")}
              </Text>
              <Text className={`text-xs text-light-muted dark:text-dark-muted ${isArabic ? "text-right" : "text-left"} mt-1`}>
                {t("stats.awarenessDetail")}
              </Text>
            </View>
          </View>
          <Text className="text-2xl font-black text-amber-700 dark:text-amber-400 mr-3">
            {savedPercentage}%
          </Text>
        </View>

        <View className={`items-center justify-between mb-3 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
          <Text className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {t("stats.topSaved")}
          </Text>
          {savedItems.length > 0 && (
            <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t("stats.savedProductsCount", { count: savedItems.length })}
            </Text>
          )}
        </View>

        {savedItems.length === 0 ? (
          <View className="p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border items-center">
            <View className="w-12 h-12 rounded-full bg-emerald-500/10 items-center justify-center mb-3">
              <TrendingUp size={22} color="#10b981" />
            </View>
            <Text className="text-sm leading-6 font-semibold text-light-muted dark:text-dark-muted text-center">
              {t("stats.empty")}
            </Text>
          </View>
        ) : (
          <View className="rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border overflow-hidden">
            {savedItems.map((item, index) => {
              const hours = calculateTrueCost(
                item.price,
                currentHourlyRate,
              ).hours;

              return (
                <View
                  key={item.id}
                  className={`p-4 flex-row-reverse items-center justify-between ${
                    index < savedItems.length - 1
                      ? "border-b border-light-border dark:border-dark-border"
                      : ""
                  }`}
                >
                  <View className="flex-1 ml-3">
                    <Text
                      className="text-sm font-bold text-light-text dark:text-dark-text text-right"
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    <Text className="text-xs font-semibold text-light-muted dark:text-dark-muted text-right mt-1">
                      {formatNumber(item.price, 2)} {currency}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10">
                    <Clock size={14} color="#10b981" />
                    <Text className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {t("stats.hours", { value: formatNumber(hours, 1) })}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

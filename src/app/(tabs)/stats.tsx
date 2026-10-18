import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Award, Clock, TrendingUp } from "lucide-react-native";
import { useIncomeStore } from "../../store/incomeStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { calculateTrueCost } from "../../lib/calculations";

function formatNumber(value: number, maximumFractionDigits = 0) {
  return value.toLocaleString("en-US", { maximumFractionDigits });
}

export default function StatsScreen() {
  const { items } = useWishlistStore();
  const { currency, hourlyRate } = useIncomeStore();
  const currentHourlyRate = hourlyRate > 0 ? hourlyRate : 50;
  const savedItems = items.filter((item) => !item.isPurchased);
  const savedAmount = savedItems.reduce((total, item) => total + item.price, 0);
  const protectedHours = savedItems.reduce(
    (total, item) =>
      total + calculateTrueCost(item.price, currentHourlyRate).hours,
    0,
  );
  const savedPercentage =
    items.length > 0 ? Math.round((savedItems.length / items.length) * 100) : 0;

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
          <Text className="text-2xl font-black text-light-text dark:text-dark-text text-right">
            إحصائيات التوفير
          </Text>
          <Text className="text-xs font-semibold text-light-muted dark:text-dark-muted text-right mt-1">
            ملخص الأموال وساعات العمل التي نجحت في حمايتها
          </Text>
        </View>

        <View className="flex-row-reverse gap-3 mb-3">
          <View className="flex-1 min-h-[150px] p-4 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border justify-between">
            <View className="flex-row-reverse items-center justify-between">
              <TrendingUp size={20} color="#10b981" />
              <Text className="flex-1 text-[11px] font-bold text-light-muted dark:text-dark-muted text-right mr-2">
                الأموال الموفرة
              </Text>
            </View>
            <View>
              <Text
                className="text-lg font-black text-emerald-700 dark:text-emerald-400 text-right"
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatNumber(savedAmount, 2)}
              </Text>
              <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-right mt-1">
                {currency}
              </Text>
            </View>
          </View>

          <View className="flex-1 min-h-[150px] p-4 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border justify-between">
            <View className="flex-row-reverse items-center justify-between">
              <Clock size={20} color="#3b82f6" />
              <Text className="flex-1 text-[11px] font-bold text-light-muted dark:text-dark-muted text-right mr-2">
                ساعات العمل المحمية
              </Text>
            </View>
            <View>
              <Text
                className="text-lg font-black text-blue-700 dark:text-blue-400 text-right"
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatNumber(protectedHours, 1)}
              </Text>
              <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-right mt-1">
                ساعة عمل
              </Text>
            </View>
          </View>
        </View>

        <View className="p-4 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border mb-7 flex-row-reverse items-center justify-between">
          <View className="flex-row-reverse items-center flex-1">
            <View className="w-11 h-11 rounded-xl bg-amber-500/10 items-center justify-center ml-3">
              <Award size={22} color="#f59e0b" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-light-text dark:text-dark-text text-right">
                مؤشر الوعي المالي
              </Text>
              <Text className="text-xs text-light-muted dark:text-dark-muted text-right mt-1">
                نسبة المنتجات التي تم توفيرها من قائمتك
              </Text>
            </View>
          </View>
          <Text className="text-2xl font-black text-amber-700 dark:text-amber-400 mr-3">
            {savedPercentage}%
          </Text>
        </View>

        <View className="flex-row-reverse items-center justify-between mb-3">
          <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 text-right">
            أبرز المنتجات التي وفرت قيمتها
          </Text>
          {savedItems.length > 0 && (
            <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {savedItems.length} منتجات
            </Text>
          )}
        </View>

        {savedItems.length === 0 ? (
          <View className="p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border items-center">
            <View className="w-12 h-12 rounded-full bg-emerald-500/10 items-center justify-center mb-3">
              <TrendingUp size={22} color="#10b981" />
            </View>
            <Text className="text-sm leading-6 font-semibold text-light-muted dark:text-dark-muted text-center">
              لم تقم بتوفير أي منتج حتى الآن، اتخذ قرارك الذكي القادم من الشاشة
              الرئيسية!
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
                      {formatNumber(hours, 1)} ساعة
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

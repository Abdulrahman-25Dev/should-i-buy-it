import { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  ArrowDownLeft,
  CheckCircle2,
  Clock3,
  ShoppingBag,
  X,
} from "lucide-react-native";
import { CostIndecator } from "../../components/CostIndecator";
import { TimeBreakdown } from "../../components/TimeBreakdown";
import { calculateTrueCost } from "../../lib/calculations";
import { getCurrencyLabel } from "../../lib/constants";
import { useIncomeStore } from "../../store/incomeStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useTranslation } from "react-i18next";
import i18n from "@/i18next/i18n";

const THINKING_PERIOD_MS = 24 * 60 * 60 * 1000;

function formatNumber(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function ItemDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const item = useWishlistStore((state) =>
    state.items.find((wishlistItem) => wishlistItem.id === id),
  );
  const togglePurchased = useWishlistStore((state) => state.togglePurchased);
  const setSaved = useWishlistStore((state) => state.setSaved);
  const { currency, hourlyRate, monthlyIncome, workHoursPerDay } =
    useIncomeStore();
  const [thinkingUntil, setThinkingUntil] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (thinkingUntil === null) return;

    const updateRemainingTime = () => {
      setRemainingTime(Math.max(0, thinkingUntil - Date.now()));
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [thinkingUntil]);

  const currentHourlyRate = hourlyRate > 0 ? hourlyRate : 50;
  const calculation = calculateTrueCost(item?.price ?? 0, currentHourlyRate);

  const handlePurchase = () => {
    if (!item) return;
    if (!item.isPurchased) togglePurchased(item.id);
    router.back();
  };

  const handleSaveMoney = () => {
    if (!item) return;
    setSaved(item.id, true);
    router.back();
  };

  const isArabic = i18n.language === "ar"; // Assuming you have a translation key for the current language
  const displayCurrency = getCurrencyLabel(currency, i18n.language);
  return (
    <SafeAreaView
      className="flex-1 bg-light-bg dark:bg-dark-bg"
      edges={["top", "left", "right", "bottom"]}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 mt-2 flex-row-reverse items-center justify-between border-b border-light-border pb-4 dark:border-dark-border">
          <Text className="text-lg font-black text-light-text dark:text-dark-text">
            {t("item.details")}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
            className="h-10 w-10 items-center justify-center rounded-xl border border-light-border bg-light-card dark:border-dark-border dark:bg-dark-card"
          >
            <X
              size={19}
              color={colorScheme === "dark" ? "#f8fafc" : "#0f172a"}
            />
          </TouchableOpacity>
        </View>

        {!item ? (
          <View className="items-center rounded-3xl border border-light-border bg-light-card px-6 py-10 dark:border-dark-border dark:bg-dark-card">
            <ShoppingBag size={28} color="#64748b" />
            <Text className="mt-4 text-base font-bold text-light-text dark:text-dark-text">
              {t("item.missing")}
            </Text>
            <Text className="mt-2 text-center text-sm text-light-muted dark:text-dark-muted">
              {t("item.missingMessage")}
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-3"
            >
              <Text className="font-bold text-white">
                {t("item.backToList")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View className="mb-4 rounded-3xl border border-light-border bg-light-card p-5 dark:border-dark-border dark:bg-dark-card">
              <View className="mb-5 h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 self-end">
                <ShoppingBag size={22} color="#10b981" />
              </View>
              <Text className="text-right text-2xl font-black text-light-text dark:text-dark-text">
                {item.title}
              </Text>
              <Text className="mt-2 text-right text-base font-semibold text-light-muted dark:text-dark-muted">
                {formatNumber(item.price)} {displayCurrency}
              </Text>
              <View className="my-5 items-center border-y border-light-border py-5 dark:border-dark-border">
                <Text className="text-xs font-semibold text-light-muted dark:text-dark-muted">
                  {t("item.workFor")}
                </Text>
                <View className="mt-1 flex-row items-baseline gap-2">
                  <Text className="text-5xl font-black text-light-text dark:text-dark-text">
                    {formatNumber(calculation.hours)}
                  </Text>
                  <Text className="text-sm font-bold text-light-muted dark:text-dark-muted">
                    {t("item.hours")}
                  </Text>
                </View>
              </View>
              <TimeBreakdown
                hours={calculation.hours}
                price={item.price}
                workHoursPerDay={workHoursPerDay}
                monthlyIncome={monthlyIncome}
                currency={displayCurrency}
              />
              <View className="mt-4">
                <CostIndecator hours={calculation.hours} />
              </View>
            </View>

            <View className="mb-4 rounded-2xl border border-light-border bg-light-card p-4 dark:border-dark-border dark:bg-dark-card">
              <View className="flex-row-reverse items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <Clock3 size={19} color="#2563eb" />
                </View>
                <View
                  className={`flex-1 ${isArabic ? "items-end" : "items-start"}`}
                >
                  <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                    {thinkingUntil === null
                      ? t("item.startThinking")
                      : remainingTime > 0
                        ? t("item.remainingThinking")
                        : t("item.thinkingEnded")}
                  </Text>
                  <Text className="mt-1 text-xs text-light-muted dark:text-dark-muted">
                    {thinkingUntil === null
                      ? t("item.wait24Hours")
                      : formatDuration(remainingTime)}
                  </Text>
                </View>
              </View>
              {thinkingUntil === null && (
                <TouchableOpacity
                  onPress={() =>
                    setThinkingUntil(Date.now() + THINKING_PERIOD_MS)
                  }
                  activeOpacity={0.8}
                  className="mt-4 flex-row-reverse items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 py-3"
                >
                  <Clock3 size={16} color="#2563eb" />
                  <Text className="text-sm font-bold text-blue-700 dark:text-blue-300">
                    {t("item.startPeriod")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {item.isPurchased && (
              <View className="mb-4 rounded-xl bg-emerald-500/10 px-4 py-3">
                <Text className="text-center text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {t("item.purchased")}
                </Text>
              </View>
            )}

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handlePurchase}
                activeOpacity={0.82}
                accessibilityRole="button"
                className="min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-3 py-3"
              >
                <CheckCircle2 size={18} color="#ffffff" />
                <Text className="text-sm font-bold text-white">
                  {t("item.buy")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveMoney}
                activeOpacity={0.82}
                accessibilityRole="button"
                className="min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-blue-700 px-3 py-3"
              >
                <ArrowDownLeft size={18} color="#ffffff" />
                <Text className="text-sm font-bold text-white">
                  {t("item.savePrice")}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

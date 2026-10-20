import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react-native";
import { useIncomeStore } from "../../store/incomeStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { WishListItem } from "../../components/WishListItem";
import { CalculatorCard } from "../../components/CalculatorCard";
import { EmptyState } from "../../components/EmptyState";
import { Button } from "../../components/ui/Button";
import I18n from "../../i18next/i18n";

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  const { hourlyRate, currency } = useIncomeStore();
  const { items } = useWishlistStore();
  const currentHourlyRate = hourlyRate > 0 ? hourlyRate : 50;

  const isArabic = I18n.language === "ar";

  return (
    <SafeAreaView
      className="flex-1 bg-light-bg dark:bg-dark-bg"
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className={`${isArabic ? "flex-row-reverse" : "flex-row"} items-center justify-between pt-4 pb-6 border-b border-light-border dark:border-dark-border mb-6`}>
          <View className="flex-1">
            <Text className={`text-xl font-black text-light-text dark:text-dark-text ${isArabic ? "text-right" : "text-left"}`}>
              {t("home.appName")}
            </Text>
            <Text className={`text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5 ${isArabic ? "text-right" : "text-left"}`}>
              {t("home.hourlyRate", { rate: currentHourlyRate, currency })}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/settings")}
            activeOpacity={0.7}
            className="p-2.5 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border"
          >
            <Settings size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <CalculatorCard />

        {/* Wishlist Header Section */}
        <View className={`${isArabic ? "flex-row-reverse" : "flex-row"} items-center justify-between mb-4`}>
          <Text className={`text-base font-bold text-light-text dark:text-dark-text ${isArabic ? "text-right" : "text-left"}`}>
            {t("home.recentItems")}
          </Text>

          <Button
            variant="outline"
            onPress={() => router.push("/wishlist")}
            className="min-h-0 rounded-lg px-3 py-1.5"
          >
            {t("home.viewAll")}
          </Button>
        </View>

        {/* Wishlist Items List */}
        {items.length === 0 ? (
          <EmptyState message={t("home.emptyMessage")} />
        ) : (
          items
            .slice(0, 3)
            .map((item) => <WishListItem key={item.id} item={item} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

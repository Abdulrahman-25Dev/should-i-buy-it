import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  Settings,
  CheckCircle2,
  XCircle,
  BookmarkPlus,
  Calendar,
  Percent,
  Clock,
} from "lucide-react-native";
import { useIncomeStore } from "../../store/incomeStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { calculateTrueCost } from "../../lib/calculations";
import { WishListItem } from "../../components/WishListItem";

export default function HomeScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const { hourlyRate, currency, workHoursPerDay, monthlyIncome } =
    useIncomeStore();
  const { items, addItem } = useWishlistStore();

  const [itemTitle, setItemTitle] = useState("");
  const [priceInput, setPriceInput] = useState("");

  const numericPrice = parseFloat(priceInput) || 0;
  const currentHourlyRate = hourlyRate > 0 ? hourlyRate : 50;
  const currentWorkHoursPerDay = workHoursPerDay > 0 ? workHoursPerDay : 8;

  const calculation = calculateTrueCost(numericPrice, currentHourlyRate);

  // 🧮 الحسابات الإضافية: الأيام والنسبة المئوية من الراتب
  const workDaysNeeded =
    calculation.hours > 0
      ? (calculation.hours / currentWorkHoursPerDay).toFixed(1)
      : "0";

  const percentOfIncome =
    monthlyIncome > 0 && numericPrice > 0
      ? Math.min((numericPrice / monthlyIncome) * 100, 100).toFixed(1)
      : "0";

  const handleSaveToWishlist = () => {
    if (numericPrice <= 0) return;
    const title = itemTitle.trim() || "منتج جديد";
    addItem(title, numericPrice, currentHourlyRate);
    setItemTitle("");
    setPriceInput("");
  };

  const getSeverityBadge = () => {
    if (calculation.severity === "high") {
      return {
        text: "🔴 تكلفة عالية — تستنزف أكثر من يومين عمل كاملة",
        bg: "bg-red-500/10 dark:bg-red-500/20",
        textColor: "text-red-500 dark:text-red-400",
      };
    } else if (calculation.severity === "medium") {
      return {
        text: "🟡 تكلفة متوسطة — تستنزف يوماً كاملاً تقريباً",
        bg: "bg-amber-500/10 dark:bg-amber-500/20",
        textColor: "text-amber-600 dark:text-amber-400",
      };
    }
    return {
      text: "🟢 تكلفة بسيطة — ضمن نطاق الميزانية المنخفضة",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
    };
  };

  const badge = getSeverityBadge();

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
        <View className="flex-row-reverse items-center justify-between pt-4 pb-6 border-b border-light-border dark:border-dark-border mb-6">
          <View className="flex-1">
            <Text className="text-xl font-black text-light-text dark:text-dark-text text-right">
              تستاهل؟
            </Text>
            <Text className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 text-right mt-0.5">
              أجرك: {currentHourlyRate} {currency} / ساعة
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

        {/* Calculator Hero Card */}
        <View className="p-6 rounded-3xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md mb-6">
          <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 text-right">
            اسم المنتج
          </Text>
          <TextInput
            value={itemTitle}
            onChangeText={setItemTitle}
            placeholder="مثلاً: آيفون 16"
            placeholderTextColor="#64748b"
            style={{ writingDirection: "rtl" }}
            className="p-4 rounded-2xl bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text mb-5 text-right text-sm border border-light-border dark:border-dark-border"
          />

          <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 text-right">
            سعر المنتج
          </Text>
          <View className="flex-row items-center justify-between mb-4 bg-light-input dark:bg-dark-input p-4 rounded-2xl border border-light-border dark:border-dark-border">
            <TextInput
              value={priceInput}
              onChangeText={setPriceInput}
              placeholder="0.00"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              className="text-2xl font-black text-light-text dark:text-dark-text flex-1 text-right"
            />
            <Text className="text-base font-bold text-light-muted dark:text-dark-muted mr-2">
              {currency}
            </Text>
          </View>

          {/* Real-time Calculation Result */}
          <View className="items-center justify-center py-5 border-t border-b border-light-border dark:border-dark-border my-2">
            <Text className="text-5xl font-black text-light-text dark:text-dark-text tracking-tight">
              {calculation.hours}
            </Text>
            <Text className="text-sm font-bold text-light-muted dark:text-dark-muted mt-1">
              ساعات عمل
            </Text>

            {/* 🌟 التفصيل الإضافي: أيام العمل والنسبة من الراتب 🌟 */}
            {numericPrice > 0 && (
              <View className="flex-row items-center justify-around w-full mt-5 pt-4 border-t border-light-border dark:border-dark-border">
                {/* أيام العمل */}
                <View className="items-center flex-1">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Calendar size={14} color="#3b82f6" />
                    <Text className="text-xs text-light-muted dark:text-dark-muted font-semibold">
                      أيام دوام
                    </Text>
                  </View>
                  <Text className="text-lg font-black text-blue-700 dark:text-blue-400">
                    {workDaysNeeded} يوم
                  </Text>
                </View>

                {/* فاصل عمودي */}
                <View className="h-8 w-[1px] bg-light-border dark:bg-dark-border" />

                {/* نسبة الاستنزاف من الراتب */}
                <View className="items-center flex-1">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Percent size={14} color="#f59e0b" />
                    <Text className="text-xs text-light-muted dark:text-dark-muted font-semibold">
                      من الراتب
                    </Text>
                  </View>
                  <Text className="text-lg font-black text-amber-700 dark:text-amber-400">
                    {percentOfIncome}%
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Severity Indicator Badge */}
          {numericPrice > 0 && (
            <View className={`p-3.5 rounded-xl ${badge.bg} my-3`}>
              <Text
                className={`text-xs font-bold text-center ${badge.textColor}`}
              >
                {badge.text}
              </Text>
            </View>
          )}

          {/* Decision Buttons */}
          {numericPrice > 0 && (
            <View className="flex-row gap-3 mt-3">
              <TouchableOpacity
                onPress={handleSaveToWishlist}
                activeOpacity={0.8}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 flex-row items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 size={18} color="#ffffff" />
                <Text className="text-white font-bold text-sm">تستاهل!</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setPriceInput("");
                  setItemTitle("");
                }}
                activeOpacity={0.8}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-rose-600 flex-row items-center justify-center gap-2 shadow-sm"
              >
                <XCircle size={18} color="#ffffff" />
                <Text className="text-white font-bold text-sm">وفر فلوسك!</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Save Shortcut */}
          {numericPrice > 0 && (
            <TouchableOpacity
              onPress={handleSaveToWishlist}
              className="mt-3 py-2.5 flex-row items-center justify-center gap-1.5"
            >
              <BookmarkPlus size={16} color="#94a3b8" />
              <Text className="text-xs font-semibold text-light-muted dark:text-dark-muted">
                أضف لقائمة التفكير والمقارنة لاحقاً
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Wishlist Header Section */}
        <View className="flex-row-reverse items-center justify-between mb-4">
          <Text className="text-base font-bold text-light-text dark:text-dark-text">
            آخر ما فكرت بشرائه
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            className="px-3 py-1.5 rounded-lg bg-light-input dark:bg-dark-input border border-light-border dark:border-dark-border"
          >
            <Text className="text-xs font-semibold text-light-muted dark:text-dark-muted">
              عرض الكل
            </Text>
          </TouchableOpacity>
        </View>

        {/* Wishlist Items List */}
        {items.length === 0 ? (
          <View className="p-8 rounded-2xl bg-light-card dark:bg-dark-card border border-dashed border-light-border dark:border-dark-border items-center justify-center">
            <Text className="text-xs font-semibold text-slate-500">
              لم تقم بإضافة أي منتج للقائمة حتى الآن.
            </Text>
          </View>
        ) : (
          items
            .slice(0, 3)
            .map((item) => <WishListItem key={item.id} item={item} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

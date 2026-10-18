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
import {
  Settings,
  CheckCircle2,
  XCircle,
  BookmarkPlus,
} from "lucide-react-native";
import { useIncomeStore } from "../../store/incomeStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { calculateTrueCost } from "../../lib/calculations";
import { WishListItem } from "../../components/WishListItem";

export default function HomeScreen() {
  const router = useRouter();

  const { hourlyRate, currency } = useIncomeStore();
  const { items, addItem } = useWishlistStore();

  const [itemTitle, setItemTitle] = useState("");
  const [priceInput, setPriceInput] = useState("");

  const numericPrice = parseFloat(priceInput) || 0;
  const currentHourlyRate = hourlyRate > 0 ? hourlyRate : 50;

  const calculation = calculateTrueCost(numericPrice, currentHourlyRate);

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
      className="flex-1 bg-dark-bg"
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="flex-row-reverse items-center justify-between pt-4 pb-6 border-b border-slate-800/60 mb-6">
          <View className="flex-1">
            <Text className="text-xl font-black text-white text-right">
              تستاهل؟
            </Text>
            <Text className="text-xs font-semibold text-emerald-400 text-right mt-0.5">
              أجرك: {currentHourlyRate} {currency} / ساعة
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/settings")}
            activeOpacity={0.7}
            className="p-2.5 rounded-2xl bg-dark-card border border-dark-border"
          >
            <Settings size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Calculator Hero Card */}
        <View className="p-6 rounded-3xl bg-dark-card border border-dark-border shadow-md mb-6">
          <Text className="text-sm font-bold text-slate-300 mb-2 text-right">
            اسم المنتج
          </Text>
          <TextInput
            value={itemTitle}
            onChangeText={setItemTitle}
            placeholder="مثلاً: آيفون 16"
            placeholderTextColor="#64748b"
            style={{ writingDirection: "rtl" }}
            className="p-4 rounded-2xl bg-slate-800/40 text-white mb-5 text-right text-sm border border-slate-700/70"
          />

          <Text className="text-sm font-bold text-slate-300 mb-2 text-right">
            سعر المنتج
          </Text>
          <View className="flex-row items-center justify-between mb-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
            <TextInput
              value={priceInput}
              onChangeText={setPriceInput}
              placeholder="0.00"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              className="text-2xl font-black text-white flex-1 text-right"
            />
            <Text className="text-base font-bold text-slate-400 mr-2">
              {currency}
            </Text>
          </View>

          {/* Real-time Calculation Result */}
          <View className="items-center justify-center py-6 border-t border-b border-dark-border my-2">
            <Text className="text-5xl font-black text-white tracking-tight">
              {calculation.hours}
            </Text>
            <Text className="text-sm font-bold text-slate-400 mt-1">
              ساعات عمل
            </Text>
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

          {/* Save Shortcut */}
          {numericPrice > 0 && (
            <TouchableOpacity
              onPress={handleSaveToWishlist}
              className="mt-3 py-2.5 flex-row items-center justify-center gap-1.5"
            >
              <BookmarkPlus size={16} color="#94a3b8" />
              <Text className="text-xs font-semibold text-slate-400">
                أضف لقائمة التفكير والمقارنة لاحقاً
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Wishlist Header Section */}
        <View className="flex-row-reverse items-center justify-between mb-4">
          <Text className="text-base font-bold text-white">
            آخر ما فكرت بشراؤه
          </Text>
          <TouchableOpacity
            // onPress={() => router.push('')}
            activeOpacity={0.7}
            className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700"
          >
            <Text className="text-xs font-semibold text-slate-400">
              عرض الكل
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🔻 هنا تم وضع الكود بالضبط 🔻 */}
        {items.length === 0 ? (
          <View className="p-8 rounded-2xl bg-dark-card border border-dashed border-slate-700 items-center justify-center">
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

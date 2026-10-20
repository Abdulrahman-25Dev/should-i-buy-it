import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Trash2, CheckCircle2, Clock } from "lucide-react-native";
import {
  useWishlistStore,
  WishlistItem as WishlistItemType,
} from "../store/wishlistStore";
import { useIncomeStore } from "../store/incomeStore";
import { calculateTrueCost } from "../lib/calculations";
import { useTranslation } from "react-i18next";

interface WishListItemProps {
  item: WishlistItemType;
}

export const WishListItem: React.FC<WishListItemProps> = ({ item }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { removeItem, togglePurchased } = useWishlistStore();
  const { currency, hourlyRate } = useIncomeStore();
  const currentHourlyRate = hourlyRate > 0 ? hourlyRate : 50;
  const hoursNeeded = calculateTrueCost(item.price, currentHourlyRate).hours;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/item/${item.id}`)}
      activeOpacity={0.7}
      className="p-4 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border mb-3 flex-row-reverse items-center justify-between shadow-sm"
    >
      {/* جهة العنوان والسعر (اليمين) */}
      <View className="flex-1 pl-3">
        <View className="flex-row-reverse items-center gap-2 mb-1 justify-start">
          <Text
            className={`text-base font-bold text-right ${
              item.isPurchased
                ? "line-through text-slate-500"
                : "text-light-text dark:text-dark-text"
            }`}
          >
            {item.title}
          </Text>
          {item.isPurchased && (
            <View className="px-2 py-0.5 rounded-md bg-emerald-500/10">
              <Text className="text-[10px] font-bold text-emerald-500">
                {t("wishlist.purchasedLabel")}
              </Text>
            </View>
          )}
        </View>

        <Text className="text-xs font-semibold text-light-muted dark:text-dark-muted text-right">
          {item.price} {currency}
        </Text>
      </View>

      {/* جهة الساعات والأزرار (اليسار) */}
      <View className="items-end gap-2">
        <View className="flex-row items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
          <Clock size={12} color="#10b981" />
          <Text className="text-xs font-black text-emerald-400">
            ~ {hoursNeeded} {t("common.hours")}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          {/* زر الشراء */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // منع الانتقال لصفحة التفاصيل عند الضغط على الزر
              togglePurchased(item.id);
            }}
            activeOpacity={0.7}
            className="p-2 rounded-xl bg-light-input dark:bg-dark-input border border-light-border dark:border-dark-border"
          >
            <CheckCircle2
              size={16}
              color={item.isPurchased ? "#10b981" : "#94a3b8"}
            />
          </TouchableOpacity>

          {/* زر الحذف */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // منع الانتقال لصفحة التفاصيل عند الضغط على الزر
              removeItem(item.id);
            }}
            activeOpacity={0.7}
            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20"
          >
            <Trash2 size={16} color="#f43f5e" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

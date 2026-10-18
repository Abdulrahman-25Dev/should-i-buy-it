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

interface WishListItemProps {
  item: WishlistItemType;
}

export const WishListItem: React.FC<WishListItemProps> = ({ item }) => {
  const router = useRouter();
  const { removeItem, togglePurchased } = useWishlistStore();
  const { currency, hourlyRate } = useIncomeStore();
  const currentHourlyRate = hourlyRate > 0 ? hourlyRate : 50;
  const hoursNeeded = calculateTrueCost(item.price, currentHourlyRate).hours;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/item/${item.id}`)}
      activeOpacity={0.7}
      className="p-4 rounded-2xl bg-dark-card border border-dark-border mb-3 flex-row items-center justify-between shadow-sm"
    >
      <View className="flex-1 pr-3">
        <View className="flex-row items-center gap-2 mb-1 justify-end">
          {item.isPurchased && (
            <View className="px-2 py-0.5 rounded-md bg-emerald-500/10">
              <Text className="text-[10px] font-bold text-emerald-500">
                تم الشراء
              </Text>
            </View>
          )}
          <Text
            className={`text-base font-bold text-right ${
              item.isPurchased ? "line-through text-slate-500" : "text-white"
            }`}
          >
            {item.title}
          </Text>
        </View>

        <Text className="text-xs font-semibold text-slate-400 text-right">
          {item.price} {currency}
        </Text>
      </View>

      <View className="items-end gap-2">
        <View className="flex-row items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
          <Clock size={12} color="#10b981" />
          <Text className="text-xs font-black text-emerald-400">
            ~ {hoursNeeded} ساعة
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => togglePurchased(item.id)}
            className="p-1.5 rounded-lg bg-slate-800"
          >
            <CheckCircle2
              size={16}
              color={item.isPurchased ? "#10b981" : "#94a3b8"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => removeItem(item.id)}
            className="p-1.5 rounded-lg bg-rose-500/20"
          >
            <Trash2 size={16} color="#f43f5e" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

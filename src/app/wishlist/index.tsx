import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  ShoppingBag,
} from "lucide-react-native";
import { EmptyState } from "../../components/EmptyState";
import { WishListItem } from "../../components/WishListItem";
import { useWishlistStore } from "../../store/wishlistStore";

type WishlistFilter = "all" | "thinking" | "purchased";

const FILTERS: { id: WishlistFilter; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "thinking", label: "قيد التفكير" },
  { id: "purchased", label: "تم شراؤها" },
];

export default function WishlistScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const items = useWishlistStore((state) => state.items);
  const [filter, setFilter] = useState<WishlistFilter>("all");

  const counts = {
    all: items.length,
    thinking: items.filter((item) => !item.isPurchased).length,
    purchased: items.filter((item) => item.isPurchased).length,
  };
  const filteredItems = items.filter((item) => {
    if (filter === "thinking") return !item.isPurchased;
    if (filter === "purchased") return Boolean(item.isPurchased);
    return true;
  });

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
        <View className="mb-6 flex-row-reverse items-center justify-between border-b border-light-border pb-5 pt-4 dark:border-dark-border">
          <View className="flex-1 items-end">
            <Text className="text-xl font-black text-light-text dark:text-dark-text">
              قائمة الأمنيات
            </Text>
            <Text className="mt-1 text-xs font-medium text-light-muted dark:text-dark-muted">
              راجع مشترياتك وخذ وقتك قبل القرار
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="العودة"
            className="ml-3 h-10 w-10 items-center justify-center rounded-xl border border-light-border bg-light-card dark:border-dark-border dark:bg-dark-card"
          >
            <ArrowLeft
              size={19}
              color={colorScheme === "dark" ? "#f8fafc" : "#0f172a"}
            />
          </TouchableOpacity>
        </View>

        <View className="mb-5 flex-row-reverse rounded-2xl border border-light-border bg-light-card p-1 dark:border-dark-border dark:bg-dark-card">
          {FILTERS.map((option) => {
            const isActive = filter === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => setFilter(option.id)}
                activeOpacity={0.75}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                className={`min-h-10 flex-1 flex-row items-center justify-center gap-1 rounded-xl px-2 py-2 ${isActive ? "bg-emerald-600" : "bg-transparent"}`}
              >
                {option.id === "all" ? (
                  <Bookmark
                    size={14}
                    color={
                      isActive
                        ? "#ffffff"
                        : colorScheme === "dark"
                          ? "#94a3b8"
                          : "#64748b"
                    }
                  />
                ) : option.id === "thinking" ? (
                  <ShoppingBag
                    size={14}
                    color={
                      isActive
                        ? "#ffffff"
                        : colorScheme === "dark"
                          ? "#94a3b8"
                          : "#64748b"
                    }
                  />
                ) : (
                  <Check
                    size={14}
                    color={
                      isActive
                        ? "#ffffff"
                        : colorScheme === "dark"
                          ? "#94a3b8"
                          : "#64748b"
                    }
                  />
                )}
                <Text
                  className={`text-[11px] font-bold ${isActive ? "text-white" : "text-light-muted dark:text-dark-muted"}`}
                  numberOfLines={1}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredItems.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={22} color="#10b981" />}
            title={
              items.length === 0 ? "قائمتك ما زالت فارغة" : "لا توجد منتجات هنا"
            }
            message={
              items.length === 0
                ? "أضف ما تفكر بشرائه، وقارن سعره بوقتك قبل أن تقرر."
                : filter === "thinking"
                  ? "كل المنتجات في قائمتك تم شراؤها. خذ لحظة لتقدير قراراتك."
                  : "لم تسجل أي منتج كمشتَرى بعد."
            }
          />
        ) : (
          <View>
            <View className="mb-3 flex-row-reverse items-center justify-between">
              <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                {filter === "all"
                  ? "كل المنتجات"
                  : FILTERS.find((entry) => entry.id === filter)?.label}
              </Text>
              <Text className="text-xs font-semibold text-light-muted dark:text-dark-muted">
                {filteredItems.length} منتج
              </Text>
            </View>
            {filteredItems.map((item) => (
              <WishListItem key={item.id} item={item} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

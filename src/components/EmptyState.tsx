import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { ShoppingBag } from "lucide-react-native";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
}

export function EmptyState({ title, message, icon }: EmptyStateProps) {
  const { t } = useTranslation();
  return (
    <View className="items-center justify-center rounded-2xl border border-dashed border-light-border bg-light-card px-6 py-8 dark:border-dark-border dark:bg-dark-card">
      <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
        {icon ?? <ShoppingBag size={22} color="#10b981" />}
      </View>
      <Text className="text-center text-sm font-bold text-light-text dark:text-dark-text">
        {title ?? t("common.emptyTitle")}
      </Text>
      <Text className="mt-1 max-w-64 text-center text-xs leading-5 text-light-muted dark:text-dark-muted">
        {message}
      </Text>
    </View>
  );
}

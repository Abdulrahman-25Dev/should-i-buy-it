import { CalendarDays, Wallet } from "lucide-react-native";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

interface TimeBreakdownProps {
  hours: number;
  price: number;
  workHoursPerDay: number;
  monthlyIncome: number;
  currency: string;
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

export function TimeBreakdown({
  hours,
  price,
  workHoursPerDay,
  monthlyIncome,
  currency,
}: TimeBreakdownProps) {
  const { t } = useTranslation();
  const safeWorkHours = workHoursPerDay > 0 ? workHoursPerDay : 8;
  const days = hours / safeWorkHours;
  const incomePercentage =
    monthlyIncome > 0 ? Math.min((price / monthlyIncome) * 100, 100) : 0;

  return (
    <View className="flex-row-reverse gap-3">
      <View className="min-h-24 min-w-0 flex-1 items-end justify-between rounded-2xl border border-light-border bg-light-input p-2.5 dark:border-dark-border dark:bg-dark-input">
        <View className="w-full flex-row-reverse items-start gap-1.5">
          <CalendarDays size={16} color="#2563eb" />
          <Text className="flex-1 text-right text-[11px] leading-4 font-semibold text-light-muted dark:text-dark-muted">
            {t("time.workDays")}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          className="w-full text-right text-sm font-black text-blue-700 dark:text-blue-400"
        >
          {formatNumber(days)} {t("common.day")}
        </Text>
      </View>
      <View className="min-h-24 min-w-0 flex-1 items-end justify-between rounded-2xl border border-light-border bg-light-input p-2.5 dark:border-dark-border dark:bg-dark-input">
        <View className="w-full flex-row-reverse items-start gap-1.5">
          <Wallet size={16} color="#d97706" />
          <Text className="flex-1 text-right text-[11px] leading-4 font-semibold text-light-muted dark:text-dark-muted">
            {t("time.monthlySalary")}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          className="w-full text-right text-sm font-black text-amber-700 dark:text-amber-400"
        >
          {monthlyIncome > 0
            ? `${formatNumber(incomePercentage)}%`
            : t("time.unspecified")}
        </Text>
      </View>
    </View>
  );
}

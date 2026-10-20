import { AlertTriangle, CircleCheck, TrendingUp } from "lucide-react-native";
import { Text, View } from "react-native";

interface CostIndecatorProps {
  hours: number;
}

export function CostIndecator({ hours }: CostIndecatorProps) {
  const level = hours >= 16 ? "high" : hours >= 8 ? "medium" : "low";
  const content = {
    high: {
      label: "تكلفة عالية",
      detail: "تحتاج أكثر من يومي عمل",
      color: "#e11d48",
      container: "border-rose-500/20 bg-rose-500/10",
      text: "text-rose-700 dark:text-rose-300",
      Icon: AlertTriangle,
    },
    medium: {
      label: "تكلفة متوسطة",
      detail: "تحتاج قرابة يوم عمل",
      color: "#d97706",
      container: "border-amber-500/20 bg-amber-500/10",
      text: "text-amber-700 dark:text-amber-300",
      Icon: TrendingUp,
    },
    low: {
      label: "تكلفة بسيطة",
      detail: "تأثيرها محدود على وقتك",
      color: "#059669",
      container: "border-emerald-500/20 bg-emerald-500/10",
      text: "text-emerald-700 dark:text-emerald-300",
      Icon: CircleCheck,
    },
  }[level];
  const { Icon } = content;

  return (
    <View
      accessibilityRole="summary"
      className={`flex-row-reverse items-center gap-3 rounded-2xl border px-4 py-3 ${content.container}`}
    >
      <Icon size={20} color={content.color} />
      <View className="flex-1 items-end">
        <Text className={`text-sm font-extrabold ${content.text}`}>
          {content.label}
        </Text>
        <Text
          className={`mt-0.5 text-xs font-medium opacity-80 ${content.text}`}
        >
          {content.detail}
        </Text>
      </View>
    </View>
  );
}

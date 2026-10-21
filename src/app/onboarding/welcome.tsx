import { router } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { useSettingsStore } from "../../store/settingsStore";

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const language = useSettingsStore((state) => state.language);
  const isArabic = language === "ar";
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <SafeAreaView
      className="flex-1 bg-light-bg dark:bg-dark-bg"
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          paddingHorizontal: 24,
          paddingVertical: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className={`flex-row items-center ${isArabic ? "justify-end" : "justify-start"}`}
        >
          <View className="flex-row items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <Sparkles size={15} color="#059669" />
            <Text className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {t("onboarding.welcome.badge")}
            </Text>
          </View>
        </View>

        <View className="items-center py-10">
          <View className="mb-8 h-44 w-44 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <View className="h-28 w-28 items-center justify-center rounded-full bg-emerald-600 shadow-lg shadow-emerald-900/20">
              <Clock size={52} color="#ffffff" strokeWidth={1.7} />
            </View>
            <View className="absolute bottom-2 right-0 rounded-full border-4 border-light-bg bg-amber-400 p-3 dark:border-dark-bg">
              <Sparkles size={20} color="#422006" />
            </View>
          </View>
          <Text
            className={`mb-4 text-3xl font-black leading-[42px] text-light-text dark:text-dark-text ${isArabic ? "text-center" : "text-center"}`}
          >
            {t("onboarding.welcome.title")}
          </Text>
          <Text
            className={`max-w-sm text-base font-medium leading-7 text-light-muted dark:text-dark-muted ${isArabic ? "text-center" : "text-center"}`}
          >
            {t("onboarding.welcome.description")}
          </Text>
        </View>

        <View>
          <View className="mb-6 border-y border-light-border py-4 dark:border-dark-border">
            <Text
              className={`text-sm font-bold text-light-text dark:text-dark-text ${isArabic ? "text-center" : "text-center"}`}
            >
              {t("onboarding.welcome.insightTitle")}
            </Text>
            <Text
              className={`mt-1 text-xs leading-5 text-light-muted dark:text-dark-muted ${isArabic ? "text-center" : "text-center"}`}
            >
              {t("onboarding.welcome.insightDescription")}
            </Text>
          </View>
          <Button
            onPress={() => router.push("/onboarding/method")}
            className="min-h-14 rounded-2xl"
            contentClassName="flex-row-reverse"
          >
            {isArabic ? (
              <ChevronRight size={20} color="#ffffff" />
            ) : (
              <ChevronLeft size={20} color="#ffffff" />
            )}
            <Text className="text-base font-bold text-white">
              {t("onboarding.welcome.start")}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

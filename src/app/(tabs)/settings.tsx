import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import {
  DollarSign,
  Calendar,
  Clock,
  Moon,
  Trash2,
  ChevronLeft,
  Coins,
  Languages,
} from "lucide-react-native";
import { useIncomeStore } from "../../store/incomeStore";
import { useCustomAlert } from "../../components/CustomAlert";

export default function SettingsScreen() {
  const { showAlert } = useCustomAlert();
  const {
    monthlyIncome,
    workHoursPerDay,
    workDaysPerWeek,
    currency,
    setMonthlyIncome,
  } = useIncomeStore();

  const { colorScheme, setColorScheme } = useColorScheme();
  const [currentLanguage, setCurrentLanguage] = useState("ar");

  // حساب أجر الساعة الحقيقي
  const calculatedHourlyRate = () => {
    const income = monthlyIncome || 0;
    const hours = workHoursPerDay || 8;
    const days = workDaysPerWeek || 5;
    if (income <= 0 || hours <= 0 || days <= 0) return 0;
    const monthlyHours = hours * days * 4.33;
    return Math.round((income / monthlyHours) * 100) / 100;
  };

  const handleResetData = () => {
    showAlert(
      "تصفير البيانات",
      "هل أنت متأكد من مسح كافة الإعدادات والبيانات المحلية؟",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "موافق",
          style: "destructive",
          onPress: () => {
            setMonthlyIncome(0);
            showAlert("تم", "تمت استعادة الإعدادات الافتراضية.");
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-light-bg dark:bg-dark-bg"
      edges={["top", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="pt-4 pb-6 border-b border-light-border dark:border-dark-border mb-6">
          <Text className="text-2xl font-black text-light-text dark:text-dark-text text-right">
            الإعدادات والتفضيلات
          </Text>
          <Text className="text-xs font-semibold text-light-muted dark:text-dark-muted text-right mt-1">
            إدارة تفضيلات التطبيق، الحساب المالي، وساعات العمل
          </Text>
        </View>

        {/* Calculated Hourly Rate Preview Card */}
        <View className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 mb-6 items-center justify-center shadow-md">
          <Text className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
            أجرك الحقيقي المحسوب
          </Text>
          <Text className="text-4xl font-black text-emerald-700 dark:text-emerald-400">
            {calculatedHourlyRate()} {currency}
          </Text>
          <Text className="text-xs text-light-muted dark:text-dark-muted mt-1">
            لكل ساعة عمل
          </Text>
        </View>

        {/* Section 1: App Preferences */}
        <Text className="text-sm font-bold text-light-muted dark:text-dark-muted mb-3 text-right">
          تفضيلات التطبيق
        </Text>

        <View className="p-4 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border mb-6 gap-4">
          {/* Dark Mode Toggle */}
          <View className="flex-row items-center justify-between pb-3 border-b border-light-border dark:border-dark-border">
            <Switch
              value={colorScheme === "dark"}
              onValueChange={(isDarkMode) =>
                setColorScheme(isDarkMode ? "dark" : "light")
              }
              trackColor={{ false: "#cbd5e1", true: "#10b981" }}
              thumbColor={"#ffffff"}
            />
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                الوضع الداكن
              </Text>
              <Moon size={18} color="#f59e0b" />
            </View>
          </View>

          {/* Language Selection */}
          <View className="flex-row items-center justify-between pt-1">
            <View className="flex-row gap-2">
              {["ar", "en"].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => setCurrentLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg border ${
                    currentLanguage === lang
                      ? "bg-emerald-600 border-emerald-500"
                      : "bg-light-input dark:bg-dark-input border-light-border dark:border-dark-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold uppercase ${
                      currentLanguage === lang
                        ? "text-white"
                        : "text-light-muted dark:text-dark-muted"
                    }`}
                  >
                    {lang === "ar" ? "العربية" : "English"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                لغة التطبيق
              </Text>
              <Languages size={18} color="#3b82f6" />
            </View>
          </View>
        </View>

        {/* Section 1: Financial Profile Cards (Prepped for BottomSheet) */}
        <Text className="text-sm font-bold text-light-muted dark:text-dark-muted mb-3 text-right">
          البيانات الشخصية والمالية
        </Text>

        <View className="mb-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border overflow-hidden">
          {/* الدخل الشهري الصافي */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              showAlert(
                "تنبيه",
                "سيتم تفعيل تعديل القيم عبر الـ BottomSheet قريباً.",
              )
            }
            className="p-4 flex-row items-center justify-between border-b border-light-border dark:border-dark-border"
          >
            <ChevronLeft size={18} color="#64748b" />
            <View className="items-end flex-1 pr-3">
              <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                الدخل الشهري الصافي
              </Text>
              <Text className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                {monthlyIncome || 0} {currency}
              </Text>
            </View>
            <View className="p-2.5 rounded-xl bg-emerald-500/10">
              <DollarSign size={18} color="#10b981" />
            </View>
          </TouchableOpacity>

          {/* ساعات العمل اليومية */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              showAlert(
                "تنبيه",
                "سيتم تفعيل تعديل القيم عبر الـ BottomSheet قريباً.",
              )
            }
            className="p-4 flex-row items-center justify-between border-b border-light-border dark:border-dark-border"
          >
            <ChevronLeft size={18} color="#64748b" />
            <View className="items-end flex-1 pr-3">
              <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                ساعات العمل اليومية
              </Text>
              <Text className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                {workHoursPerDay || 8} ساعات/يوم
              </Text>
            </View>
            <View className="p-2.5 rounded-xl bg-amber-500/10">
              <Clock size={18} color="#f59e0b" />
            </View>
          </TouchableOpacity>

          {/* أيام العمل في الأسبوع */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              showAlert(
                "تنبيه",
                "سيتم تفعيل تعديل القيم عبر الـ BottomSheet قريباً.",
              )
            }
            className="p-4 flex-row items-center justify-between border-b border-light-border dark:border-dark-border"
          >
            <ChevronLeft size={18} color="#64748b" />
            <View className="items-end flex-1 pr-3">
              <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                أيام العمل في الأسبوع
              </Text>
              <Text className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                {workDaysPerWeek || 5} أيام/أسبوع
              </Text>
            </View>
            <View className="p-2.5 rounded-xl bg-blue-500/10">
              <Calendar size={18} color="#3b82f6" />
            </View>
          </TouchableOpacity>

          {/* العملة المفضلة */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              showAlert(
                "تنبيه",
                "سيتم تفعيل تعديل القيم عبر الـ BottomSheet قريباً.",
              )
            }
            className="p-4 flex-row items-center justify-between"
          >
            <ChevronLeft size={18} color="#64748b" />
            <View className="items-end flex-1 pr-3">
              <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                العملة المفضلة
              </Text>
              <Text className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                {currency}
              </Text>
            </View>
            <View className="p-2.5 rounded-xl bg-purple-500/10">
              <Coins size={18} color="#a855f7" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Danger Zone: Reset Data */}
        <TouchableOpacity
          onPress={handleResetData}
          activeOpacity={0.8}
          className="py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex-row items-center justify-center gap-2 mb-6"
        >
          <Trash2 size={16} color="#f43f5e" />
          <Text className="text-rose-500 font-bold text-xs">
            إعادة ضبط المصنع وتصفير البيانات
          </Text>
        </TouchableOpacity>

        {/* App Info Footer */}
        <View className="items-center justify-center pt-2">
          <Text className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            تستاهل؟ — الإصدار 1.0.0 (Local-First Fintech)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

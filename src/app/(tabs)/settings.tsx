import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Save,
  DollarSign,
  Calendar,
  Clock,
  Check,
  Moon,
  Globe,
  Trash2,
  Info,
} from 'lucide-react-native';
import { useIncomeStore } from '../../store/incomeStore';

export default function SettingsScreen() {
  const {
    monthlyIncome,
    workHoursPerDay,
    workDaysPerWeek,
    currency,
    setMonthlyIncome,
    setWorkHoursPerDay,
    setWorkDaysPerWeek,
    setCurrency,
  } = useIncomeStore();

  const [incomeInput, setIncomeInput] = useState(monthlyIncome ? monthlyIncome.toString() : '');
  const [hoursInput, setHoursInput] = useState(workHoursPerDay ? workHoursPerDay.toString() : '8');
  const [daysInput, setDaysInput] = useState(workDaysPerWeek ? workDaysPerWeek.toString() : '5');
  const [selectedCurrency, setSelectedCurrency] = useState(currency || 'SAR');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('ar');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const calculatedHourlyRate = () => {
    const income = parseFloat(incomeInput) || 0;
    const hours = parseFloat(hoursInput) || 1;
    const days = parseFloat(daysInput) || 1;
    if (income <= 0 || hours <= 0 || days <= 0) return 0;
    const monthlyHours = hours * days * 4.33;
    return Math.round((income / monthlyHours) * 100) / 100;
  };

  const handleSave = () => {
    const income = parseFloat(incomeInput) || 0;
    const hours = parseFloat(hoursInput) || 8;
    const days = parseFloat(daysInput) || 5;

    if (income <= 0) {
      Alert.alert('تنبيه', 'يرجى إدخال دخل شهري صحيح.');
      return;
    }

    setWorkHoursPerDay(hours);
    setWorkDaysPerWeek(days);
    setMonthlyIncome(income);
    setCurrency(selectedCurrency);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetData = () => {
    Alert.alert(
      'تصفير البيانات',
      'هل أنت متأكد من مسح كافة الإعدادات والبيانات المحلية؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'موافق',
          style: 'destructive',
          onPress: () => {
            setMonthlyIncome(0);
            setIncomeInput('');
            Alert.alert('تم', 'تمت استعادة الإعدادات الافتراضية.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="pt-4 pb-6 border-b border-slate-800/60 mb-6">
          <Text className="text-2xl font-black text-white text-right">
            الإعدادات والتفضيلات
          </Text>
          <Text className="text-xs font-semibold text-slate-400 text-right mt-1">
            إدارة تفضيلات التطبيق، الحساب المالي، وساعات العمل
          </Text>
        </View>

        {/* Section 1: App Preferences (Moved to top) */}
        <Text className="text-sm font-bold text-slate-400 mb-3 text-right">
          تفضيلات التطبيق
        </Text>

        <View className="p-4 rounded-2xl bg-dark-card border border-dark-border mb-6 space-y-4">
          {/* Dark Mode Toggle */}
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-800">
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#334155', true: '#10b981' }}
              thumbColor={'#ffffff'}
            />
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-bold text-white">الوضع الداكن</Text>
              <Moon size={18} color="#f59e0b" />
            </View>
          </View>

          {/* Language Selection */}
          <View className="flex-row items-center justify-between pt-1">
            <View className="flex-row gap-2">
              {['ar', 'en'].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => setCurrentLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg border ${
                    currentLanguage === lang
                      ? 'bg-emerald-600 border-emerald-500'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold uppercase ${
                      currentLanguage === lang ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {lang === 'ar' ? 'العربية' : 'English'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-bold text-white">لغة التطبيق</Text>
              <Globe size={18} color="#3b82f6" />
            </View>
          </View>
        </View>

        {/* Calculated Hourly Rate Preview Card */}
        <View className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 mb-6 items-center justify-center">
          <Text className="text-xs font-bold text-emerald-400 mb-1">
            أجرك الحقيقي المحسوب
          </Text>
          <Text className="text-4xl font-black text-emerald-400">
            {calculatedHourlyRate()} {selectedCurrency}
          </Text>
          <Text className="text-xs text-slate-400 mt-1">لكل ساعة عمل</Text>
        </View>

        {/* Section 2: Financial Profile */}
        <Text className="text-sm font-bold text-slate-400 mb-3 text-right">
          الملف المالي وساعات العمل
        </Text>

        <View className="space-y-4 mb-6">
          <View className="p-4 rounded-2xl bg-dark-card border border-dark-border mb-3">
            <View className="flex-row items-center gap-2 mb-2 justify-end">
              <Text className="text-sm font-bold text-white">الدخل الشهري الصافي</Text>
              <DollarSign size={18} color="#10b981" />
            </View>
            <TextInput
              value={incomeInput}
              onChangeText={setIncomeInput}
              placeholder="مثال: 10000"
              placeholderTextColor="#475569"
              keyboardType="numeric"
              className="p-3 rounded-xl bg-slate-800/80 text-white font-bold text-right text-lg border border-slate-700"
            />
          </View>

          <View className="p-4 rounded-2xl bg-dark-card border border-dark-border mb-3">
            <View className="flex-row items-center gap-2 mb-2 justify-end">
              <Text className="text-sm font-bold text-white">ساعات العمل اليومية</Text>
              <Clock size={18} color="#f59e0b" />
            </View>
            <TextInput
              value={hoursInput}
              onChangeText={setHoursInput}
              placeholder="مثال: 8"
              placeholderTextColor="#475569"
              keyboardType="numeric"
              className="p-3 rounded-xl bg-slate-800/80 text-white font-bold text-right text-lg border border-slate-700"
            />
          </View>

          <View className="p-4 rounded-2xl bg-dark-card border border-dark-border mb-3">
            <View className="flex-row items-center gap-2 mb-2 justify-end">
              <Text className="text-sm font-bold text-white">أيام العمل في الأسبوع</Text>
              <Calendar size={18} color="#3b82f6" />
            </View>
            <TextInput
              value={daysInput}
              onChangeText={setDaysInput}
              placeholder="مثال: 5"
              placeholderTextColor="#475569"
              keyboardType="numeric"
              className="p-3 rounded-xl bg-slate-800/80 text-white font-bold text-right text-lg border border-slate-700"
            />
          </View>

          <View className="p-4 rounded-2xl bg-dark-card border border-dark-border">
            <Text className="text-sm font-bold text-white text-right mb-3">
              العملة المفضلة
            </Text>
            <View className="flex-row gap-2 justify-end">
              {['SAR', 'USD', 'AED', 'EGP'].map((curr) => (
                <TouchableOpacity
                  key={curr}
                  onPress={() => setSelectedCurrency(curr)}
                  className={`px-4 py-2.5 rounded-xl border ${
                    selectedCurrency === curr
                      ? 'bg-emerald-600 border-emerald-500'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      selectedCurrency === curr ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {curr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Save Changes Button */}
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.8}
          className={`py-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-md mb-4 ${
            savedSuccess ? 'bg-emerald-500' : 'bg-emerald-600'
          }`}
        >
          {savedSuccess ? (
            <>
              <Check size={20} color="#ffffff" />
              <Text className="text-white font-black text-base">تم الحفظ بنجاح!</Text>
            </>
          ) : (
            <>
              <Save size={20} color="#ffffff" />
              <Text className="text-white font-black text-base">حفظ الإعدادات</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Danger Zone: Reset Data */}
        <TouchableOpacity
          onPress={handleResetData}
          activeOpacity={0.8}
          className="py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex-row items-center justify-center gap-2 mb-6"
        >
          <Trash2 size={16} color="#f43f5e" />
          <Text className="text-rose-500 font-bold text-xs">إعادة ضبط المصنع وتصفير البيانات</Text>
        </TouchableOpacity>

        {/* App Info Footer */}
        <View className="items-center justify-center pt-2">
          <Info size={16} color="#64748b" className="mb-1" />
          <Text className="text-[11px] font-semibold text-slate-500">
            تستاهل؟ — الإصدار 1.0.0 (Local-First Fintech)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
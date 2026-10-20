import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BookmarkPlus, CheckCircle2, XCircle } from "lucide-react-native";
import { calculateTrueCost } from "../lib/calculations";
import { useIncomeStore } from "../store/incomeStore";
import { useWishlistStore } from "../store/wishlistStore";
import { CostIndecator } from "./CostIndecator";
import { TimeBreakdown } from "./TimeBreakdown";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { useCustomAlert } from "./CustomAlert";

function formatNumber(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

export function CalculatorCard() {
  const { showAlert } = useCustomAlert();
  const { currency, hourlyRate, monthlyIncome, workHoursPerDay } =
    useIncomeStore();
  const addItem = useWishlistStore((state) => state.addItem);
  const [itemTitle, setItemTitle] = useState("");
  const [priceInput, setPriceInput] = useState("");

  const numericPrice = Number.parseFloat(priceInput.replace(",", ".")) || 0;
  const currentHourlyRate = hourlyRate > 0 ? hourlyRate : 50;
  const safePrice = Number.isFinite(numericPrice) ? numericPrice : 0;
  const calculation = calculateTrueCost(safePrice, currentHourlyRate);

  const saveToWishlist = () => {
    if (safePrice <= 0) return;

    addItem(itemTitle.trim() || "منتج جديد", safePrice, currentHourlyRate);
    setItemTitle("");
    setPriceInput("");
    showAlert("تمت الإضافة", "أضفنا المنتج إلى قائمة التفكير.");
  };

  const keepMoney = () => {
    if (safePrice <= 0) return;

    addItem(
      itemTitle.trim() || "منتج جديد",
      safePrice,
      currentHourlyRate,
      true,
    );
    setItemTitle("");
    setPriceInput("");
    showAlert("قرار ذكي", "تم تسجيل المبلغ وساعات العمل التي وفرتها.");
  };

  return (
    <Card corner="3xl" className="mb-6 overflow-hidden p-5 shadow-sm">
      <Input
        label="اسم المنتج"
        value={itemTitle}
        onChangeText={setItemTitle}
        placeholder="مثلاً: سماعات جديدة"
        returnKeyType="next"
        containerClassName="mb-5"
      />

      <Input
        label={`سعر المنتج (${currency})`}
        value={priceInput}
        onChangeText={setPriceInput}
        placeholder="0.00"
        keyboardType="decimal-pad"
        returnKeyType="done"
        accessibilityLabel="سعر المنتج"
        className="text-2xl font-black"
      />

      <View className="my-4 items-center border-y border-light-border py-5 dark:border-dark-border">
        <Text className="mb-1 text-xs font-semibold text-light-muted dark:text-dark-muted">
          ثمنه من وقتك
        </Text>
        <View className="items-center gap-1">
          <Text className="text-5xl font-black text-light-text dark:text-dark-text">
            {formatNumber(calculation.hours)}
          </Text>
          <Text className="text-sm font-bold text-light-muted dark:text-dark-muted">
            ساعة عمل
          </Text>
        </View>

        {safePrice > 0 && (
          <View className="mt-5 w-full">
            <TimeBreakdown
              hours={calculation.hours}
              price={safePrice}
              workHoursPerDay={workHoursPerDay}
              monthlyIncome={monthlyIncome}
              currency={currency}
            />
          </View>
        )}
      </View>

      {safePrice > 0 && (
        <>
          <CostIndecator hours={calculation.hours} />
          <View className="mt-4 flex-row gap-3">
            <Button onPress={saveToWishlist} className="flex-1 px-3">
              <CheckCircle2 size={18} color="#ffffff" />
              <Text className="text-sm font-bold text-white">تستاهل!</Text>
            </Button>
            <Button
              onPress={keepMoney}
              variant="danger"
              className="flex-1 px-3"
            >
              <XCircle size={18} color="#ffffff" />
              <Text className="text-sm font-bold text-white">وفر فلوسك!</Text>
            </Button>
          </View>
          <TouchableOpacity
            onPress={saveToWishlist}
            activeOpacity={0.7}
            accessibilityRole="button"
            className="mt-3 min-h-10 flex-row items-center justify-center gap-2 py-2"
          >
            <BookmarkPlus size={16} color="#64748b" />
            <Text className="text-xs font-semibold text-light-muted dark:text-dark-muted">
              أضف لقائمة التفكير لاحقاً
            </Text>
          </TouchableOpacity>
        </>
      )}
    </Card>
  );
}

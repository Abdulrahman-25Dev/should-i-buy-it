import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BookmarkPlus, CheckCircle2, XCircle } from "lucide-react-native";
import { calculateTrueCost } from "../lib/calculations";
import { getCurrencyLabel } from "../lib/constants";
import { useIncomeStore } from "../store/incomeStore";
import { useWishlistStore } from "../store/wishlistStore";
import { CostIndecator } from "./CostIndecator";
import { TimeBreakdown } from "./TimeBreakdown";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { useCustomAlert } from "./CustomAlert";
import { useTranslation } from "react-i18next";

function formatNumber(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

export function CalculatorCard() {
  const { t, i18n } = useTranslation();
  const { showAlert } = useCustomAlert();
  const { currency, hourlyRate, monthlyIncome, workHoursPerDay } =
    useIncomeStore();
  const displayCurrency = getCurrencyLabel(currency, i18n.language);
  const addItem = useWishlistStore((state) => state.addItem);
  const [itemTitle, setItemTitle] = useState("");
  const [priceInput, setPriceInput] = useState("");

  const numericPrice = Number.parseFloat(priceInput.replace(",", ".")) || 0;
  const currentHourlyRate = hourlyRate > 0 ? hourlyRate : 50;
  const safePrice = Number.isFinite(numericPrice) ? numericPrice : 0;
  const calculation = calculateTrueCost(safePrice, currentHourlyRate);

  const saveToWishlist = () => {
    if (safePrice <= 0) return;

    addItem(
      itemTitle.trim() || t("calculator.newProduct"),
      safePrice,
      currentHourlyRate,
    );
    setItemTitle("");
    setPriceInput("");
    showAlert(t("calculator.addedTitle"), t("calculator.addedMessage"));
  };

  const keepMoney = () => {
    if (safePrice <= 0) return;

    addItem(
      itemTitle.trim() || t("calculator.newProduct"),
      safePrice,
      currentHourlyRate,
      true,
    );
    setItemTitle("");
    setPriceInput("");
    showAlert(t("calculator.savedTitle"), t("calculator.savedMessage"));
  };

  return (
    <Card corner="3xl" className="mb-6 overflow-hidden p-5 shadow-sm">
      <Input
        label={t("calculator.productName")}
        value={itemTitle}
        onChangeText={setItemTitle}
        placeholder={t("calculator.productPlaceholder")}
        returnKeyType="next"
        containerClassName="mb-5"
      />

      <Input
        label={t("calculator.productPrice", { currency: displayCurrency })}
        value={priceInput}
        onChangeText={setPriceInput}
        placeholder="0.00"
        keyboardType="decimal-pad"
        returnKeyType="done"
        accessibilityLabel={t("calculator.priceAccessibility")}
        className="text-2xl font-black"
      />

      <View className="my-4 items-center border-y border-light-border py-5 dark:border-dark-border">
        <Text className="mb-1 text-xs font-semibold text-light-muted dark:text-dark-muted">
          {t("calculator.timeCost")}
        </Text>
        <View className="items-center gap-1">
          <Text className="text-5xl font-black text-light-text dark:text-dark-text">
            {formatNumber(calculation.hours)}
          </Text>
          <Text className="text-sm font-bold text-light-muted dark:text-dark-muted">
            {t("calculator.workHour")}
          </Text>
        </View>

        {safePrice > 0 && (
          <View className="mt-5 w-full">
            <TimeBreakdown
              hours={calculation.hours}
              price={safePrice}
              workHoursPerDay={workHoursPerDay}
              monthlyIncome={monthlyIncome}
              currency={displayCurrency}
            />
          </View>
        )}
      </View>

      {safePrice > 0 && (
        <>
          <CostIndecator hours={calculation.hours} />
          <View className="mt-4 flex-row gap-3">
            <Button
              onPress={saveToWishlist}
              className="flex-1 px-3"
              contentClassName="flex-col"
            >
              <CheckCircle2 size={18} color="#ffffff" />
              <Text className="text-center text-sm font-bold text-white">
                {t("calculator.worthIt")}
              </Text>
            </Button>
            <Button
              onPress={keepMoney}
              variant="danger"
              className="flex-1 px-3"
              contentClassName="flex-col"
            >
              <XCircle size={18} color="#ffffff" />
              <Text className="text-center text-sm font-bold text-white">
                {t("calculator.saveMoney")}
              </Text>
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
              {t("calculator.saveForLater")}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </Card>
  );
}

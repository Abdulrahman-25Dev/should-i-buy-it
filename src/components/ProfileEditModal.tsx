import { Check, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useColorScheme } from "nativewind";

export interface ProfileOption {
  label: string;
  value: string;
}

interface ProfileEditModalProps {
  visible: boolean;
  title: string;
  value: string;
  isArabic: boolean;
  options?: ProfileOption[];
  error?: string;
  placeholder?: string;
  keyboardType?: "decimal-pad" | "number-pad";
  onChangeValue: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function ProfileEditModal({
  visible,
  title,
  value,
  isArabic,
  options,
  error,
  placeholder,
  keyboardType = "decimal-pad",
  onChangeValue,
  onSave,
  onClose,
}: ProfileEditModalProps) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <KeyboardAvoidingView
        className="flex-1 items-center justify-center px-5"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.close")}
          onPress={onClose}
          className="absolute inset-0 bg-black/55"
        />
        <View className="w-full max-w-md rounded-3xl border border-light-border bg-light-card p-5 shadow-2xl dark:border-dark-border dark:bg-dark-card">
          <View
            className={`mb-5 flex-row items-center justify-between ${isArabic ? "flex-row-reverse" : ""}`}
          >
            <Text className="text-lg font-black text-light-text dark:text-dark-text">
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("common.close")}
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-light-input dark:bg-dark-input"
            >
              <X
                size={20}
                color={colorScheme === "dark" ? "#cbd5e1" : "#64748b"}
              />
            </Pressable>
          </View>

          {options ? (
            <ScrollView
              className="max-h-64"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {options.map((option) => {
                const selected = value === option.value;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    onPress={() => onChangeValue(option.value)}
                    className={`mb-2 min-h-12 items-center justify-between rounded-xl border px-4 ${
                      isArabic ? "flex-row-reverse" : "flex-row"
                    } ${
                      selected
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-light-border dark:border-dark-border"
                    }`}
                  >
                    <Text className="text-sm font-bold text-light-text dark:text-dark-text">
                      {option.label}
                    </Text>
                    {selected ? <Check size={18} color="#10b981" /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <TextInput
              accessibilityLabel={title}
              autoFocus
              keyboardType={keyboardType}
              placeholder={placeholder}
              placeholderTextColor="#94a3b8"
              value={value}
              onChangeText={onChangeValue}
              selectTextOnFocus
              style={{
                writingDirection: isArabic ? "rtl" : "ltr",
                textAlign: isArabic ? "right" : "left",
              }}
              className="min-h-14 rounded-2xl border border-light-border bg-light-input px-4 text-base font-semibold text-light-text dark:border-dark-border dark:bg-dark-input dark:text-dark-text"
            />
          )}

          {error ? (
            <Text
              accessibilityRole="alert"
              className={`mt-2 text-sm font-semibold text-rose-600 dark:text-rose-400 ${isArabic ? "text-right" : "text-left"}`}
            >
              {error}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            onPress={onSave}
            className="mt-5 min-h-12 items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3"
          >
            <Text className="text-sm font-bold text-white">
              {t("common.save")}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

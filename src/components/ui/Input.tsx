import { useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  className?: string;
  placeholderTextColor?: string;
}

export function Input({
  label,
  error,
  containerClassName = "",
  className = "",
  placeholderTextColor = "#94a3b8",
  editable = true,
  style,
  onFocus,
  onBlur,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderClass = error
    ? "border-rose-500"
    : isFocused
      ? "border-emerald-500"
      : "border-light-border dark:border-dark-border";

  return (
    <View className={containerClassName}>
      {label ? (
        <Text className="mb-2 text-right text-sm font-bold text-light-text dark:text-dark-text">
          {label}
        </Text>
      ) : null}
      <TextInput
        {...textInputProps}
        editable={editable}
        placeholderTextColor={placeholderTextColor}
        accessibilityState={{ disabled: !editable }}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        style={[{ writingDirection: "rtl", textAlign: "right" }, style]}
        className={`rounded-2xl border bg-light-input p-4 text-right text-sm font-semibold text-light-text dark:bg-dark-input dark:text-dark-text ${borderClass} ${!editable ? "opacity-60" : ""} ${className}`}
      />
      {error ? (
        <Text
          accessibilityRole="alert"
          className="mt-1 text-right text-xs font-semibold text-rose-600 dark:text-rose-400"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

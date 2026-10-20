import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type PressableProps,
} from "react-native";

export type ButtonVariant = "primary" | "danger" | "outline";

interface ButtonProps extends Omit<PressableProps, "children"> {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  activeOpacity?: number;
  className?: string;
  contentClassName?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border border-emerald-600 bg-emerald-600",
  danger: "border border-rose-600 bg-rose-600",
  outline: "border border-light-border bg-transparent dark:border-dark-border",
};

const variantTextClasses: Record<ButtonVariant, string> = {
  primary: "text-white",
  danger: "text-white",
  outline: "text-light-text dark:text-dark-text",
};

const variantSpinnerColors: Record<ButtonVariant, string> = {
  primary: "#ffffff",
  danger: "#ffffff",
  outline: "#10b981",
};

export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  activeOpacity = 0.82,
  className = "",
  contentClassName = "",
  accessibilityRole = "button",
  style: pressableStyle,
  ...pressableProps
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...pressableProps}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={(state) => [
        { opacity: isDisabled ? 0.55 : state.pressed ? activeOpacity : 1 },
        ...(typeof pressableStyle === "function"
          ? [pressableStyle(state)]
          : pressableStyle
            ? [pressableStyle]
            : []),
      ]}
      className={`min-h-12 flex-row items-center justify-center rounded-2xl px-4 py-3 ${variantClasses[variant]} ${className}`}
    >
      <View
        className={`flex-row items-center justify-center gap-2 ${contentClassName}`}
      >
        {loading ? (
          <ActivityIndicator
            color={variantSpinnerColors[variant]}
            size="small"
          />
        ) : typeof children === "string" || typeof children === "number" ? (
          <Text className={`text-sm font-bold ${variantTextClasses[variant]}`}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
}

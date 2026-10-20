import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: ReactNode;
  className?: string;
  corner?: "2xl" | "3xl";
}

export function Card({
  children,
  className = "",
  corner = "2xl",
  ...viewProps
}: CardProps) {
  const cornerClass = corner === "3xl" ? "rounded-3xl" : "rounded-2xl";

  return (
    <View
      {...viewProps}
      className={`border border-light-border bg-light-card ${cornerClass} dark:border-dark-border dark:bg-dark-card ${className}`}
    >
      {children}
    </View>
  );
}

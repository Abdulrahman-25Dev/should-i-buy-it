import { createContext, useContext, useState, type ReactNode } from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
} from "react-native";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";

export interface CustomAlertButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: (event: GestureResponderEvent) => void;
}

interface AlertState {
  title: string;
  message?: string;
  buttons: CustomAlertButton[];
}

interface CustomAlertContextValue {
  showAlert: (
    title: string,
    message?: string,
    buttons?: CustomAlertButton[],
  ) => void;
}

const CustomAlertContext = createContext<CustomAlertContextValue | null>(null);

export function CustomAlertProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [alert, setAlert] = useState<AlertState | null>(null);
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const showAlert = (
    title: string,
    message?: string,
    buttons: CustomAlertButton[] = [{ text: t("common.ok") }],
  ) => setAlert({ title, message, buttons });

  const closeAlert = () => setAlert(null);

  return (
    <CustomAlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal
        visible={alert !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeAlert}
        accessibilityViewIsModal
      >
        <View className="flex-1 items-center justify-center px-6">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("alerts.close")}
            onPress={closeAlert}
            className="absolute inset-0 bg-black/50"
          />
          <View
            className={`w-full max-w-sm rounded-3xl border p-5 shadow-xl ${
              isDarkMode
                ? "border-dark-border bg-dark-card"
                : "border-light-border bg-light-card"
            }`}
          >
            <Text className="text-center text-lg font-black text-light-text dark:text-dark-text">
              {alert?.title}
            </Text>
            {alert?.message ? (
              <Text className="mt-2 text-center text-sm leading-6 text-light-muted dark:text-dark-muted">
                {alert.message}
              </Text>
            ) : null}
            <View className="mt-6 flex-row-reverse gap-3">
              {alert?.buttons.map((button, index) => {
                const isDestructive = button.style === "destructive";
                const isCancel = button.style === "cancel";

                return (
                  <Pressable
                    key={`${button.text}-${index}`}
                    accessibilityRole="button"
                    onPress={(event) => {
                      closeAlert();
                      button.onPress?.(event);
                    }}
                    className={`min-h-11 flex-1 items-center justify-center rounded-xl border px-3 py-2 ${
                      isDestructive
                        ? "border-rose-600 bg-rose-600"
                        : isCancel
                          ? "border-light-border bg-transparent dark:border-dark-border"
                          : "border-emerald-600 bg-emerald-600"
                    }`}
                  >
                    <Text
                      className={`text-center text-sm font-bold ${
                        isCancel
                          ? "text-light-text dark:text-dark-text"
                          : "text-white"
                      }`}
                    >
                      {button.text}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </CustomAlertContext.Provider>
  );
}

export function useCustomAlert() {
  const context = useContext(CustomAlertContext);

  if (!context) {
    throw new Error("useCustomAlert must be used within CustomAlertProvider");
  }

  return context;
}

// src/app/_layout.tsx
import "./global.css";
import { Stack } from "expo-router";
import { CustomAlertProvider } from "../components/CustomAlert";

export default function RootLayout() {
  return (
    <CustomAlertProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="item/[id]" options={{ presentation: "modal" }} />
      </Stack>
    </CustomAlertProvider>
  );
}

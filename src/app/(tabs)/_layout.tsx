import { Tabs } from 'expo-router';
import { Calculator, Settings, History } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10b981', // Emerald active color
        tabBarInactiveTintColor: '#64748b',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#0f172a', // Dark background by default (or translucent)
          borderTopColor: '#1e293b',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الحاسبة',
          tabBarIcon: ({ color, size }) => <Calculator size={size} color={color} />,
        }}
      />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'الإحصائيات',
            tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
          }}
        />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'الإعدادات',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

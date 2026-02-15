import { Tabs } from 'expo-router';
import { LiquidTabBar } from '../../src/components/ui/LiquidTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <LiquidTabBar {...props} />}
      screenOptions={{
        headerShown: false,

      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}

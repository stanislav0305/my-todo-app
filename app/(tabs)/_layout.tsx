import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { selectAppTheme } from '@/store/settings.slice'
import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'
import { useSelector } from 'react-redux'


export default function TabLayout() {
  const appTheme = useSelector(selectAppTheme)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: appTheme.colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          default: {},
        }),
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Dictionary',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='book' color={color} />,
        }}
      />
      <Tabs.Screen
        name='tasks'
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='book' color={color} />,
        }}
      />
    </Tabs>
  )
}

import { useAppTheme } from '@shared/theme/hooks'
import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'
import { Icon } from 'react-native-paper'


export default function TabLayout() {
  const appTheme = useAppTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: appTheme.colors.primary,
        headerShown: true,
        tabBarStyle: Platform.select({
          default: {},
        }),
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => <Icon size={34} source='target' color={color} />,
        }}
      />
      <Tabs.Screen
        name='regular-tasks'
        options={{
          title: 'Regular tasks',
          tabBarIcon: ({ color }) => <Icon size={34} source='target' color={color} />,
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Icon size={30} source='cog' color={color} />
        }}
      />
    </Tabs>
  )
}
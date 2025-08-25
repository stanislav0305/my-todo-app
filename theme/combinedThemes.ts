import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme
} from '@react-navigation/native'
import merge from 'deepmerge'
import {
    adaptNavigationTheme,
    MD3DarkTheme,
    MD3LightTheme,
} from 'react-native-paper'

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
})


//merge Paper Themes & React Native Themes to Combined Theme 
export const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme)
export const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme)

export type CombinedTheme = typeof CombinedDarkTheme & typeof CombinedDefaultTheme
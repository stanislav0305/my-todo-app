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
import { AdditionalTheme } from '../types/additional-theme'
import { AppTheme } from '../types/app-theme'

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
})

//merge Paper Themes & React Native Themes to Combined Theme 
export const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme)
export const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme)

export const DefaultAdditionalTheme = {
    colors: {
        success: '#016e00ff',
        onSuccess: '#ffffffff',
        successContainer: '#77ff61ff',
        onSuccessContainer: '#002200ff',
        warning: '#5c6300ff',
        onWarning: '#ffffffff',
        warningContainer: '#deed00ff',
        onWarningContainer: '#1b1d00ff',
        danger: '#c00001ff',
        onDanger: '#ffffffff',
        dangerContainer: '#ffdad4ff',
        onDangerContainer: '#410000ff',
        blue: '#006874ff',
        onBlue: '#ffffffff',
        blueContainer: '#97f0ffff',
        onBlueContainer: '#001f24ff',
    },
} satisfies AdditionalTheme

export const DarkAdditionalTheme = {
    colors: {
        success: '#00e600ff',
        onSuccess: '#013a00ff',
        successContainer: '#015300ff',
        onSuccessContainer: '#77ff61ff',
        warning: '#c2d000ff',
        onWarning: '#2f3300ff',
        warningContainer: '#454b00ff',
        onWarningContainer: '#deed00ff',
        danger: '#ffb4a8ff',
        onDanger: '#690000ff',
        dangerContainer: '#930000ff',
        onDangerContainer: '#ffdad4ff',
        blue: '#4fd8ebff',
        onBlue: '#00363dff',
        blueContainer: '#004f58ff',
        onBlueContainer: '#97f0ffff',
    },
} satisfies AdditionalTheme

//merge Combined Themes & Additional Colors to App Theme 
export const appDefaultTheme: AppTheme = merge(CombinedDefaultTheme, DefaultAdditionalTheme)
export const appDarkTheme: AppTheme = merge(CombinedDarkTheme, DarkAdditionalTheme)
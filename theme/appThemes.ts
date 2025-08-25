import merge from 'deepmerge'
import { CombinedDarkTheme, CombinedDefaultTheme, CombinedTheme } from './combinedThemes'


const tintColorLight = '#0a7ea4'
const tintColorDark = '#fff'

const iconColorLight = '#687076'
const iconColorDark = '#9BA1A6'

const silver = '#acacacff'
const red = '#fd0303ff'
const yellow = '#e3f305ff'
const green = '#03f803ff'


export type AdditionalTheme = {
    colors: {
        success: string,
        onSuccess: string,
        successContainer: string,
        onSuccessContainer: string,
        warning: string,
        onWarning: string,
        warningContainer: string,
        onWarningContainer: string,
        danger: string,
        onDanger: string,
        dangerContainer: string,
        onDangerContainer: string,
        blue: string,
        onBlue: string,
        blueContainer: string,
        onBlueContainer: string,

        text: string,
        background: string,
        border: string,
        tint: string,
        icon: string,
        tabIconDefault: string,
        tabIconSelected: string,
        placeholderTextColor: string,
        colorSilver: string,
        colorYellow: string,
        colorRed: string,
        colorGreen: string,
    }
}

export const DefaultAdditionalTheme = {
    colors: {
        success: "#016e00ff",
        onSuccess: "#ffffffff",
        successContainer: "#77ff61ff",
        onSuccessContainer: "#002200ff",
        warning: "#5c6300ff",
        onWarning: "#ffffffff",
        warningContainer: "#deed00ff",
        onWarningContainer: "#1b1d00ff",
        danger: "#c00001ff",
        onDanger: "#ffffffff",
        dangerContainer: "#ffdad4ff",
        onDangerContainer: "#410000ff",
        blue: "#006874ff",
        onBlue: "#ffffffff",
        blueContainer: "#97f0ffff",
        onBlueContainer: "#001f24ff",

        text: '#11181C',
        background: '#ffffffff',
        border: '#151718',
        tint: tintColorLight,
        icon: iconColorLight,
        tabIconDefault: iconColorLight,
        tabIconSelected: tintColorLight,
        placeholderTextColor: iconColorLight,
        colorSilver: silver,
        colorYellow: yellow,
        colorRed: red,
        colorGreen: green
    },
} satisfies AdditionalTheme

export const DarkAdditionalTheme = {
    colors: {
        success: "#00e600ff",
        onSuccess: "#013a00ff",
        successContainer: "#015300ff",
        onSuccessContainer: "#77ff61ff",
        warning: "#c2d000ff",
        onWarning: "#2f3300ff",
        warningContainer: "#454b00ff",
        onWarningContainer: "#deed00ff",
        danger: "#ffb4a8ff",
        onDanger: "#690000ff",
        dangerContainer: "#930000ff",
        onDangerContainer: "#ffdad4ff",
        blue: "#4fd8ebff",
        onBlue: "#00363dff",
        blueContainer: "#004f58ff",
        onBlueContainer: "#97f0ffff",

        text: '#ECEDEE',
        background: '#151718',
        border: '#687076',
        tint: tintColorDark,
        icon: iconColorDark,
        tabIconDefault: iconColorDark,
        tabIconSelected: tintColorDark,
        placeholderTextColor: iconColorDark,
        colorSilver: silver,
        colorYellow: yellow,
        colorRed: red,
        colorGreen: green
    },
} satisfies AdditionalTheme


export type AppTheme = CombinedTheme & AdditionalTheme
export type AppThemeColors = keyof (AppTheme['colors'])


//merge Combined Themes & Additional Colors to App Theme 
export const appDefaultTheme: AppTheme = merge(CombinedDefaultTheme, DefaultAdditionalTheme)
export const appDarkTheme: AppTheme = merge(CombinedDarkTheme, DarkAdditionalTheme)
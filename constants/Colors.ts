/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4'
const tintColorDark = '#fff'

const iconColorLight = '#687076'
const iconColorDark = '#9BA1A6'

const silver = '#acacacff'
const red = '#fd0303ff'
const yellow = '#e3f305ff'
const green = '#03f803ff'

export const Colors = {
  light: {
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
  dark: {
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
}

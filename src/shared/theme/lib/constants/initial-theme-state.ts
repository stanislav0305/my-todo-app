import { Appearance } from 'react-native'
import { themeHelper } from '../helpers/theme-helper'
import { ThemeState } from '../types/theme-state'


const INITIAL_SYSTEM_THEME_NAME = Appearance.getColorScheme() ?? 'light'
const INITIAL_SELECTED_THEME_NAME = 'automatic'

export const INITIAL_THEME_STATE = {
    appThemeName: themeHelper.detectAppThemeName(INITIAL_SELECTED_THEME_NAME, INITIAL_SYSTEM_THEME_NAME),
    selectedThemeName: INITIAL_SELECTED_THEME_NAME,
    systemThemeName: INITIAL_SYSTEM_THEME_NAME,
} satisfies ThemeState as ThemeState
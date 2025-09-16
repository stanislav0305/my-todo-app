import { AppThemeNameType } from './app-theme-name-type'
import { ThemeNameType } from './theme-name-type'


export interface ThemeState {
    appThemeName: ThemeNameType, //current app theme (dark or light)
    selectedThemeName: AppThemeNameType, //selected mode: dark, automatic or light
    systemThemeName: ThemeNameType, //theme (dark or light) in system, used if selectedThemeName === automatic
}
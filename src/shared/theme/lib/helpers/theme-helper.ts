import { appDarkTheme, appDefaultTheme } from '../constants/constants'
import { AppTheme } from '../types/app-theme'
import { AppThemeNameType } from '../types/app-theme-name-type'
import { ColorType } from '../types/color-type'
import { ThemeNameType } from '../types/theme-name-type'


export const themeHelper = {
    detectAppThemeName: (selectedThemeName: AppThemeNameType, systemThemeName: ThemeNameType): ThemeNameType => {
        //if selected automatic theme then get it from system appearance settings
        if (selectedThemeName === 'automatic')
            return systemThemeName

        //by selected theme 
        return selectedThemeName
    },
    detectTheme: (themeName: AppThemeNameType) => {
        return themeName === 'dark' ? appDarkTheme : appDefaultTheme
    },
    getColor(appTheme: AppTheme, colorType: ColorType) {
        const colorName = colorType === 'success' ? 'success' : 'warning'
        return appTheme.colors[colorName]
    }
}
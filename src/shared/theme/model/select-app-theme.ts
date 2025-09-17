import { createSelector } from '@reduxjs/toolkit'
import { AppTheme, themeHelper, ThemeNameType } from '@shared/theme/lib'


export const selectAppTheme = createSelector(
    (state: RootState) => state.theme.appThemeName,
    (appThemeName: ThemeNameType): AppTheme => {
        console.log('appThemeName=', appThemeName)
        return themeHelper.detectTheme(appThemeName)
    }
)
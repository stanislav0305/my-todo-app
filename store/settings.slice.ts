import { appDarkTheme, appDefaultTheme, AppTheme } from '@/theme/appThemes'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Appearance } from 'react-native'
import { RootState } from './store'

export type ThemeNameType = 'light' | 'dark'
export type AppThemeNameType = 'automatic' | ThemeNameType

interface Settings {
    appThemeName: ThemeNameType, //current app theme (dark or light)
    selectedThemeName: AppThemeNameType, //selected mode: dark, automatic or light
    systemThemeName: ThemeNameType, //theme (dark or light) in system, used if selectedThemeName === automatic
    mainSettings: MainSettings,
}

export interface MainSettings {
    wordsLearningPartSize: number,
}

//-------------------------------------
export const detectAppThemeName = (selectedThemeName: AppThemeNameType, systemThemeName: ThemeNameType) => {
    //if selected automatic theme then get it from system appearance settings
    if (selectedThemeName === 'automatic')
        return systemThemeName

    //by selected theme 
    return selectedThemeName
}

const detectTheme = (themeName: AppThemeNameType) => {
    return themeName === 'dark' ? appDarkTheme : appDefaultTheme
}

//-------------------------------------

const initSystemThemeName = Appearance.getColorScheme() ?? 'light'
const initSelectedThemeName = 'automatic'

const initialState: Settings = {
    appThemeName: detectAppThemeName(initSelectedThemeName, initSystemThemeName),
    selectedThemeName: initSelectedThemeName,
    systemThemeName: initSystemThemeName,
    mainSettings: {
        wordsLearningPartSize: 2
    } satisfies MainSettings
} satisfies Settings

//-------------------------------------

export const selectMainSettings = (state: RootState) => state.settings.mainSettings
export const selectSelectedThemeName =(state: RootState) => state.settings.selectedThemeName
export const selectAppTheme = createSelector(
    (state: RootState) => state.settings.appThemeName,
    (appThemeName: ThemeNameType): AppTheme => {
        console.log('appThemeName=', appThemeName)
        return detectTheme(appThemeName)
    }
)

//-------------------------------------

export const settingsSlice = createSlice({
    name: 'settingsSlice',
    initialState: initialState,
    reducers: {
        changeSelectedThemeName: (draftState, action: PayloadAction<AppThemeNameType>) => {
            draftState.selectedThemeName = action.payload
            draftState.appThemeName = detectAppThemeName(draftState.selectedThemeName,
                draftState.systemThemeName)
        },
        changeSystemThemeName: (draftState, action: PayloadAction<ThemeNameType>) => {
            draftState.systemThemeName = action.payload
            draftState.appThemeName = detectAppThemeName(draftState.selectedThemeName,
                draftState.systemThemeName)
        },
        saveMainSettings: (draftState, action: PayloadAction<MainSettings>) => {
            draftState.mainSettings = action.payload
        }
    },
})

export const { changeSelectedThemeName, changeSystemThemeName, saveMainSettings } = settingsSlice.actions
export const settingsReducers = settingsSlice.reducer
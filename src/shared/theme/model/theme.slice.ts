import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThemeNameType, INITIAL_THEME_STATE, themeHelper, ThemeNameType } from '@shared/theme/lib'
import { revertAll } from '../../lib/actions'


export const themeSlice = createSlice({
    name: 'themeSlice',
    initialState: INITIAL_THEME_STATE,
    extraReducers: (builder) => builder.addCase(revertAll, () => INITIAL_THEME_STATE),
    reducers: {
        changeSelectedThemeName: (draftState, action: PayloadAction<AppThemeNameType>) => {
            draftState.selectedThemeName = action.payload
            draftState.appThemeName = themeHelper.detectAppThemeName(draftState.selectedThemeName,
                draftState.systemThemeName)
        },
        changeSystemThemeName: (draftState, action: PayloadAction<ThemeNameType>) => {
            draftState.systemThemeName = action.payload
            draftState.appThemeName = themeHelper.detectAppThemeName(draftState.selectedThemeName,
                draftState.systemThemeName)
        },
    },
})

export const { changeSelectedThemeName, changeSystemThemeName } = themeSlice.actions
export const themeReducers = themeSlice.reducer
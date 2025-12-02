import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { revertAll } from '@shared/lib/actions'
import { INITIAL_SETTINGS_STATE } from '../constants'
import { MainSettings } from '../types/main-settings'


export const settingsSlice = createSlice({
    name: 'settingsSlice',
    initialState: INITIAL_SETTINGS_STATE,
    extraReducers: (builder) => builder.addCase(revertAll, () => INITIAL_SETTINGS_STATE),
    reducers: {
        saveMainSettings: (draftState, action: PayloadAction<MainSettings>) => {
            draftState.mainSettings = action.payload
        }
    },
})

export const { saveMainSettings } = settingsSlice.actions
export const settingsReducers = settingsSlice.reducer
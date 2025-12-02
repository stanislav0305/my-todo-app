import { createSelector } from "@reduxjs/toolkit"


export const selectMainSettings = createSelector(
    [
        (state: RootState) => state.settings
    ],
    (settings) => {
        return settings.mainSettings
    }
)
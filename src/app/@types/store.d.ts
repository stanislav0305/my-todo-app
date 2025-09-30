import { ThunkAction, UnknownAction } from '@reduxjs/toolkit'
import { store } from '../model/store'

declare global {
    type AppStore = typeof store
    type RootState = ReturnType<AppStore['getState']>
    type AppDispatch = AppStore['dispatch']

    type AppThunk<ReturnType = void> = ThunkAction<
        ReturnType,
        RootState,
        unknown,
        UnknownAction
    >
}
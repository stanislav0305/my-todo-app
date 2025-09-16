import { ThunkAction, UnknownAction } from '@reduxjs/toolkit'


declare global {
    type AppStore = typeof import('../store').store
    type RootState = ReturnType<AppStore['getState']>
    type AppDispatch = AppStore['dispatch']

    type AppThunk<ReturnType = void> = ThunkAction<
        ReturnType,
        RootState,
        unknown,
        UnknownAction
    >
}
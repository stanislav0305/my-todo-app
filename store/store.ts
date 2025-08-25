import { dictionaryReducers } from '@/store/dictionary.slice'
import { settingsReducers } from '@/store/settings.slice'
import { configureStore, Middleware, UnknownAction } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'


const loggerMiddleware: Middleware = (_store) => (next) => (action) => {
    console.log('Dispatching action:', action)
    return next(action)
}

export const store = configureStore({
    devTools: true,
    reducer: {
        settings: settingsReducers,
        dictionary: dictionaryReducers,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(loggerMiddleware)
})


export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    UnknownAction
>


//export const createAppSelector = createSelector.withTypes<RootState>()

// create a generic type called AppSelector
//export type AppSelector<Return> = (state: RootState) => Return
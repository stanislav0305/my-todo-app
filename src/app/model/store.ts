import { themeReducers } from '@/src/shared/theme/model'
import { dictionaryReducers } from '@entities/dictionary'
import { settingsReducers } from '@entities/settings'
import { configureStore, Middleware } from '@reduxjs/toolkit'


const loggerMiddleware: Middleware = (_store) => (next) => (action) => {
    console.log('Dispatching action:', action)
    return next(action)
}

export const store = configureStore({
    devTools: true,
    reducer: {
        theme: themeReducers,
        settings: settingsReducers,
        dictionary: dictionaryReducers,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(loggerMiddleware)
})
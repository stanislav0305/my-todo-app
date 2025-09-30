import { configureStore, Middleware } from '@reduxjs/toolkit'
import { Persistor, persistStore } from 'redux-persist'
import { persistedReducer } from './configure-store'


const loggerMiddleware: Middleware = (_store) => (next) => (action) => {
    console.log('Dispatching action:', action)
    return next(action)
}

export const store = configureStore({
    devTools: true,
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false, // or configure specific checks
        })
            .concat(loggerMiddleware)
})

export const persistor = persistStore(store) as Persistor
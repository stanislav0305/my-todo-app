import { configureStore, Middleware } from '@reduxjs/toolkit'
import { Persistor, persistStore } from 'redux-persist'
import { persistedReducer } from './configure-store'


const loggerMiddleware: Middleware = (_store) => (next) => (action) => {
    if (typeof action === 'object'
        && (action != null)
        && !!(action as any).error)
        console.error('Dispatching action error:', action)
    else
        console.log('Dispatching action:', action)

    return next(action)
}

export const store = configureStore({
    devTools: true,
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            thunk: true,
            serializableCheck: false, // or configure specific checks
            /* serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },*/
        })
            .concat(loggerMiddleware)
})

export const persistor = persistStore(store, null, () => { console.log('Created persistStore.') }) as Persistor
import { DictionaryState } from '@/src/entities/dictionary/types/dictionary-state'
import { SettingsState } from '@/src/entities/settings/types/settings-state'
import { ThemeState } from '@/src/shared/theme/lib/types/theme-state'
import { themeReducers } from '@/src/shared/theme/model'
import { dictionaryReducers } from '@entities/dictionary'
import { settingsReducers } from '@entities/settings'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers, Reducer, UnknownAction } from '@reduxjs/toolkit'
import { PersistConfig, persistReducer } from 'redux-persist'


type RootPersistStorage = {
    theme: ThemeState
    settings: SettingsState
    dictionary: DictionaryState
}

type RootPersistStoragePartial = Partial<{
    theme: ThemeState | undefined
    settings: SettingsState | undefined
    dictionary: DictionaryState | undefined
}>

const rootReducer = combineReducers({
    theme: themeReducers,
    settings: settingsReducers,
    dictionary: dictionaryReducers,
}) as Reducer<RootPersistStorage, UnknownAction, RootPersistStoragePartial>

const persistConfig = {
    key: "root",
    storage: AsyncStorage, // Use AsyncStorage for local storage
    //whitelist: ["theme", "settings", "dictionary"], // Optional: Persist only this slices of the state
    //blacklist: ["sliceName"] // Optional: Prevent certain slices from being persisted
} as PersistConfig<RootPersistStorage, any, any, any>

export const persistedReducer = persistReducer(persistConfig, rootReducer)
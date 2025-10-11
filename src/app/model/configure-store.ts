import { dictionaryReducers, DictionaryState } from '@entities/dictionary'
import { settingsReducers, SettingsState } from '@entities/settings'
import { tasksReducers, TasksState } from '@entities/tasks-management'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers, Reducer, UnknownAction } from '@reduxjs/toolkit'
import { ThemeState } from '@shared/theme/lib/types/theme-state'
import { themeReducers } from '@shared/theme/model'
import { PersistConfig, persistReducer } from 'redux-persist'


type RootPersistStorage = {
    theme: ThemeState
    settings: SettingsState
    dictionary: DictionaryState
    tasksManagement: TasksState
}

type RootPersistStoragePartial = Partial<{
    theme: ThemeState | undefined
    settings: SettingsState | undefined
    dictionary: DictionaryState | undefined
    tasksManagement: TasksState | undefined
}>

const rootReducer = combineReducers({
    theme: themeReducers,
    settings: settingsReducers,
    dictionary: dictionaryReducers,
    tasksManagement: tasksReducers,
}) as Reducer<RootPersistStorage, UnknownAction, RootPersistStoragePartial>

const persistConfig = {
    key: "root",
    storage: AsyncStorage, // Use AsyncStorage for local storage
    //whitelist: ["theme", "settings", "dictionary"], // Optional: Persist only this slices of the state
    //blacklist: ["sliceName"] // Optional: Prevent certain slices from being persisted
} as PersistConfig<RootPersistStorage, any, any, any>

export const persistedReducer = persistReducer(persistConfig, rootReducer)
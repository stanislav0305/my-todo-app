import { settingsReducers, SettingsState } from '@entities/settings'
import { tasksReducers, TasksState } from '@entities/tasks-management'
import AsyncStorage, { AsyncStorageStatic } from '@react-native-async-storage/async-storage'
import { combineReducers, Reducer, UnknownAction } from '@reduxjs/toolkit'
import { ThemeState } from '@shared/theme/lib/types/theme-state'
import { themeReducers } from '@shared/theme/model'
import { createMigrate, PersistConfig, persistReducer } from 'redux-persist'
import { PERSIST_MIGRATION_NEW_VERSION, persistMigrations } from './persist-migration-manifest'


export let storageEngine: AsyncStorageStatic = AsyncStorage

type RootPersistStorage = {
    theme: ThemeState
    settings: SettingsState
    tasksManagement: TasksState
}

type RootPersistStoragePartial = Partial<{
    theme: ThemeState | undefined
    settings: SettingsState | undefined
    tasksManagement: TasksState | undefined
}>

const rootReducer = combineReducers({
    theme: themeReducers,
    settings: settingsReducers,
    tasksManagement: tasksReducers,
}) as Reducer<RootPersistStorage, UnknownAction, RootPersistStoragePartial>

const persistConfig: PersistConfig<RootPersistStorage, any, any, any> = {
    key: 'root',
    version: PERSIST_MIGRATION_NEW_VERSION,
    storage: storageEngine,
    whitelist: ['theme', 'settings'], // Optional: Persist only this slices of the state
    blacklist: ['tasksManagement'], // Optional: Prevent certain slices from being persisted
    migrate: createMigrate(persistMigrations, { debug: __DEV__ }),
    timeout: 100
} as PersistConfig<RootPersistStorage, any, any, any>

export const persistedReducer = persistReducer(persistConfig, rootReducer)
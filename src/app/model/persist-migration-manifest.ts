import { INITIAL_ACTUAL_TASKS_STATE } from '@/src/entities/actual-tasks'
import { INITIAL_REGULAR_TASKS_STATE } from '@entities/regular-tasks'
import { INITIAL_SETTINGS_STATE } from '@entities/settings'
import { INITIAL_TASKS_STATE } from '@entities/tasks'
import { INITIAL_THEME_STATE } from '@shared/theme/lib'
import { MigrationManifest } from 'redux-persist'


export const PERSIST_MIGRATION_NEW_VERSION = 2 //need to be updated
export const persistMigrations = {
    [0]: (state: any): any => {
        return {
            ...state,
            theme: INITIAL_THEME_STATE,
            settings: INITIAL_SETTINGS_STATE,
            tasks: INITIAL_TASKS_STATE,
        }
    },
    [1]: (state: any): any => {
        return {
            ...state,
            regularTasks: INITIAL_REGULAR_TASKS_STATE,
        }
    },
    [2]: (state: any): any => {
        return {
            ...state,
            actualTasks: INITIAL_ACTUAL_TASKS_STATE,
        }
    },
} as MigrationManifest
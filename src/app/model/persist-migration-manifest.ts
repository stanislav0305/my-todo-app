import { INITIAL_SETTINGS_STATE } from '@entities/settings'
import { INITIAL_TASKS_STATE } from '@entities/tasks'
import { INITIAL_THEME_STATE } from '@shared/theme/lib'
import { MigrationManifest } from 'redux-persist'


export const PERSIST_MIGRATION_NEW_VERSION = 0 //need to be updated
export const persistMigrations = {
    [0]: (state: any): any => {
        return {
            ...state,
            theme: INITIAL_THEME_STATE,
            settings: INITIAL_SETTINGS_STATE,
            tasks: INITIAL_TASKS_STATE,
        }
    }
} as MigrationManifest
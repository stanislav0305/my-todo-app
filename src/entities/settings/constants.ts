import { MainSettings } from './types/main-settings'
import { SettingsState } from './types/settings-state'


const WORDS_LEARNING_PART_SIZE_DEFAULT = 10

export const INITIAL_SETTINGS_STATE = {
    mainSettings: {
        wordsLearningPartSize: WORDS_LEARNING_PART_SIZE_DEFAULT
    } satisfies MainSettings
} satisfies SettingsState as SettingsState
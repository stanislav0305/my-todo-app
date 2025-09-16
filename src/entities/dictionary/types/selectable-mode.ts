export const SelectableModeArr = ['WordSelect', 'TranslateSelect'] as const
export type SelectableMode = typeof SelectableModeArr[number]
export const ReadableModeArr = ['Review', 'withHidedWord', 'withHidedTranslate'] as const
export type ReadableMode = typeof ReadableModeArr[number]
export const ReadableModeValues = [...ReadableModeArr]
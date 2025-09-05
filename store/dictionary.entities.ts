export interface DictionaryWord {
    key: string
    word: string
    translate: string
}

export interface Word {
    key: string
    word: string
    translate: string
    statistics: WordLearnStatistics
}

export type Words = Record<string, Word>

export interface WordLearnStatistics {
    sessionKey: string
    isExcluded: boolean
    isLearned: boolean

    learnDay: number
    nextLearnAfterDays: number //next word repeat after ... days
    lastLearn: string
    nextLearn: string

    memoPercent: number //memorization present
    readCount: number
    selectCount: number
    writeCount: number
}
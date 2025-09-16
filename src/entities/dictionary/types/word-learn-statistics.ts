export interface WordLearnStatistics {
    sessionKey: string
    isExcluded: boolean
    isLearned: boolean

    learnDay: number
    nextLearnAfterDays: number //next word repeat after nextLearnAfterDays days
    lastLearn: string
    nextLearn: string

    memoPercent: number //memorization present
    readCount: number
    selectCount: number
    writeCount: number
}
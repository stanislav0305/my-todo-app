export interface WordLastLearnResult {
    key: string
    word: string
    isExcluded: boolean
    isLearned: boolean

    readResult: number
    selectResult: number
    writeResult: number

    memoPercent: number
    nextLearnAfterDays: number
    nextLearn: string
}
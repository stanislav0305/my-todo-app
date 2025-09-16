import { WordLearnStatistics } from './word-learn-statistics'


export interface Word {
    key: string
    word: string
    translate: string
    statistics: WordLearnStatistics
}
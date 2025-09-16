import { SessionResult } from './session-result'
import { WordCard } from './word-card'
import { WordLastLearnResult } from './word-last-learn-result'


export interface Session {
    key: string
    wordCardNum: number //current word card number
    wordCards: WordCard[]
    results: WordLastLearnResult[]
    totalCorrectAnswerCount: number
    totalAnswerCount: number
    totalCorrectAnswerPercent: number
    totalResult: SessionResult
}
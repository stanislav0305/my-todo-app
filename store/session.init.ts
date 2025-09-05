import { Session, WordsLastLearnResult } from "./session.entities";
import { SessionResult } from "./session.result";


export const defaultSession = {
    key: '',
    wordCardNum: 0,
    wordCards: [],
    results: [],
    totalCorrectAnswerCount: 0,
    totalAnswerCount: 0,
    totalCorrectAnswerPercent: 0,
    totalResult: {
        resultType: 'NeverGiveUp',
        color: 'danger'
    } as SessionResult
} satisfies Session as Session

export const defaultWordsLastLearnResult = {
    key: '',
    word: '',
    isExcluded: false,
    isLearned: false,

    readResult: 0,
    selectResult: 0,
    writeResult: 0,

    memoPercent: 0,
    nextLearnAfterDays: 0,
    nextLearn: '',
} satisfies WordsLastLearnResult as WordsLastLearnResult
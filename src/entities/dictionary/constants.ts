import { DictionaryState } from './types/dictionary-state'
import { Session } from './types/session'
import { SessionResult } from './types/session-result'
import { Word } from './types/word'
import { WordLastLearnResult } from './types/word-last-learn-result'
import { WordLearnStatistics } from './types/word-learn-statistics'
import { WordShort } from './types/word-short'
import { Words } from './types/words'


//session constants
export const WORD_CARD_SELECTABLE_ANSWER_COUNT = 5 //display wrong answer count in selectable card
export const MAX_CORRECT_READ_COUNT = 3 //count of correct answers when the word will be considered learned for WordCardReadable
export const MAX_CORRECT_SELECT_COUNT = 8 //count of correct answers when the word will be considered learned for WordCardSelectable
export const MAX_CORRECT_WRITE_COUNT = 8 //count of correct answers when the word will be considered learned for WordCardWritable
export const MAX_CORRECT_ANSWER_COUNT = MAX_CORRECT_READ_COUNT + MAX_CORRECT_SELECT_COUNT + MAX_CORRECT_WRITE_COUNT

export const SESSION_RESULTS: Map<number, SessionResult> = new Map<number, SessionResult>([
    [80, { resultType: 'Excellent', color: 'success' }],
    [50, { resultType: 'VeryGood', color: 'success' }],
    [30, { resultType: 'Good', color: 'success' }],
    [20, { resultType: 'YouCanDoBetter', color: 'warning' }],
    [10, { resultType: 'NeverGiveUp', color: 'danger' }],
])

export const DEFAULT_SESSION = {
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

export const DEFAULT_WORD_LAST_LEARN_RESULT = {
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
} satisfies WordLastLearnResult as WordLastLearnResult

//dictionary constants
const DEFAULT_LEARN_STATISTICS = {
    sessionKey: '',
    isExcluded: false,
    isLearned: false,

    learnDay: 0,
    nextLearnAfterDays: 0,
    lastLearn: '',
    nextLearn: '',

    memoPercent: 0, //memorization level
    readCount: 0,
    selectCount: 0,
    writeCount: 0,
} satisfies WordLearnStatistics

export const DEFAULT_WORD = {
    key: '',
    word: '',
    translate: '',
    statistics: { ...DEFAULT_LEARN_STATISTICS }
} satisfies Word

export const DEFAULT_WORD_SHORT = {
    key: '',
    word: '',
    translate: '',
} satisfies WordShort

const DEFAULT_WORDS: Words = {
    '1': {
        key: '1',
        word: 'word1',
        translate: 'translate1',
        statistics: { ...DEFAULT_LEARN_STATISTICS }
    } satisfies Word,
    '2': {
        key: '2',
        word: 'word2',
        translate: 'translate2',
        statistics: { ...DEFAULT_LEARN_STATISTICS }
    } satisfies Word,
    '3': {
        key: '3',
        word: 'word3',
        translate: 'translate3',
        statistics: { ...DEFAULT_LEARN_STATISTICS }
    } satisfies Word,
    '4': {
        key: '4',
        word: 'word4',
        translate: 'translate4',
        statistics: { ...DEFAULT_LEARN_STATISTICS }
    } satisfies Word,
    '5': {
        key: '5',
        word: 'word5',
        translate: 'translate5',
        statistics: { ...DEFAULT_LEARN_STATISTICS }
    } satisfies Word,
    '6': {
        key: '6',
        word: 'word6',
        translate: 'translate6',
        statistics: { ...DEFAULT_LEARN_STATISTICS }
    } satisfies Word,
    '7': {
        key: '7',
        word: 'word7',
        translate: 'translate7',
        statistics: { ...DEFAULT_LEARN_STATISTICS }
    } satisfies Word,
    '8': {
        key: '8',
        word: 'word8',
        translate: 'translate8',
        statistics: { ...DEFAULT_LEARN_STATISTICS }
    } satisfies Word,
    '9': {
        key: '9',
        word: 'word9',
        translate: 'translate9',
        statistics: { ...DEFAULT_LEARN_STATISTICS }
    } satisfies Word,
    '10': {
        key: '10',
        word: 'word10',
        translate: 'translate10',
        statistics: { ...DEFAULT_LEARN_STATISTICS }
    } satisfies Word,
}

export const INITIAL_DICTIONARY_STATE = {
    words: DEFAULT_WORDS,
    session: DEFAULT_SESSION,
} satisfies DictionaryState as DictionaryState
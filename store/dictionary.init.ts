import { Word, WordLearnStatistics, Words } from "./dictionary.entities"
import { defaultSession } from "./session.init"


export const defaultLearn = {
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

export const defaultObj = {
    key: '',
    word: '',
    translate: '',
    statistics: { ...defaultLearn }
} satisfies Word

export const defaultWords: Words = {
    '1': {
        key: '1',
        word: 'word1',
        translate: 'translate1',
        statistics: { ...defaultLearn }
    } satisfies Word,
    '2': {
        key: '2',
        word: 'word2',
        translate: 'translate2',
        statistics: { ...defaultLearn }
    } satisfies Word,
    '3': {
        key: '3',
        word: 'word3',
        translate: 'translate3',
        statistics: { ...defaultLearn }
    } satisfies Word,
    '4': {
        key: '4',
        word: 'word4',
        translate: 'translate4',
        statistics: { ...defaultLearn }
    } satisfies Word,
    '5': {
        key: '5',
        word: 'word5',
        translate: 'translate5',
        statistics: { ...defaultLearn }
    } satisfies Word,
    '6': {
        key: '6',
        word: 'word6',
        translate: 'translate6',
        statistics: { ...defaultLearn }
    } satisfies Word,
    '7': {
        key: '7',
        word: 'word7',
        translate: 'translate7',
        statistics: { ...defaultLearn }
    } satisfies Word,
    '8': {
        key: '8',
        word: 'word8',
        translate: 'translate8',
        statistics: { ...defaultLearn }
    } satisfies Word,
    '9': {
        key: '9',
        word: 'word9',
        translate: 'translate9',
        statistics: { ...defaultLearn }
    } satisfies Word,
    '10': {
        key: '10',
        word: 'word10',
        translate: 'translate10',
        statistics: { ...defaultLearn }
    } satisfies Word,
}

export const initialState = {
    words: defaultWords,
    session: defaultSession,
}

import genUniqueId from '@/shared/uniqueIdGenerator'
import { RootState } from '@/store/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'


export type Result1 = 'none' | 'IsNotRemembered' | 'IsRemembered'

interface Learn {
    learnProgress: number
    lastLearn: string
    nextLearn: string
    result1: Result1
    isExcluded: boolean
}

interface Word {
    key: string
    word: string
    translate: string
    learn: Learn
}

export interface DictionaryWord {
    key: string
    word: string
    translate: string
}

export interface CardWord {
    key: string
    word: string
    translate: string
    result1: Result1
    isExcluded: boolean
}

type Words = Record<string, Word>
const defaultObj = {
    key: '',
    word: '',
    translate: '',
    learn: {
        learnProgress: 0,
        lastLearn: '',
        nextLearn: '',
        isExcluded: false,
        result1: 'none'
    }
} satisfies Word

const words: Words = {
    '1': {
        key: '1',
        word: 'word 1',
        translate: 'translate 1',
        learn: {
            learnProgress: 10,
            lastLearn: '01.02.2025 12:24',
            nextLearn: '01.03.2025 12:24',
            isExcluded: false,
            result1: 'none'
        }
    } satisfies Word,
    '2': {
        key: '2',
        word: 'word 2',
        translate: 'translate 2',
        learn: {
            learnProgress: 20,
            lastLearn: '01.02.2025 12:24',
            nextLearn: '01.03.2025 12:24',
            isExcluded: false,
            result1: 'none'
        }
    } satisfies Word,
    '3': {
        key: '3',
        word: 'word 3',
        translate: 'translate 3',
        learn: {
            learnProgress: 5,
            lastLearn: '05.02.2025 12:24',
            nextLearn: '01.03.2025 12:24',
            isExcluded: false,
            result1: 'none'
        }
    } satisfies Word,
    '4': {
        key: '4',
        word: 'word 4',
        translate: 'translate 4',
        learn: {
            learnProgress: 0,
            lastLearn: '',
            nextLearn: '',
            isExcluded: false,
            result1: 'none'
        }
    } satisfies Word,
}

const initialDictionaryState = {
    words: words
}

export const dictionarySlice = createSlice({
    name: 'dictionarySlice',
    initialState: initialDictionaryState,
    reducers: {
        addWord: (draftState, action: PayloadAction<DictionaryWord>) => {
            const key = genUniqueId()
            let item = {
                ...defaultObj,
                ...action.payload,
                key: key,
            } satisfies Word

            draftState.words[key] = item
        },
        editWord: (draftState, action: PayloadAction<DictionaryWord>) => {
            const item = { ...action.payload }

            draftState.words[item.key] = {
                ...draftState.words[item.key],
                ...item
            } satisfies Word
        },
        deleteWord: (draftState, action: PayloadAction<string>) => {
            delete draftState.words[action.payload]
        },
        setCardWordResults: (draftState, action: PayloadAction<CardWord[]>) => {
            const cardWords = action.payload

            let nextLearnDate = new Date(Date.now())
            nextLearnDate.setHours(nextLearnDate.getHours() + 24)

            cardWords.forEach(c => {
                draftState.words[c.key] = {
                    ...draftState.words[c.key],
                    learn: {
                        ...draftState.words[c.key].learn,
                        learnProgress: c.result1 === 'IsRemembered' ? 50 : 0,
                        lastLearn: new Date(Date.now()).toUTCString(),
                        nextLearn: nextLearnDate.toUTCString(),
                        result1: c.result1,
                        isExcluded: c.isExcluded
                    } satisfies Learn
                } satisfies Word
            })
        }
    },
})

//-------------------------------------

export const { addWord, editWord, deleteWord,
    setCardWordResults,
} = dictionarySlice.actions

export const dictionaryReducers = dictionarySlice.reducer

//-------------------------------------

function mapToDictionaryWord(i: Word) {
    return {
        key: i.key,
        word: i.word,
        translate: i.translate,
    } satisfies DictionaryWord
}

function mapToCardWordWithClearResult(i: Word): CardWord {
    return {
        key: i.key,
        word: i.word,
        translate: i.translate,
        result1: 'none',
        isExcluded: false,
    } satisfies CardWord
}

function DateStrParse(value: string): number {
    return (value && value.length > 0) ? Date.parse(value) : 0
}

//-------------------------------------

export const selectDictionaryWords = createSelector(
    [
        (state: RootState) => state.dictionary.words
    ],
    (words) => {
        return Object.values(words).map(i => mapToDictionaryWord(i))
    }
)

export const selectCardWordsByNextLearn = createSelector(
    [
        (state: RootState) => state.dictionary.words,
        (_: RootState, top: number) => top
    ],
    (words, top) => {
        return Object.values(words)
            .filter(w => !w.learn.isExcluded)
            .sort((a, b) => {
                return DateStrParse(a.learn.nextLearn) -
                    DateStrParse(b.learn.nextLearn)
            })
            .slice(0, top)
            .map(mapToCardWordWithClearResult)
    }
)

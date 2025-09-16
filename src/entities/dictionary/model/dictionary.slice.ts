import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { dateHelper, randomHelper } from '@shared/lib/helpers'
import {
    DEFAULT_SESSION, DEFAULT_WORD, DEFAULT_WORD_LAST_LEARN_RESULT, INITIAL_DICTIONARY_STATE,
    MAX_CORRECT_ANSWER_COUNT, MAX_CORRECT_READ_COUNT, MAX_CORRECT_SELECT_COUNT,
    MAX_CORRECT_WRITE_COUNT
} from '../constants'
import { Session } from '../types/session'
import { Word } from '../types/word'
import { WordCardResult } from '../types/word-card-result'
import { WordCardResultShort } from '../types/word-card-result-short'
import { WordLastLearnResult } from '../types/word-last-learn-result'
import { WordShort } from '../types/word-short'
import { wordCardsGenerator } from './word-card-generator'
import { wordMapper } from './word-mapper'


export const dictionarySlice = createSlice({
    name: 'dictionarySlice',
    initialState: INITIAL_DICTIONARY_STATE,
    selectors: {
        selectWordCards: (state) => state.words
    },
    reducers: {
        addWord: (draftState, action: PayloadAction<WordShort>) => {
            const key = randomHelper.genUniqueId()
            let item = {
                ...DEFAULT_WORD,
                ...action.payload,
                key: key,
            } satisfies Word

            draftState.words[key] = item
        },
        editWord: (draftState, action: PayloadAction<WordShort>) => {
            const item = { ...action.payload }

            draftState.words[item.key] = {
                ...draftState.words[item.key],
                ...item
            } satisfies Word
        },
        deleteWord: (draftState, action: PayloadAction<string>) => {
            delete draftState.words[action.payload]

        },
        setWordStatistics: (draftState, action: PayloadAction<WordCardResult>) => {
            const wcr = action.payload

            let { statistics } = draftState.words[wcr.key]
            statistics.isExcluded = wcr.isExcluded

            if (statistics.sessionKey !== wcr.sessionKey) {
                const lastLearnDay = statistics.learnDay
                statistics.learnDay = 2.5 * lastLearnDay + 1
                statistics.nextLearnAfterDays = Math.trunc(statistics.learnDay - lastLearnDay)
                statistics.lastLearn = dateHelper.toUTCString(dateHelper.getDateNowUTC())
                statistics.nextLearn = dateHelper.toUTCString(dateHelper.addUTCDays(statistics.lastLearn, statistics.nextLearnAfterDays))

                statistics.sessionKey = wcr.sessionKey
            }

            wcr.cardType === 'Readable' && wcr.cardResult && statistics.readCount++
            wcr.cardType === 'Selectable' && wcr.cardResult && statistics.selectCount++
            wcr.cardType === 'Writable' && wcr.cardResult && statistics.writeCount++

            statistics.memoPercent = Math.floor(
                (statistics.readCount + statistics.selectCount + statistics.writeCount)
                * 100 / MAX_CORRECT_ANSWER_COUNT
            )

            statistics.isLearned = statistics.readCount >= MAX_CORRECT_READ_COUNT
                && statistics.selectCount >= MAX_CORRECT_SELECT_COUNT
                && statistics.writeCount >= MAX_CORRECT_WRITE_COUNT
        },
        resetSession: (draftState, action: PayloadAction<number>) => {
            const learningPartSize = action.payload
            const wordCards = wordCardsGenerator.genWordCards(draftState.words, learningPartSize)

            draftState.session = {
                ...draftState.session,
                ...DEFAULT_SESSION,
                wordCards,
                key: randomHelper.genUniqueId(),
            } satisfies Session as Session
        },
        setSessionWordCardResult: (draftState, action: PayloadAction<WordCardResultShort>) => {
            const { cardResult, cardType } = action.payload
            const { wordCardNum, wordCards, results } = draftState.session

            //get existed element or create new element
            let wordResults = results.find(lr => lr.key === wordCards[wordCardNum].key)
            wordResults = wordResults ?? { ...DEFAULT_WORD_LAST_LEARN_RESULT } as WordLastLearnResult

            wordResults.key = wordCards[wordCardNum].key
            wordResults.isExcluded = typeof cardResult === 'undefined'

            cardType === 'Readable' && cardResult === true && wordResults.readResult++
            cardType === 'Selectable' && cardResult === true && wordResults.selectResult++
            cardType === 'Writable' && cardResult === true && wordResults.writeResult++

            const word = draftState.words[wordResults.key]
            const wordResultsUpdated = wordMapper.mapToWordsLastLearnResult(word, wordResults)

            draftState.session.results = [...results.filter(lr => lr.key !== wordCards[wordCardNum].key), wordResultsUpdated]
            //if is excluded then exclude it from all cards
            if (wordResultsUpdated.isExcluded)
                draftState.session.wordCards = wordCards.filter(i => i.key !== wordResultsUpdated.key)

            if (cardResult)
                draftState.session.totalCorrectAnswerCount++

            draftState.session.totalAnswerCount++
            draftState.session.totalCorrectAnswerPercent =
                draftState.session.totalCorrectAnswerCount * 100 / draftState.session.totalAnswerCount

            draftState.session.wordCardNum++
        }

    },
})

//-------------------------------------

export const {
    addWord, editWord, deleteWord, setWordStatistics,
    resetSession, setSessionWordCardResult
} = dictionarySlice.actions

export const dictionaryReducers = dictionarySlice.reducer
import { addUTCDays, DateStrParse, getDateNowUTC, toUTCString } from '@/shared/dateHelper'
import { genUniqueId, randomSortFn } from '@/shared/randomHelper'
import { isEmpty } from '@/shared/stringHelper'
import { RootState } from '@/store/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DictionaryWord, Word, Words } from './dictionary.entities'
import { defaultObj, initialState } from './dictionary.init'
import {
    mapToAnswerSelectableArr, mapToDictionaryWord, mapToWordCardReadable,
    mapToWordCardSelectable, mapToWordCardWritable, mapToWordsLastLearnResult
} from './dictionary.mappers'
import {
    MAX_CORRECT_ANSWER_COUNT, MAX_CORRECT_READ_COUNT, MAX_CORRECT_SELECT_COUNT,
    MAX_CORRECT_WRITE_COUNT, SelectableMode, Session, WORD_CARD_SELECTABLE_ANSWER_COUNT, WordCard,
    WordCardResult, WordCardResultShort, WordsLastLearnResult
} from './session.entities'
import { defaultSession, defaultWordsLastLearnResult } from './session.init'


export const dictionarySlice = createSlice({
    name: 'dictionarySlice',
    initialState,
    selectors: {
        selectWordCards: (state) => state.words
    },
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
        setWordStatistics: (draftState, action: PayloadAction<WordCardResult>) => {
            const wcr = action.payload

            let { statistics } = draftState.words[wcr.key]
            statistics.isExcluded = wcr.isExcluded

            if (statistics.sessionKey !== wcr.sessionKey) {
                const lastLearnDay = statistics.learnDay
                statistics.learnDay = 2.5 * lastLearnDay + 1
                statistics.nextLearnAfterDays = Math.trunc(statistics.learnDay - lastLearnDay)
                statistics.lastLearn = toUTCString(getDateNowUTC())
                statistics.nextLearn = toUTCString(addUTCDays(statistics.lastLearn, statistics.nextLearnAfterDays))

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
            const wordCards = genWordCards(draftState.words, learningPartSize)

            draftState.session = {
                ...draftState.session,
                ...defaultSession,
                wordCards,
                key: genUniqueId(),
            } satisfies Session as Session
        },
        setSessionWordCardResult: (draftState, action: PayloadAction<WordCardResultShort>) => {
            const { cardResult, cardType } = action.payload
            const { wordCardNum, wordCards, results } = draftState.session

            //get existed element or create new element
            let wordResults = results.find(lr => lr.key === wordCards[wordCardNum].key)
            wordResults = wordResults ?? { ...defaultWordsLastLearnResult } as WordsLastLearnResult

            wordResults.key = wordCards[wordCardNum].key
            wordResults.isExcluded = typeof cardResult === 'undefined'

            cardType === 'Readable' && cardResult === true && wordResults.readResult++
            cardType === 'Selectable' && cardResult === true && wordResults.selectResult++
            cardType === 'Writable' && cardResult === true && wordResults.writeResult++

            const word = draftState.words[wordResults.key]
            const wordResultsUpdated = mapToWordsLastLearnResult(word, wordResults)

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

//-------------------------------------

export const selectDictionaryWords = createSelector(
    [
        (state: RootState) => state.dictionary.words
    ],
    (words) => {
        return Object.values(words).map(i => mapToDictionaryWord(i))
    }
)

const getWordsForLearnTop = (words: Words, top: number) => {
    const now = getDateNowUTC()
    const wordsTop = Object.values(words)
        .filter(w => !w.statistics.isExcluded && !w.statistics.isLearned
            && (isEmpty(w.statistics.nextLearn) || now >= new Date(w.statistics.nextLearn)))
        .sort((a, b) => {
            return DateStrParse(a.statistics.nextLearn) -
                DateStrParse(b.statistics.nextLearn)
        })
        .slice(0, top)

    return wordsTop
}

const getRandomWordsTop = (words: Words, mode: SelectableMode, excludeWord: Word, top: number) => {
    const wordsTop = Object.values(words)
        .filter(i => mode === 'WordSelect'
            ? i.word !== excludeWord.word
            : i.translate !== excludeWord.translate)
        .sort(randomSortFn)
        .slice(0, top - 1)

    return wordsTop
}

const genWordCards = (words: Words, top: number) => {
    const wordsTop = getWordsForLearnTop(words, top)

    let wordCards: (WordCard)[] = []

    //Readable
    wordCards = [...wordCards, ...wordsTop
        .filter(i => i.statistics.readCount < MAX_CORRECT_READ_COUNT)
        .map(i => mapToWordCardReadable(i, 'Review'))]

    wordCards = [...wordCards, ...wordsTop
        .filter(i => i.statistics.readCount < MAX_CORRECT_READ_COUNT)
        .map(i => mapToWordCardReadable(i, 'withHidedWord'))]

    wordCards = [...wordCards, ...wordsTop
        .filter(i => i.statistics.readCount < MAX_CORRECT_READ_COUNT)
        .map(i => mapToWordCardReadable(i, 'withHidedTranslate'))]

    //Selectable
    wordCards = [...wordCards, ...wordsTop
        .filter(i => i.statistics.readCount < MAX_CORRECT_SELECT_COUNT)
        .map(i => {
            const wrongAnswers = getRandomWordsTop(words, 'WordSelect', i, WORD_CARD_SELECTABLE_ANSWER_COUNT)
            const answers = mapToAnswerSelectableArr(i, wrongAnswers, 'WordSelect')
            return mapToWordCardSelectable(i, 'WordSelect', answers)
        })]

    wordCards = [...wordCards, ...wordsTop
        .filter(i => i.statistics.readCount < MAX_CORRECT_SELECT_COUNT)
        .map(i => {
            const wrongAnswers = getRandomWordsTop(words, 'TranslateSelect', i, WORD_CARD_SELECTABLE_ANSWER_COUNT)
            const answers = mapToAnswerSelectableArr(i, wrongAnswers, 'TranslateSelect')
            return mapToWordCardSelectable(i, 'TranslateSelect', answers)
        })]

    //Writable
    wordCards = [...wordCards, ...wordsTop
        .filter(i => i.statistics.readCount < MAX_CORRECT_WRITE_COUNT)
        .map(i => mapToWordCardWritable(i))]

    return wordCards
}

export const selectSession = (state: RootState) => state.dictionary.session
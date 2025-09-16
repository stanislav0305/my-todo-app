import { dateHelper, randomHelper, stringHelper } from '@shared/lib/helpers'
import {
    MAX_CORRECT_READ_COUNT, MAX_CORRECT_SELECT_COUNT, MAX_CORRECT_WRITE_COUNT,
    WORD_CARD_SELECTABLE_ANSWER_COUNT
} from '../constants'
import { SelectableMode } from '../types/selectable-mode'
import { Word } from '../types/word'
import { WordCard } from '../types/word-card'
import { Words } from '../types/words'
import { wordMapper } from './word-mapper'


export const wordCardsGenerator = {
    getWordsForLearnTop: (words: Words, top: number) => {
        const now = dateHelper.getDateNowUTC()
        const wordsTop = Object.values(words)
            .filter(w => !w.statistics.isExcluded && !w.statistics.isLearned
                && (stringHelper.isEmpty(w.statistics.nextLearn) || now >= new Date(w.statistics.nextLearn)))
            .sort((a, b) => {
                return dateHelper.DateStrParse(a.statistics.nextLearn) -
                    dateHelper.DateStrParse(b.statistics.nextLearn)
            })
            .slice(0, top)

        return wordsTop
    },

    getRandomWordsTop: (words: Words, mode: SelectableMode, excludeWord: Word, top: number) => {
        const wordsTop = Object.values(words)
            .filter(i => mode === 'WordSelect'
                ? i.word !== excludeWord.word
                : i.translate !== excludeWord.translate)
            .sort(randomHelper.randomSortFn)
            .slice(0, top - 1)

        return wordsTop
    },
    genWordCards: (words: Words, top: number) => {
        const wordsTop = wordCardsGenerator.getWordsForLearnTop(words, top)
        let wordCards: (WordCard)[] = []

        //Readable
        wordCards = [...wordCards, ...wordsTop
            .filter(i => i.statistics.readCount < MAX_CORRECT_READ_COUNT)
            .map(i => wordMapper.mapToWordCardReadable(i, 'Review'))]

        wordCards = [...wordCards, ...wordsTop
            .filter(i => i.statistics.readCount < MAX_CORRECT_READ_COUNT)
            .map(i => wordMapper.mapToWordCardReadable(i, 'withHidedWord'))]

        wordCards = [...wordCards, ...wordsTop
            .filter(i => i.statistics.readCount < MAX_CORRECT_READ_COUNT)
            .map(i => wordMapper.mapToWordCardReadable(i, 'withHidedTranslate'))]

        //Selectable
        wordCards = [...wordCards, ...wordsTop
            .filter(i => i.statistics.readCount < MAX_CORRECT_SELECT_COUNT)
            .map(i => {
                const wrongAnswers = wordCardsGenerator.getRandomWordsTop(words, 'WordSelect', i, WORD_CARD_SELECTABLE_ANSWER_COUNT)
                const answers = wordMapper.mapToAnswerSelectableArr(i, wrongAnswers, 'WordSelect')
                return wordMapper.mapToWordCardSelectable(i, 'WordSelect', answers)
            })]

        wordCards = [...wordCards, ...wordsTop
            .filter(i => i.statistics.readCount < MAX_CORRECT_SELECT_COUNT)
            .map(i => {
                const wrongAnswers = wordCardsGenerator.getRandomWordsTop(words, 'TranslateSelect', i, WORD_CARD_SELECTABLE_ANSWER_COUNT)
                const answers = wordMapper.mapToAnswerSelectableArr(i, wrongAnswers, 'TranslateSelect')
                return wordMapper.mapToWordCardSelectable(i, 'TranslateSelect', answers)
            })]

        //Writable
        wordCards = [...wordCards, ...wordsTop
            .filter(i => i.statistics.readCount < MAX_CORRECT_WRITE_COUNT)
            .map(i => wordMapper.mapToWordCardWritable(i))]

        return wordCards
    }
}
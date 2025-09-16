import { randomHelper } from '@shared/lib/helpers'
import { AnswerSelectable } from '../types/answer-selectable'
import { ReadableMode } from '../types/readable-mode'
import { SelectableMode } from '../types/selectable-mode'
import { Word } from '../types/word'
import { WordCardReadable } from '../types/word-card-readable'
import { WordCardSelectable } from '../types/word-card-selectable'
import { WordCardWritable } from '../types/word-card-writable'
import { WordLastLearnResult } from '../types/word-last-learn-result'
import { WordShort } from '../types/word-short'


export const wordMapper = {
    mapToDictionaryWord: (i: Word) => {
        return {
            key: i.key,
            word: i.word,
            translate: i.translate,
        } satisfies WordShort as WordShort
    },
    mapToWordCardReadable: (i: Word, mode: ReadableMode): WordCardReadable => {
        const arr = ['Review', 'withHidedTranslate'] as ReadableMode[]
        return {
            key: i.key,
            isExcluded: false,
            question: arr.includes(mode) ? i.word : i.translate,
            answer: arr.includes(mode) ? i.translate : i.word,
            mode,
        } satisfies WordCardReadable as WordCardReadable
    },
    mapToWordCardSelectable: (i: Word, mode: SelectableMode, answers: AnswerSelectable[]): WordCardSelectable => {
        return {
            key: i.key,
            isExcluded: false,
            question: mode === 'WordSelect' ? i.translate : i.word,
            answers,
            mode,
        } satisfies WordCardSelectable as WordCardSelectable
    },
    mapToWordCardWritable: (i: Word): WordCardWritable => {
        return {
            key: i.key,
            isExcluded: false,
            question: i.translate,
            answer: i.word,
        } satisfies WordCardWritable as WordCardWritable
    },
    mapToAnswerSelectableArr: (item: Word, wrongAnswers: Word[], mode: SelectableMode): AnswerSelectable[] => {
        const correctAnswer = wordMapper.mapToAnswerSelectable(item, mode, true)
        const wrongAnswersMapped = wrongAnswers.map(i => wordMapper.mapToAnswerSelectable(i, mode, false))

        const answers = [correctAnswer, ...wrongAnswersMapped]
            .sort(randomHelper.randomSortFn)

        return answers
    },
    mapToAnswerSelectable: (item: Word, mode: SelectableMode, isCorrect: boolean): AnswerSelectable => {
        return {
            answer: mode === 'WordSelect' ? item.word : item.translate,
            isCorrect
        } satisfies AnswerSelectable as AnswerSelectable
    },
    mapToWordsLastLearnResult: (w: Word, r: WordLastLearnResult) => {
        return {
            ...r,
            word: w.word,
            isLearned: w.statistics.isLearned,
            memoPercent: w.statistics.memoPercent,
            nextLearnAfterDays: w.statistics.nextLearnAfterDays,
            nextLearn: w.statistics.nextLearn,
        } satisfies WordLastLearnResult as WordLastLearnResult
    }
}
import { randomSortFn } from "@/shared/randomHelper"
import { DictionaryWord, Word } from "./dictionary.entities"
import { AnswerSelectable, ReadableMode, SelectableMode, WordCardReadable, WordCardSelectable, WordCardWritable, WordsLastLearnResult } from "./session.entities"


export function mapToDictionaryWord(i: Word) {
    return {
        key: i.key,
        word: i.word,
        translate: i.translate,
    } satisfies DictionaryWord
}

export function mapToWordCardReadable(i: Word, mode: ReadableMode): WordCardReadable {
    const arr = ['Review', 'withHidedTranslate'] as ReadableMode[]
    return {
        key: i.key,
        isExcluded: false,
        question: arr.includes(mode) ? i.word : i.translate,
        answer: arr.includes(mode) ? i.translate : i.word,
        mode,
    } satisfies WordCardReadable
}

export function mapToWordCardSelectable(i: Word, mode: SelectableMode, answers: AnswerSelectable[]): WordCardSelectable {
    return {
        key: i.key,
        isExcluded: false,
        question: mode === 'WordSelect' ? i.translate : i.word,
        answers,
        mode,
    } satisfies WordCardSelectable
}

export function mapToWordCardWritable(i: Word): WordCardWritable {
    return {
        key: i.key,
        isExcluded: false,
        question: i.translate,
        answer: i.word,
    } satisfies WordCardWritable
}

export function mapToAnswerSelectableArr(item: Word, wrongAnswers: Word[], mode: SelectableMode): AnswerSelectable[] {
    const correctAnswer = mapToAnswerSelectable(item, mode, true)
    const wrongAnswersMapped = wrongAnswers.map(i => mapToAnswerSelectable(i, mode, false))

    const answers = [correctAnswer, ...wrongAnswersMapped]
        .sort(randomSortFn)

    return answers
}

export function mapToAnswerSelectable(item: Word, mode: SelectableMode, isCorrect: boolean): AnswerSelectable {
    return {
        answer: mode === 'WordSelect' ? item.word : item.translate,
        isCorrect
    } satisfies AnswerSelectable
}

export function mapToWordsLastLearnResult(w: Word, r: WordsLastLearnResult) {
    return {
        ...r,
        word: w.word,
        isLearned: w.statistics.isLearned,
        memoPercent: w.statistics.memoPercent,
        nextLearnAfterDays: w.statistics.nextLearnAfterDays,
        nextLearn: w.statistics.nextLearn,
    } satisfies WordsLastLearnResult as WordsLastLearnResult
}
import { SessionResult } from './session.result'

export const WORD_CARD_SELECTABLE_ANSWER_COUNT = 5 //display wrong answer count in selectable card
export const MAX_CORRECT_READ_COUNT = 3 //count of correct answers when the word will be considered learned for WordCardReadable
export const MAX_CORRECT_SELECT_COUNT = 8 //count of correct answers when the word will be considered learned for WordCardSelectable
export const MAX_CORRECT_WRITE_COUNT = 8 //count of correct answers when the word will be considered learned for WordCardWritable
export const MAX_CORRECT_ANSWER_COUNT = MAX_CORRECT_READ_COUNT + MAX_CORRECT_SELECT_COUNT + MAX_CORRECT_WRITE_COUNT

//--------------------------------------------------------

export interface WordCardBase {
    key: string
    isExcluded: boolean
    question: string
}

export interface WordCardReadable extends WordCardBase {
    answer: string
    mode: ReadableMode
}

export interface WordCardSelectable extends WordCardBase {
    answers: AnswerSelectable[]
    mode: SelectableMode
}

export interface WordCardWritable extends WordCardBase {
    answer: string
}

//--------------------------------------------------------

export interface AnswerSelectable {
    answer: string,
    isCorrect: boolean
}

//--------------------------------------------------------

export const ReadableModeArr = ['Review', 'withHidedWord', 'withHidedTranslate'] as const
export type ReadableMode = typeof ReadableModeArr[number]
export const ReadableModeValues = [...ReadableModeArr];

export const SelectableModeArr = ['WordSelect', 'TranslateSelect'] as const
export type SelectableMode = typeof SelectableModeArr[number]

export type WordCard = WordCardReadable | WordCardSelectable | WordCardWritable
export type CardType = 'Readable' | 'Selectable' | 'Writable' //| 'Listenable'

//--------------------------------------------------------

export interface Session {
    key: string
    wordCardNum: number //current word card number
    wordCards: WordCard[]
    results: WordsLastLearnResult[]
    totalCorrectAnswerCount: number
    totalAnswerCount: number
    totalCorrectAnswerPercent: number
    totalResult: SessionResult
}

export interface WordsLastLearnResult {
    key: string
    word: string
    isExcluded: boolean
    isLearned: boolean

    readResult: number
    selectResult: number
    writeResult: number

    memoPercent: number
    nextLearnAfterDays: number
    nextLearn: string
}

export interface WordCardResultShort {
    cardType: CardType,
    cardResult?: boolean
}

//--------------------------------------------------------
//result sended to dictionary slice
export interface WordCardResult {
    key: string
    sessionKey: string
    cardType: CardType
    isExcluded: boolean
    cardResult: boolean
}

//--------------------------------------------------------

export function isWordCardReadable(obj: WordCard)
    : obj is WordCardReadable {
    const mode = (obj as WordCardReadable).mode

    return ((typeof mode != 'undefined') && ReadableModeArr.includes(mode))
}

export function isWordCardSelectable(obj: WordCard)
    : obj is WordCardSelectable {
    const mode = (obj as WordCardSelectable).mode

    return ((typeof mode != 'undefined') && SelectableModeArr.includes(mode))
}

export function isWordCardWritable(obj: WordCard)
    : obj is WordCardWritable {
    return !isWordCardReadable(obj) && !isWordCardSelectable(obj)
}

export function getWordCardType(obj: WordCard): CardType {
    if (isWordCardReadable(obj)) return 'Readable'
    
    if (isWordCardSelectable(obj)) return 'Selectable'

    if (isWordCardWritable(obj)) return 'Writable'
    else
        throw new Error('WordCard type is not detected if function getWordCardType')
}

//--------------------------------------------------------
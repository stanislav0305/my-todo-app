import { ReadableMode } from './readable-mode'
import { WordCardBase } from './word-card-base'


export interface WordCardReadable extends WordCardBase {
    answer: string
    mode: ReadableMode
}
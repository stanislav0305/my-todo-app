import { AnswerSelectable } from './answer-selectable'
import { SelectableMode } from './selectable-mode'
import { WordCardBase } from './word-card-base'


export interface WordCardSelectable extends WordCardBase {
    answers: AnswerSelectable[]
    mode: SelectableMode
}
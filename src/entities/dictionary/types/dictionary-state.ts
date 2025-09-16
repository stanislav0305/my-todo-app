import { Session } from './session'
import { Words } from './words'


export interface DictionaryState {
        words: Words,
        session: Session,
}
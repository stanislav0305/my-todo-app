import { CardType } from './card-type'


//result sended to dictionary slice
export interface WordCardResult {
    key: string
    sessionKey: string
    cardType: CardType
    isExcluded: boolean
    cardResult: boolean
}
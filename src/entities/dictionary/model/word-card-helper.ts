import { CardType } from '../types/card-type'
import { ReadableModeArr } from '../types/readable-mode'
import { SelectableModeArr } from '../types/selectable-mode'
import { WordCard } from '../types/word-card'
import { WordCardReadable } from '../types/word-card-readable'
import { WordCardSelectable } from '../types/word-card-selectable'
import { WordCardWritable } from '../types/word-card-writable'


export const wordCardHelper = {
    isWordCardReadable: (obj: WordCard)
        : obj is WordCardReadable => {
        const mode = (obj as WordCardReadable).mode

        return ((typeof mode != 'undefined') && ReadableModeArr.includes(mode))
    },
    isWordCardSelectable: (obj: WordCard)
        : obj is WordCardSelectable => {
        const mode = (obj as WordCardSelectable).mode

        return ((typeof mode != 'undefined') && SelectableModeArr.includes(mode))
    },
    isWordCardWritable: (obj: WordCard)
        : obj is WordCardWritable => {
        return !wordCardHelper.isWordCardReadable(obj) && !wordCardHelper.isWordCardSelectable(obj)
    },
    getWordCardType: (obj: WordCard): CardType => {
        if (wordCardHelper.isWordCardReadable(obj)) return 'Readable'
        if (wordCardHelper.isWordCardSelectable(obj)) return 'Selectable'
        if (wordCardHelper.isWordCardWritable(obj)) return 'Writable'
        else
            throw new Error('WordCard type is not detected if function getWordCardType')
    }
}
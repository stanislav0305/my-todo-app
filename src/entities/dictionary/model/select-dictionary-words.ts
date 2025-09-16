import { createSelector } from '@reduxjs/toolkit'
import { wordMapper } from './word-mapper'


export const selectDictionaryWords = createSelector(
    [
        (state: RootState) => state.dictionary.words
    ],
    (words) => {
        return Object.values(words).map(i => wordMapper.mapToDictionaryWord(i))
    }
)
import { createSlice } from '@reduxjs/toolkit'

const initialTasksState = {

}

export const tasksSlice = createSlice({
name: 'tasksSlice',
initialState: initialTasksState,
selectors: {},
reducers: {}
})

/*
import { RootState } from '@/store/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import genUniqueId from '@/shared/uniqueIdGenerator'


export type Word = {
    key: string
    word: string,
    translate: string
}



const initialDictionaryState = {
   
    words: [
        {
            key: '1',
            word: 'word 1',
            translate: 'translate 1'
        } satisfies Word,
        {
            key: '2',
            word: 'word 2',
            translate: 'translate 2'
        } satisfies Word,
        {
            key: '3',
            word: 'word 3',
            translate: 'translate 3'
        } satisfies Word,
        {
            key: '4',
            word: 'word 4',
            translate: 'translate 4'
        } satisfies Word,
    ]
}


type z = typeof initialDictionaryState.words
type keys = keyof z


export const dictionarySlice = createSlice({
    name: 'dictionarySlice',
    initialState: initialDictionaryState,

    reducers: {
        addWord: (draftState, action: PayloadAction<Word>) => {
            let item = action.payload
            item.key = genUniqueId()

            draftState.words.push(item)
        },
        editWord: (draftState, action: PayloadAction<Word>) => {
            const item = action.payload

            let index = draftState.words.findIndex(i => i.key === item.key)
            draftState.words[index] = {
                ...draftState.words[index],
                ...item
            }
        },
        deleteWord: (draftState, action: PayloadAction<string>) => {
            draftState.words = draftState.words.filter(i => i.key !== action.payload)
        }
    },
})

export const { addWord, editWord, deleteWord } = dictionarySlice.actions
export const dictionaryReducers = dictionarySlice.reducer
export const selectWords = (state: RootState) => {
    let result =
        state.dictionary.words
            .filter(i => i.)
            .includes())

    return result
}
    */
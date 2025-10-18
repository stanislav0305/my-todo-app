import { ModificationType } from '@/src/shared/lib/types'
import {
    DEFAULT_WORD_SHORT,
    WordShort,
    addWord, deleteWord, editWord
} from '@entities/dictionary'
import { WordEditFormModal } from '@features/word-edit'
import { WordList } from '@features/word-list'
import { useAppDispatch } from '@shared/lib/hooks'
import { RemoveFormModal } from '@shared/ui/remove-form-modal'
import { useState } from 'react'
import { Button } from 'react-native-paper'


interface PageState {
    mode: ModificationType,
    item: WordShort
}

export const WordListWidget = () => {
    const dispatch = useAppDispatch()

    const [modeData, setModeData] = useState<PageState>({
        mode: 'none',
        item: { ...DEFAULT_WORD_SHORT } as WordShort
    })

    const changeMode = (mode: ModificationType = 'none', item: WordShort = { ...DEFAULT_WORD_SHORT } as WordShort) => {
        setModeData({
            ...modeData,
            mode: mode,
            item: item
        })
    }

    return (
        <>
            <Button
                onPress={() => changeMode('edit')}
                icon={{ source: 'plus-thick', direction: 'ltr' }}
                mode='contained'
            >
                Add word
            </Button>
            <WordList onChange={changeMode} />
            {modeData.mode === 'edit' &&
                <WordEditFormModal
                    item={modeData.item}
                    onChangeItem={(newItem: WordShort) => {
                        dispatch(newItem.key ? editWord(newItem) : addWord(newItem))
                        changeMode()
                    }}
                    onClose={changeMode}
                />
            }
            {modeData.mode === 'remove' &&
                <RemoveFormModal
                    itemKey={modeData.item.key}
                    questionText={`Do you really want to delete '${modeData.item.word}' 
                                        by key '${modeData.item.key}'?`}
                    onDelete={(key: string) => {
                        dispatch(deleteWord(key))
                        changeMode()
                    }}
                    onClose={changeMode}
                />
            }
        </>
    )
}
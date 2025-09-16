import { ModificationType } from '@/src/shared/lib/types'
import { WordShort, selectDictionaryWords } from '@entities/dictionary'
import { useAppSelector } from '@shared/lib/hooks'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { WordListItem } from './list-item'


type Props = {
    onChange: (mode: ModificationType, item: WordShort) => void
}

export const WordList = ({ onChange }: Props) => {
    const items = useAppSelector(selectDictionaryWords)

    return (
        <FlatList
            data={items}
            keyExtractor={((item: WordShort, index: number) => item.key)}
            renderItem={(itemInfo: ListRenderItemInfo<WordShort>) =>
                <WordListItem
                    item={itemInfo.item}
                    onChange={onChange}
                />
            }
        />
    )
}
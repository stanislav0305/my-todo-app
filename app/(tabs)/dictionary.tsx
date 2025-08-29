import ScreenLayout from '@/app/_screen-layout'
import DeleteWordModal from '@/components/dictionary/DeleteWordModal'
import EditWordModal from '@/components/dictionary/EditWordModal'
import { useAppDispatch } from '@/hooks/store/useAppDispatch'
import { useAppSelector } from '@/hooks/store/useAppSelector'
import {
  addWord, deleteWord, DictionaryWord, editWord,
  selectDictionaryWords
} from '@/store/dictionary.slice'
import { useState } from 'react'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { Button, Text } from 'react-native-paper'


type ModeType = 'edit' | 'delete' | 'none'
interface PageState {
  mode: ModeType,
  item: DictionaryWord
}

export default function DictionaryScreen() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectDictionaryWords)

  const [modeData, setModeData] = useState<PageState>({
    mode: 'none',
    item: {} as DictionaryWord
  })

  const changeMode = (mode: ModeType = 'none', item: DictionaryWord = {} as DictionaryWord) => {
    setModeData({
      ...modeData,
      mode: mode,
      item: item
    })
  }

  return (
    <ScreenLayout>
      <Button
        onPress={() => changeMode('edit')}
        icon={{ source: 'plus-thick', direction: 'ltr' }}
        mode='contained'
      >
        Add word
      </Button>
      <FlatList
        data={items}
        keyExtractor={((item: DictionaryWord, index: number) => item.key)}
        renderItem={(itemInfo: ListRenderItemInfo<DictionaryWord>) => {
          let item = itemInfo.item
          return (
            <View>
              <Text variant='bodyLarge'>{item.word}</Text>
              <Text variant='bodyMedium'>{item.translate}</Text>
              <Button
                onPress={() => changeMode('edit', item)}
                icon={{ source: 'pencil', direction: 'ltr' }}
                mode='contained'>
                Edit word
              </Button>
              <Button
                onPress={() => changeMode('delete', item)}
                icon={{ source: 'trash-can', direction: 'ltr' }}
                mode='outlined'
              >
                Delete word
              </Button>
            </View>
          )
        }
        }
      />

      {
        modeData.mode === 'edit' &&
        <EditWordModal
          item={modeData.item}
          onChangeItem={(newItem: DictionaryWord) => {
            dispatch(newItem.key ? editWord(newItem) : addWord(newItem))
            changeMode()
          }}
          onClose={changeMode}
        />
      }
      {
        modeData.mode === 'delete' &&
        <DeleteWordModal
          itemKey={modeData.item.key}
          word={modeData.item.word}
          onDelete={(key: string) => { dispatch(deleteWord(key)); changeMode() }}
          onClose={changeMode}
        />
      }
    </ScreenLayout>
  )
}
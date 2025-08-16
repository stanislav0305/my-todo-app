import DeleteWordModal from '@/components/dictionary/DeleteWordModal'
import EditWordModal from '@/components/dictionary/EditWordModal'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useAppDispatch } from '@/hooks/store/useAppDispatch'
import { useAppSelector } from '@/hooks/store/useAppSelector'
import {
  addWord, deleteWord, DictionaryWord, editWord,
  selectDictionaryWords
} from '@/store/dictionary.slice'
import { Link } from 'expo-router'
import { useState } from 'react'
import { Button, FlatList, ListRenderItemInfo, StyleSheet } from 'react-native'


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
    <>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type='title'>Dictionary</ThemedText>
        </ThemedView>
        <ThemedText>This is word list.</ThemedText>
        <Link href='/words-learning' style={styles.link}>
          <ThemedText type='link'>Go to learn words</ThemedText>
        </Link>
        <Button title='Add word' onPress={() => changeMode('edit')} />
        <FlatList
          data={items}
          keyExtractor={((item: DictionaryWord, index: number) => item.key)}
          renderItem={(itemInfo: ListRenderItemInfo<DictionaryWord>) => {
            let item = itemInfo.item
            return (
              <ThemedView style={styles.container} >
                <ThemedText type='defaultSemiBold'>{item.word}</ThemedText>
                <ThemedText>{item.translate}</ThemedText>
                <Button title='Edit word' onPress={() => changeMode('edit', item)} />
                <Button title='Delete word' onPress={() => changeMode('delete', item)} />
              </ThemedView>
            )
          }
          }
        />
      </ThemedView >

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
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
})
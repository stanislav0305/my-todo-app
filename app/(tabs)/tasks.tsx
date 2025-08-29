import ScreenLayout from '@/app/_screen-layout'
import { FlatList } from 'react-native'
import { Button } from 'react-native-paper'


type TaskItem = {
  title: string,
  key: string
}

export default function TasksScreen() {

  const items: TaskItem[] = [
    {
      title: 'Title Text',
      key: 'item1'
    },
    {
      title: 'Title Text 2',
      key: 'item2'
    },
  ]

  const _onPress = (item: TaskItem) => {
    console.log(item)
  }

  const add = () => {
    console.log('add')
  }

  const _renderItem = (item: TaskItem) => (
    <Button
      key={item.key}
      onPress={() => _onPress(item)}
    >
      {item.title}
    </Button>
  )

  return (
    <ScreenLayout>
      <Button onPress={() => add()}>Add</Button>
      <FlatList data={items}
        renderItem={(itemInfo) => _renderItem(itemInfo.item)}>
      </FlatList>
    </ScreenLayout>
  )
}
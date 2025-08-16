import { Button, FlatList, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

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

  const add=() =>{
     console.log('add')
  }

  const _renderItem = (item: TaskItem) => (
    //<TouchableOpacity onPress={() => _onPress(item)}>
    //  <ThemedText>{item.title}</ThemedText>
      <Button title={item.title} key={item.key} onPress={() => _onPress(item)}></Button>
   // </TouchableOpacity>
  )

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Задачи</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Button title='Add' onPress={() => add()}></Button>
      <FlatList data={items} renderItem={(itemInfo) => _renderItem(itemInfo.item)}>
      </FlatList>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

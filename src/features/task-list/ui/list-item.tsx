import { Task } from '@/src/entities/tasks-management'
import { ModificationType } from '@/src/shared/lib/types'
import { StyleSheet, View } from 'react-native'
import { IconButton, Text } from 'react-native-paper'


type Props = {
    item: Task
    onChange: (mode: ModificationType, item: Task) => void
}

export const TaskListItem = ({ item, onChange }: Props) => {
    return (
        <View style={styles.container}>
            <Text variant='bodyLarge' style={styles.columnBig}>{item.title}</Text>
            <View style={styles.columnSmall}>
                <IconButton
                    mode='contained'
                    icon='pencil'
                    size={22}
                    onPress={() => onChange('edit', item)}
                />
                <IconButton
                    mode='outlined'
                    icon='trash-can'
                    size={22}
                    onPress={() => onChange('remove', item)}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'flex-end',
        padding: 0,
        margin: 0,
        marginRight: 35,
    },
    columnBig: {
        flex: 5,
    },
    columnSmall: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'flex-start',
    }
})
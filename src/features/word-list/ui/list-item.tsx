import { ModificationType } from '@/src/shared/lib/types'
import { WordShort } from '@entities/dictionary'
import { StyleSheet, View } from 'react-native'
import { IconButton, Text } from 'react-native-paper'


type Props = {
    item: WordShort
    onChange: (mode: ModificationType, item: WordShort) => void
}

export const WordListItem = ({ item, onChange }: Props) => {
    return (
        <View style={styles.container}>
            <Text variant='bodyLarge' style={styles.columnBig}>{item.word}</Text>
            <Text variant='bodyMedium' style={styles.columnBig}>{item.translate}</Text>
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
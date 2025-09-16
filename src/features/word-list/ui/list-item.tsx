import { ModificationType } from '@/src/shared/lib/types'
import { WordShort } from '@entities/dictionary'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'


type Props = {
    item: WordShort
    onChange: (mode: ModificationType, item: WordShort) => void
}

export const WordListItem = ({ item, onChange }: Props) => {
    return (
        <View>
            <Text variant='bodyLarge'>{item.word}</Text>
            <Text variant='bodyMedium'>{item.translate}</Text>
            <Button
                onPress={() => onChange('edit', item)}
                icon={{ source: 'pencil', direction: 'ltr' }}
                mode='contained'>
                Edit word
            </Button>
            <Button
                onPress={() => onChange('remove', item)}
                icon={{ source: 'trash-can', direction: 'ltr' }}
                mode='outlined'
            >
                Delete word
            </Button>
        </View>
    )
}
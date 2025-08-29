import { sharedStyles } from '@/shared/sharedStyles'
import { CardWord } from '@/store/dictionary.slice'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'


type Props = {
    item: CardWord
    onExclude: (key: string) => void
    onRemember: (key: string) => void
    onNotRemember: (key: string) => void
}

export default function Card({ item, onExclude, onRemember, onNotRemember }: Props) {
    return (
        <View>
            <Text variant='bodyLarge'>{item.word}</Text>
            <Text variant='bodyLarge'>-</Text>
            <Text variant='bodyMedium'>{item.translate}</Text>
            <View style={sharedStyles.btnRow}>
                <Button
                    onPress={() => onExclude(item.key)}
                    mode='outlined'
                >
                    Exclude word from learning
                </Button>
                <Button
                    onPress={() => onRemember(item.key)}
                    mode='contained'
                >
                    I remember
                </Button>
                <Button
                    onPress={() => onNotRemember(item.key)}
                    mode='contained'
                >
                    I don't remember
                </Button>
            </View>
        </View>
    )
}
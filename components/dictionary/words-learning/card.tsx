import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { CardWord } from '@/store/dictionary.slice'
import { Button, StyleSheet } from 'react-native'

type Props = {
    item: CardWord
    onExclude: (key: string) => void
    onRemember: (key: string) => void
    onNotRemember: (key: string) => void
}

export default function Card({ item, onExclude, onRemember, onNotRemember }: Props) {
    return (
        <ThemedView>
            <ThemedText type='defaultSemiBold'>{item.word}</ThemedText>
            <ThemedText type='default'>-</ThemedText>
            <ThemedText type='default'>{item.translate}</ThemedText>
            <ThemedView style={styles.btnRow}>
                <Button title='Exclude word from learning' onPress={() => onExclude(item.key)} />
                <Button title='I remember' onPress={() => onRemember(item.key)} />
                <Button title="I don't remember" onPress={() => onNotRemember(item.key)} />
            </ThemedView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})
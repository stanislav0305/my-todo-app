import { WordCardReadable } from '@entities/dictionary'
import { sharedStyles } from '@shared/styles'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, IconButton, Text } from 'react-native-paper'


type Props = {
    item: WordCardReadable
    onUpdate: (result?: boolean) => void
}

export default function CardReadable({ item, onUpdate }: Props) {
    const [textVisible, setTextVisible] = useState(false)

    function onAnswer(result?: boolean) {
        setTextVisible(false)
        onUpdate(result)
    }

    return (
        <View style={styles.container}>
            <View style={styles.questionContainer}>
                <Text variant='headlineSmall'>Do you know this word?</Text>
                <Text variant='bodyLarge'>{item.question}</Text>
                <Text variant='bodyLarge'>-</Text>
                <Text variant='bodyMedium'>{(textVisible || item.mode === 'Review') ? item.answer : ''}</Text>
            </View>
            <View style={sharedStyles.btnRow}>
                {(!textVisible && ['withHidedTranslate', 'withHidedWord'].includes(item.mode)) &&
                    <IconButton
                        mode='contained'
                        icon='eye'
                        style={styles.eyeBtn}
                        size={22}
                        onPress={() => setTextVisible(true)}
                    />
                }
            </View>
            {(textVisible || item.mode === 'Review') &&
                <View style={sharedStyles.btnRow}>
                    <Button
                        style={styles.btn}
                        onPress={() => onAnswer()}
                        mode='outlined'
                    >
                        Exclude word from learning
                    </Button>
                    <Button
                        style={styles.btn}
                        onPress={() => onAnswer(true)}
                        mode='contained'
                    >
                        I remember
                    </Button>
                    <Button
                        style={styles.btn}
                        onPress={() => onAnswer(false)}
                        mode='contained'
                    >
                        I don&apos;t remember
                    </Button>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    questionContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    eyeBtn: {
        textAlign: 'center',
        margin: 0,
        width: 200,
    },
    btn: {
        margin: 5
    }
})
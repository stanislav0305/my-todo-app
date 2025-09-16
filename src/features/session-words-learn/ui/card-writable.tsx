import { WordCardWritable } from '@entities/dictionary'
import { stringHelper } from '@shared/lib/helpers'
import { sharedStyles } from '@shared/styles'
import { useAppTheme } from '@shared/theme-model'
import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import { CARD_DELAY_BEFORE_GO_TO_NEXT_IN_SECONDS } from '../constants'


const ATTEMPT_COUNT = 3

type State = {
    answer: string
    answerIsOk?: boolean
    attemptLeft: number
    ended: boolean
    disabled: boolean
}

const defaultState = {
    answer: '',
    answerIsOk: undefined,
    attemptLeft: ATTEMPT_COUNT,
    ended: false,
    disabled: false,
} satisfies State as State


type Props = {
    item: WordCardWritable
    onUpdate: (result: boolean) => void
}

export default function CardWritable({ item, onUpdate }: Props) {
    const appTheme = useAppTheme()
    const { danger, success, secondary, onSurface } = appTheme.colors

    const [state, setState] = useState<State>(defaultState)
    const { answer, answerIsOk, attemptLeft, ended, disabled } = state

    const onWrite = useCallback(() => {
        setState(defaultState)
        onUpdate(answerIsOk!)
    }, [answerIsOk, setState, onUpdate])

    useEffect(() => {
        let timeoutId: number
        if (ended) {
            timeoutId = setTimeout(() => {
                console.log(`Delayed message after ${CARD_DELAY_BEFORE_GO_TO_NEXT_IN_SECONDS} seconds!`)
                onWrite()
            }, CARD_DELAY_BEFORE_GO_TO_NEXT_IN_SECONDS * 1000)
        }

        return () => clearTimeout(timeoutId)
    }, [ended, onWrite])

    function onChangeAnswer(text: string) {
        setState(prev => {
            return {
                ...prev,
                answer: text,
            }
        })
    }

    function check() {
        if (disabled)
            return

        setState(prev => {
            const answerIsOk = stringHelper.removeSpaces(state.answer.toLowerCase())
                === stringHelper.removeSpaces(item.answer.toLowerCase())

            const attemptLeft = prev.attemptLeft - 1
            const ended = answerIsOk || attemptLeft === 0

            return {
                ...prev,
                answerIsOk,
                attemptLeft,
                ended,
                disabled: ended,
            }
        })
    }

    function detectColor(successColor: string, dangerColor: string, defaultColor: string) {
        return answerIsOk === true ? successColor : answerIsOk === false ? dangerColor : defaultColor
    }

    const resultText = answerIsOk === true ? 'Correct !!!' : answerIsOk === false ? 'Wrong !!!' : ' '
    return (
        <View style={styles.container}>
            <View style={styles.questionContainer}>
                <Text variant='headlineSmall'>Enter correct answer</Text>
                <Text variant='bodyMedium'>{item.question}</Text>
                <Text variant='bodyLarge'
                    style={{ color: detectColor(success, danger, secondary) }}
                >
                    {resultText}
                </Text>
                <Text variant='bodyLarge'
                    style={{ color: success }}
                >
                    {(ended && !answerIsOk) ? item.answer : ' '}
                </Text>
            </View>
            <TextInput
                style={[{ textAlign: 'center' }]}
                textColor={detectColor(success, danger, onSurface)}
                value={answer}
                maxLength={item.answer.length}
                onChangeText={onChangeAnswer}
                mode='outlined'
                dense={true}
                focusable={true}
                disabled={disabled}
            />
            <View style={sharedStyles.btnRow}>
                <Button
                    onPress={check}
                    disabled={disabled}
                    mode='contained'
                >
                    Check (attempt left: {attemptLeft})
                </Button>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    questionContainer: {
        alignItems: 'center',
        marginBottom: 15,
    }
})
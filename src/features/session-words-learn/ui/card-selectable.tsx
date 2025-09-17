import { useAppTheme } from '@shared/theme/hooks'
import { WordCardSelectable } from '@entities/dictionary'
import { stringHelper } from '@shared/lib/helpers'
import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { CARD_DELAY_BEFORE_GO_TO_NEXT_IN_SECONDS } from '../constants'


type State = {
    answerIsOk?: boolean
    clickedBtnKey: string
    disabled: boolean
}

const defaultState = {
    answerIsOk: undefined,
    clickedBtnKey: '',
    disabled: false,
} satisfies State as State

type Props = {
    item: WordCardSelectable
    onUpdate: (result: boolean) => void
}


export default function CardSelectable({ item, onUpdate }: Props) {
    const appTheme = useAppTheme()
    const { danger, dangerContainer, success, successContainer, secondary, secondaryContainer } = appTheme.colors

    const [state, setState] = useState<State>(defaultState)
    const { answerIsOk, clickedBtnKey, disabled } = state

    const onSelected = useCallback(() => {
        setState(defaultState)
        onUpdate(answerIsOk!)
    }, [answerIsOk, setState, onUpdate])

    useEffect(() => {
        let timeoutId: number
        if (!stringHelper.isEmpty(clickedBtnKey)) {
            timeoutId = setTimeout(() => {
                console.log(`Delayed message after ${CARD_DELAY_BEFORE_GO_TO_NEXT_IN_SECONDS} seconds!`)
                onSelected()
            }, CARD_DELAY_BEFORE_GO_TO_NEXT_IN_SECONDS * 1000)
        }

        return () => clearTimeout(timeoutId)
    }, [clickedBtnKey, onSelected])

    function check(btnKey: string, isCorrect: boolean) {
        if (disabled)
            return

        setState(prev => {
            return {
                ...prev,
                answerIsOk: isCorrect,
                clickedBtnKey: btnKey,
                disabled: true
            }
        })
    }

    function detectColor(btnKey: string, btnAnswer: boolean, successColor: string,
        dangerColor: string, defaultColor: string) {

        //if clicked
        if (typeof answerIsOk != 'undefined') {
            //change clicked btn
            if (btnKey === clickedBtnKey)
                return btnAnswer ? successColor : dangerColor

            //change correct btn if it not clicked
            if (btnKey !== clickedBtnKey && btnAnswer)
                return successColor
        }

        return defaultColor
    }

    const resultText = answerIsOk === true ? 'Correct !!!' : answerIsOk === false ? 'Wrong !!!' : ' '
    return (
        <View style={styles.container}>
            <View style={styles.questionContainer}>
                <Text variant='headlineSmall'>Select correct translate</Text>
                <Text variant='bodyMedium'>{item.question}</Text>
                <Text variant='bodyLarge'
                    style={{ color: detectColor(clickedBtnKey, answerIsOk === true, success, danger, secondary) }}
                >
                    {resultText}
                </Text>
            </View>
            <>
                {item.answers.map(data => {
                    const key = `btn-${stringHelper.removeSpaces(data.answer)}`
                    return (
                        <Button
                            key={key}
                            textColor={detectColor(key, data.isCorrect, success, danger, secondary)}
                            style={{ backgroundColor: detectColor(key, data.isCorrect, successContainer, dangerContainer, secondaryContainer) }}
                            onPress={() => check(key, data.isCorrect)}
                            mode='outlined'
                        >
                            {data.answer}
                        </Button>
                    )
                })}
            </>
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
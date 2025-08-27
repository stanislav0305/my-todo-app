import ScreenLayout from '@/app/_screen-layout'
import Card from '@/components/dictionary/words-learning/Card'
import CardWordResult1 from '@/components/dictionary/words-learning/CardWordResult1'
import { useAppDispatch } from '@/hooks/store/useAppDispatch'
import { useAppSelector } from '@/hooks/store/useAppSelector'
import {
    CardWord,
    Result1,
    selectCardWordsByNextLearn,
    setCardWordResults
} from '@/store/dictionary.slice'
import { selectMainSettings } from '@/store/settings.slice'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FlatList } from 'react-native'
import { Button, Text } from 'react-native-paper'


interface ScreenState {
    num: number
    cardWords: CardWord[]
}

export default function WordsLearningScreen() {
    const dispatch = useAppDispatch()
    const mainSettings = useAppSelector(selectMainSettings)
    const cardWordsCleared = useAppSelector(state =>
        selectCardWordsByNextLearn(state, mainSettings.wordsLearningPartSize)
    )
    const router = useRouter()

    const [screenState, setState] = useState<ScreenState>({
        num: 0,
        cardWords: [...cardWordsCleared]
    })

    function updateCardWord(key: string, result1: Result1 = 'none', isExcluded: boolean = false) {
        let num = screenState.cardWords.findIndex(item => item.key === key)

        const words = [...screenState.cardWords]
        words[num] = {
            ...words[num],
            result1,
            isExcluded
        } satisfies CardWord

        setState({
            ...screenState,
            num: screenState.num + 1,
            cardWords: words
        })

        if (num + 1 === words.length)
            dispatch(setCardWordResults(words))
    }

    const { num, cardWords } = screenState

    return (
        <ScreenLayout>
            <Text variant='headlineLarge'>Learning</Text>
            <Text variant='bodyMedium'>{num}/{cardWords.length}</Text>
            {(num < cardWords.length) &&
                <>
                    <Text variant='bodyMedium'>Do you know this word?</Text>
                    <Card
                        item={cardWords[num]}
                        onExclude={key => updateCardWord(key, 'none', true)}
                        onRemember={key => updateCardWord(key, 'IsRemembered')}
                        onNotRemember={key => updateCardWord(key, 'IsNotRemembered')}
                    />
                </>
            }

            {num === cardWords.length &&
                <>
                    <Text variant='titleMedium'>Results:</Text>
                    <FlatList
                        data={cardWords}
                        renderItem={(i) => {
                            return (
                                <CardWordResult1 item={i.item} />
                            )
                        }}>
                    </FlatList>
                    <Button onPress={() => router.navigate('/')}
                        mode='contained'>
                        Ok
                    </Button>
                </>
            }
        </ScreenLayout>
    )
}
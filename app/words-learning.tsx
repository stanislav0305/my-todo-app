import Card from '@/components/dictionary/words-learning/card'
import CardWordResult1 from '@/components/dictionary/words-learning/CardWordResult1'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { LearnWordPartSize } from '@/constants/word-learning'
import { useAppDispatch } from '@/hooks/store/useAppDispatch'
import { useAppSelector } from '@/hooks/store/useAppSelector'
import {
    CardWord,
    Result1,
    selectCardWordsByNextLearn,
    setCardWordResults
} from '@/store/dictionary.slice'
import React, { useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'

interface ScreenState {
    num: number
    cardWords: CardWord[]
}


export default function WordsLearningScreen() {
    const dispatch = useAppDispatch()
    const cardWordsCleared = useAppSelector(state => selectCardWordsByNextLearn(state, LearnWordPartSize))


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
        <ThemedView style={styles.container}>
            <ThemedText>{num}/{cardWords.length}</ThemedText>
            {(num < cardWords.length) &&
                <>
                    <ThemedText>Do you know this word?</ThemedText>
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
                    <ThemedText>Results:</ThemedText>
                    <FlatList
                        data={cardWords}
                        renderItem={(i) => {
                            return (
                                <CardWordResult1 item={i.item} />
                            )
                        }}>
                    </FlatList>
                </>
            }
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: 'hidden',
        position: 'relative',
    }
})
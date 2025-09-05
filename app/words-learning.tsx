import ScreenLayout from '@/app/_screen-layout'
import CardReadable from '@/components/dictionary/words-learning/CardReadable'
import CardSelectable from '@/components/dictionary/words-learning/CardSelectable'
import CardWritable from '@/components/dictionary/words-learning/CardWritable'
import SessionResult from '@/components/dictionary/words-learning/SessionResult'
import { useAppDispatch } from '@/hooks/store/useAppDispatch'
import { useAppSelector } from '@/hooks/store/useAppSelector'
import {
    selectSession,
    setSessionWordCardResult,
    setWordStatistics,
} from '@/store/dictionary.slice'
import {
    CardType, getWordCardType, isWordCardReadable, isWordCardSelectable, isWordCardWritable,
    WordCardReadable, WordCardResult, WordCardResultShort, WordCardSelectable,
    WordCardWritable
} from '@/store/session.entities'
import React from 'react'
import { Text } from 'react-native-paper'


export default function WordsLearningScreen() {
    const dispatch = useAppDispatch()

    const session = useAppSelector(selectSession)
    const { wordCardNum, results, wordCards, totalCorrectAnswerPercent } = session

    function updateWordCard(cardResult?: boolean) {
        const cardType = getWordCardType(wordCards[wordCardNum])

        saveWordStatistics(cardType, session.key, cardResult)
        saveSessionWordCardResult(cardType, cardResult)
    }

    function saveWordStatistics(cardType: CardType, sessionKey: string, cardResult?: boolean) {
        const result = {
            key: wordCards[wordCardNum].key,
            sessionKey,
            isExcluded: typeof cardResult === 'undefined',
            cardType: cardType,
            cardResult: cardResult ?? false,
        } satisfies WordCardResult

        dispatch(setWordStatistics(result))
    }

    function saveSessionWordCardResult(cardType: CardType, cardResult?: boolean) {
        const result = {
            cardType,
            cardResult
        } as WordCardResultShort
        dispatch(setSessionWordCardResult(result))
    }

    return (
        <ScreenLayout>
            <Text variant='headlineLarge'>Learning</Text>
            <Text variant='bodyMedium'>{wordCardNum}/{wordCards.length}</Text>
            {(wordCardNum < wordCards.length) &&
                <>
                    {isWordCardReadable(wordCards[wordCardNum]) &&
                        <CardReadable
                            item={wordCards[wordCardNum] as WordCardReadable}
                            onUpdate={updateWordCard}
                        />
                    }
                    {isWordCardSelectable(wordCards[wordCardNum]) &&
                        <CardSelectable
                            item={wordCards[wordCardNum] as WordCardSelectable}
                            onUpdate={updateWordCard}
                        />
                    }
                    {isWordCardWritable(wordCards[wordCardNum]) &&
                        <CardWritable
                            item={wordCards[wordCardNum] as WordCardWritable}
                            onUpdate={updateWordCard}
                        />
                    }
                </>
            }

            {wordCardNum >= wordCards.length && //number can be > wordCards.length when last word was excluded
                <SessionResult
                    learnResults={results}
                    totalCorrectAnswerPercent={totalCorrectAnswerPercent}
                />
            }
        </ScreenLayout>
    )
}
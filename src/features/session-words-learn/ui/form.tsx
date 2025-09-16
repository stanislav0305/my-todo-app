import {
    CardType,
    selectSession,
    setSessionWordCardResult,
    setWordStatistics,
    wordCardHelper,
    WordCardReadable, WordCardResult, WordCardResultShort, WordCardSelectable,
    WordCardWritable
} from '@entities/dictionary'
import { useAppDispatch, useAppSelector } from '@shared/lib/hooks'
import React from 'react'
import { Text } from 'react-native-paper'
import CardReadable from './card-readable'
import CardSelectable from './card-selectable'
import CardWritable from './card-writable'
import SessionResult from './session-result'


export function WordsLearningForm() {
    const dispatch = useAppDispatch()

    const session = useAppSelector(selectSession)
    const { wordCardNum, results, wordCards, totalCorrectAnswerPercent } = session

    function updateWordCard(cardResult?: boolean) {
        const cardType = wordCardHelper.getWordCardType(wordCards[wordCardNum])

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
        <>
            <Text variant='headlineLarge'>Learning</Text>
            <Text variant='bodyMedium'>{wordCardNum}/{wordCards.length}</Text>
            {(wordCardNum < wordCards.length) &&
                <>
                    {wordCardHelper.isWordCardReadable(wordCards[wordCardNum]) &&
                        <CardReadable
                            item={wordCards[wordCardNum] as WordCardReadable}
                            onUpdate={updateWordCard}
                        />
                    }
                    {wordCardHelper.isWordCardSelectable(wordCards[wordCardNum]) &&
                        <CardSelectable
                            item={wordCards[wordCardNum] as WordCardSelectable}
                            onUpdate={updateWordCard}
                        />
                    }
                    {wordCardHelper.isWordCardWritable(wordCards[wordCardNum]) &&
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
        </>
    )
}
import { resetSession } from '@entities/dictionary'
import { selectMainSettings } from '@entities/settings'
import { useAppDispatch, useAppSelector } from '@shared/lib/hooks'
import { useRouter } from 'expo-router'
import React from 'react'
import { Button } from 'react-native-paper'


export const LearnMenuWidget = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const mainSettings = useAppSelector(selectMainSettings)
    const { wordsLearningPartSize } = mainSettings

    return (
        <>
            <Button onPress={() => {
                dispatch(resetSession(wordsLearningPartSize))
                router.navigate('/words-learning')
            }}
                mode='contained'>
                Learn words
            </Button>
        </>
    )
}
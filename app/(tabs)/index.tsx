import ScreenLayout from '@/app/_screen-layout';
import { useAppDispatch } from '@/hooks/store/useAppDispatch';
import { useAppSelector } from '@/hooks/store/useAppSelector';
import { resetSession } from '@/store/dictionary.slice';
import { selectMainSettings } from '@/store/settings.slice';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button } from 'react-native-paper';


export default function LearningScreen() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const mainSettings = useAppSelector(selectMainSettings)
    const { wordsLearningPartSize } = mainSettings

    return (
        <ScreenLayout>
            <Button onPress={() => {
                dispatch(resetSession(wordsLearningPartSize))
                router.navigate('/words-learning')
            }}
                mode='contained'>
                Learn words
            </Button>
        </ScreenLayout>
    )
}
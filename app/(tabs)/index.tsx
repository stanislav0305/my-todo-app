import ScreenLayout from '@/app/_screen-layout';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Text } from 'react-native-paper';


export default function LearningScreen() {
    const router = useRouter()

    return (
        <ScreenLayout>
            <Text variant='headlineLarge'>Learning</Text>
            <Button onPress={() => router.navigate('/words-learning')}
                mode='contained'>
                Learn new words
            </Button>
            <Button onPress={() => router.navigate('/words-learning')}
                mode='contained'>
                Repeat words
            </Button>
            <Button onPress={() => router.navigate('/words-learning123')}
                mode='contained'>
                to notfound page
            </Button>
        </ScreenLayout>
    )
}
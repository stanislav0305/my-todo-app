import { WordsLearningForm } from '@features/session-words-learn'
import ScreenLayout from '@pages/_screen-layout'
import React from 'react'


export default function WordsLearningScreen() {
    return (
        <ScreenLayout>
            <WordsLearningForm />
        </ScreenLayout>
    )
}
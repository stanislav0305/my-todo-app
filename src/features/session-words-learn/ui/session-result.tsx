import { useAppTheme } from '@shared/theme/hooks'
import { sessionResultHelper, WordLastLearnResult } from '@entities/dictionary'
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import CardsResult from './card-result'


type Props = {
    learnResults: WordLastLearnResult[]
    totalCorrectAnswerPercent: number
}

export default function SessionResult({ learnResults, totalCorrectAnswerPercent }: Props) {
    const appTheme = useAppTheme()
    const router = useRouter()
    const { color, resultType } = sessionResultHelper.getSessionResult(totalCorrectAnswerPercent)
    const resultColor = appTheme.colors[color].toString()

    return (
        <View style={styles.container}>
            <Text variant='headlineSmall'>Results:</Text>
            <ScrollView style={styles.scrollViewContent}>
                {learnResults.map((i) => <CardsResult key={`card-result-${i.key}`} item={i} />)}
            </ScrollView>
            <Text variant='headlineMedium' style={{ 'color': resultColor }}>
                Total result: {totalCorrectAnswerPercent.toFixed(2)}%
            </Text>
            <Text variant='headlineMedium' style={{ 'color': resultColor }}>
                {resultType.toLocaleLowerCase()}
            </Text>
            <Button onPress={() => router.navigate('/')}
                mode='contained'>
                Ok
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 10,
    },
})

import { useAppTheme } from '@shared/theme/hooks'
import { WordLastLearnResult } from '@entities/dictionary'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'


type Props = {
    item: WordLastLearnResult
}

export default function CardsResult({ item }: Props) {
    const appTheme = useAppTheme()
    const { success, primary } = appTheme.colors

    return (
        <View style={styles.container}>
            <Text variant='bodyLarge' style={styles.text}>
                {item.word + ' '}
            </Text>
            <View style={styles.results}>
                {item.isExcluded &&
                    <Text variant='bodySmall' style={[{ 'color': primary }, styles.text]}>
                        is excluded from learning
                    </Text>
                }
                {item.isLearned &&
                    <Text variant='bodySmall' style={[{ 'color': success }, styles.text]}>is learned</Text>
                }
                {item.readResult > 0 &&
                    <Text variant='bodySmall' style={[{ 'color': success }, styles.text]}>
                        read: +{item.readResult}
                    </Text>
                }
                {item.selectResult > 0 &&
                    <Text variant='bodySmall' style={[{ 'color': success }, styles.text]}>
                        select: +{item.selectResult}
                    </Text>
                }
                {item.writeResult > 0 &&
                    <Text variant='bodySmall' style={[{ 'color': success }, styles.text]}>
                        write: +{item.writeResult}
                    </Text>
                }
            </View>
            <Text variant='bodySmall' style={[{ 'color': success }, styles.text]}>
                remembered on:{item.memoPercent}%
            </Text>
            <Text variant='bodySmall' style={styles.nextRepeat}>
                next repeat after: {item.nextLearnAfterDays} day(-s) ({item.nextLearn})
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 5,
    },
    text: {
        marginRight: 5,
    },
    nextRepeat: {
        flex: 1,
        marginRight: 5,
    },
    results: {
        flex: 1,
        flexDirection: 'row'
    }
})
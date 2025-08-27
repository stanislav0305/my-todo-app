import { CardWord } from '@/store/dictionary.slice'
import { selectAppTheme } from '@/store/settings.slice'
import { Text } from 'react-native-paper'
import { useSelector } from 'react-redux'


type CardWordResult1Props = {
    item: CardWord
}

export default function CardWordResult1({ item }: CardWordResult1Props) {
    const appTheme = useSelector(selectAppTheme)
    const { danger, success, surface } = appTheme.colors

    return (
        <>
            <Text variant='bodyLarge'>{item.word + ' '}
                <Text variant='bodySmall'>{'Result: '}</Text>
                {item.isExcluded &&
                    <Text variant='bodySmall' style={{ 'color': surface }}>
                        is excluded from learning
                    </Text>
                }
                {(!item.isExcluded && item.result1 === 'none') &&
                    <Text variant='bodySmall' style={{ 'color': danger }}>none</Text>
                }
                {(!item.isExcluded && item.result1 === 'IsRemembered') &&
                    <Text variant='bodySmall' style={{ 'color': success }}>is remembered</Text>
                }
                {(!item.isExcluded && item.result1 === 'IsNotRemembered') &&
                    <Text variant='bodySmall' style={{ 'color': danger }}>is not remembered</Text>
                }
            </Text>
        </>
    )
}
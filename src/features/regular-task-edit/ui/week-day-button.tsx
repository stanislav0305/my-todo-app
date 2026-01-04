import { useAppTheme } from '@shared/theme/hooks/use-app-theme'
import React from 'react'
import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native'
import { Surface, Text } from 'react-native-paper'


type Props = {
    day: string,
    dayValue: boolean,
    onPress: (event: GestureResponderEvent) => void
}

export const WeekDayButton = ({ day, dayValue, onPress }: Props) => {
    const appTheme = useAppTheme()
    const { primary, onPrimary, secondaryContainer, primaryContainer } = appTheme.colors

    return (
        <Pressable onPress={onPress}>
            <Surface elevation={4}
                style={[styles.weekDay,
                (dayValue)
                    ? { backgroundColor: primary, borderColor: primaryContainer }
                    : { borderColor: secondaryContainer }]}
            >
                <Text style={{ color: dayValue ? onPrimary : primary }}
                    variant='titleMedium'
                >
                    {day}
                </Text>
            </Surface>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    weekDay: {
        padding: 1,
        height: 45,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 45,
        borderWidth: 1
    },
})
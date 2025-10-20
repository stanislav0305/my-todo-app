import { timeHelper } from '@shared/lib/helpers'
import { useAppTheme } from '@shared/theme/hooks'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import { TimePickerModal } from 'react-native-paper-dates'
import { PossibleInputTypes } from 'react-native-paper-dates/lib/typescript/Time/timeUtils'


type AppTimePickerModalPros = {
    locale?: undefined | string
    label?: string
    uppercase?: boolean
    cancelLabel?: string
    confirmLabel?: string
    hours?: number | undefined
    minutes?: number | undefined
    visible?: boolean | undefined
    onDismiss?: () => any
    onConfirm?: (hoursAndMinutes: { hours: number | undefined, minutes: number | undefined }) => any
    animationType?: 'slide' | 'fade' | 'none'
    keyboardIcon?: string
    clockIcon?: string
    use24HourClock?: boolean
    inputFontSize?: number
    defaultInputType?: PossibleInputTypes
}

type State = {
    visible: boolean,
    hours?: number,
    minutes?: number,
}


export function AppTimePickerModal({ onConfirm, onDismiss, ...rest }: AppTimePickerModalPros) {
    const appTheme = useAppTheme()
    const { primary } = appTheme.colors
    const [state, setSate] = React.useState<State>({
        visible: false,
        hours: rest.hours,
        minutes: rest.minutes,
    } as State)

    const setStateData = React.useCallback(
        (visible: boolean, hours?: number, minutes?: number) => {
            setSate(prev => {
                return {
                    ...prev,
                    visible,
                    hours,
                    minutes,
                }
            })
        },
        [])


    const onConfirmTimePicker = React.useCallback(
        (hoursAndMinutes: { hours: number | undefined, minutes: number | undefined }) => {
            console.log('selected time:', timeHelper.toFormattedStringOrEmpty({ hours: state.hours, minutes: state.minutes }))

            setStateData(false, hoursAndMinutes.hours, hoursAndMinutes.minutes)
            onConfirm && onConfirm(hoursAndMinutes)
        },
        [state.hours, state.minutes, setStateData, onConfirm]
    )

    const onDismissTimePicker = React.useCallback(
        () => {
            setStateData(false, state.hours, state.minutes)
            onDismiss && onDismiss()
        },
        [state.hours, state.minutes, setStateData, onDismiss]
    )

    return (
        <>
            <View style={styles.row}>
                <Text
                    style={[{ 'color': primary }, styles.time]}
                    variant='bodyMedium'
                    onPress={() => setStateData(true, state.hours, state.minutes)}
                >
                    {timeHelper.isUndefined(state.hours, state.minutes)
                        ? '__:__'
                        : timeHelper.toFormattedStringOrEmpty({ hours: state.hours, minutes: state.minutes })
                    }
                </Text>
                <IconButton
                    style={styles.timeBtn}
                    mode='contained'
                    icon='clock'
                    size={22}
                    onPress={() => setStateData(true, state.hours, state.minutes)}
                />
                <IconButton
                    style={styles.timeRemoveBtn}
                    mode='contained'
                    icon='clock-remove'
                    size={22}
                    onPress={() => onConfirmTimePicker({ hours: undefined, minutes: undefined })}
                />
            </View>
            <TimePickerModal
                {...rest}
                hours={state.hours}
                minutes={state.minutes}
                onConfirm={onConfirmTimePicker}
                onDismiss={onDismissTimePicker}
                visible={state.visible}
            />
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    time: {
        textAlignVertical: 'center',
        height: 38,
    },
    timeBtn: {
        margin: 0,
        marginLeft: 5,
        padding: 0
    },
    timeRemoveBtn: {
        margin: 0,
        marginLeft: 5,
        padding: 0
    }
})
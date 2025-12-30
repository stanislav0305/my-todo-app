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
}


export function AppTimePickerModal({ onConfirm, onDismiss, locale, ...rest }: AppTimePickerModalPros) {
    const appTheme = useAppTheme()
    const { primary } = appTheme.colors
    const [state, setSate] = React.useState<State>({
        visible: false,
    } as State)

    const setStateData = React.useCallback(
        (visible: boolean) => {
            setSate(prev => {
                return {
                    ...prev,
                    visible,
                }
            })
        },
        [])


    const onConfirmTimePicker = React.useCallback(
        (hoursAndMinutes: { hours: number | undefined, minutes: number | undefined }) => {
            console.log('selected time:', timeHelper.toFormattedStringOrEmpty({ hours: rest.hours, minutes: rest.minutes }, 'hh:mm'))

            setStateData(false)
            onConfirm && onConfirm(hoursAndMinutes)
        },
        [rest.hours, rest.minutes, setStateData, onConfirm]
    )

    const onDismissTimePicker = React.useCallback(
        () => {
            setStateData(false)
            onDismiss && onDismiss()
        },
        [setStateData, onDismiss]
    )

    return (
        <>
            <View style={styles.row}>
                <Text
                    style={[{ 'color': primary }, styles.time]}
                    variant='bodyMedium'
                    onPress={() => setStateData(true)}
                >
                    {timeHelper.isUndefined(rest.hours, rest.minutes)
                        ? timeHelper.getTemplate('hh:mm')
                        : timeHelper.toFormattedStringOrEmpty({ hours: rest.hours, minutes: rest.minutes }, 'hh:mm')
                    }
                </Text>
                <IconButton
                    style={styles.timeBtn}
                    mode='contained'
                    icon='clock'
                    size={22}
                    onPress={() => setStateData(true)}
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
                hours={rest.hours}
                minutes={rest.minutes}
                onConfirm={onConfirmTimePicker}
                onDismiss={onDismissTimePicker}
                visible={state.visible}
                locale={locale}
                label='## Выберите время'
                confirmLabel='## Ок'
                cancelLabel='## Закрыть'
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
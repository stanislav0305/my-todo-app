import { Task } from '@/src/entities/tasks-management'
import { stringHelper, timeHelper } from '@shared/lib/helpers'
import { useAppTheme } from '@shared/theme/hooks'
import React from 'react'
import { useController, UseControllerProps } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import { TimePickerModal } from 'react-native-paper-dates'
import { PossibleInputTypes } from 'react-native-paper-dates/lib/typescript/Time/timeUtils'


type AppTimePickerModalPros =
    UseControllerProps<Task, keyof Task, Task>
    & {
        locale?: undefined | string
        label?: string
        uppercase?: boolean
        cancelLabel?: string
        confirmLabel?: string
        hours?: number | undefined
        minutes?: number | undefined
        visible?: boolean | undefined
        onDismiss?: () => any
        onConfirm?: (hoursAndMinutes: { hours: number; minutes: number }) => any
        animationType?: 'slide' | 'fade' | 'none'
        keyboardIcon?: string
        clockIcon?: string
        use24HourClock?: boolean
        inputFontSize?: number
        defaultInputType?: PossibleInputTypes
    }



export function AppTimePickerModal({ name, defaultValue = undefined, control, rules, onConfirm, onDismiss, ...rest }: AppTimePickerModalPros) {
    const appTheme = useAppTheme()
    const { primary } = appTheme.colors
    const [visible, setVisible] = React.useState<boolean>(false)

    const { field } = useController({
        control,
        defaultValue,
        name,
        rules,
    })

    const onConfirmTimePicker = React.useCallback(
        (hoursAndMinutes: { hours: number, minutes: number }) => {
            field.onChange(timeHelper.toFormattedString(hoursAndMinutes))
            console.log('selected time:', field.value)

            setVisible(false)
            onConfirm && onConfirm(hoursAndMinutes)
        },
        [setVisible, onConfirm, field]
    )

    const onDismissTimePicker = React.useCallback(
        () => {
            setVisible(false)
            onDismiss && onDismiss()
        },
        [setVisible, onDismiss, field]
    )

    return (
        <>
            <View style={styles.row}>
                <Text
                    style={[{ 'color': primary }, styles.time]}
                    variant='bodyMedium'
                    onPress={() => setVisible(true)}
                >
                    {stringHelper.isEmpty(field.value) ? '__:__' : field.value}
                </Text>
                <IconButton
                    style={styles.timeBtn}
                    mode='contained'
                    icon='clock'
                    size={22}
                    onPress={() => setVisible(true)}
                />
                <IconButton
                    style={styles.timeRemoveBtn}
                    mode='contained'
                    icon='clock-remove'
                    size={22}
                    onPress={() => field.onChange('')}
                />
            </View>
            <TimePickerModal
                {...rest}
                hours={timeHelper.getHoursFromString(field.value)}
                minutes={timeHelper.getMinutesFromString(field.value)}
                onConfirm={onConfirmTimePicker}
                onDismiss={onDismissTimePicker}
                visible={visible}
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
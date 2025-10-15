import { Task } from '@/src/entities/tasks-management'
import { stringHelper } from '@shared/lib/helpers'
import { useAppTheme } from '@shared/theme/hooks'
import React from 'react'
import { useController, UseControllerProps } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import { BaseCalendarProps, CalendarDate, SingleChange } from 'react-native-paper-dates/lib/typescript/Date/Calendar'
import { HeaderPickProps } from 'react-native-paper-dates/lib/typescript/Date/DatePickerModalContentHeader'


type AppDatePickerModalPros =
    UseControllerProps<Task, keyof Task, Task>
    //& DatePickerModalSingleProps it is modified DatePickerModalContentBaseProps
    & HeaderPickProps
    & BaseCalendarProps
    & {
        //it is modified DatePickerModalContentBaseProps
        inputFormat?: string
        locale: string
        onDismiss?: () => any //modified

        saveLabelDisabled?: boolean
        uppercase?: boolean
        inputEnabled?: boolean

        disableSafeTop?: boolean
        disableStatusBar?: boolean
        statusBarOnTopOfBackdrop?: boolean
    }
    & {
        //it is modified DatePickerModalContentSingleProps
        mode: 'single'
        date?: CalendarDate
        onChange?: SingleChange
        onConfirm: SingleChange
        dateMode?: 'start' | 'end'
    }
    & {
        //it is modified DatePickerModalProps
        visible?: boolean //modified
        animationType?: 'slide' | 'fade' | 'none'
        disableStatusBar?: boolean
        disableStatusBarPadding?: boolean
        inputEnabled?: boolean
        presentationStyle?: 'pageSheet' | 'overFullScreen'
    }



export function AppDatePickerSingleModal({ name, defaultValue = undefined, control, rules, onConfirm, onDismiss, ...rest }: AppDatePickerModalPros) {
    const appTheme = useAppTheme()
    const { primary } = appTheme.colors
    const [visible, setVisible] = React.useState<boolean>(false)

    const { field } = useController({
        control,
        defaultValue,
        name,
        rules,
    })

    const onConfirmDatePicker = React.useCallback(
        (params: { date: CalendarDate }) => {
            field.onChange(params.date?.toString())
            console.log('selected date:', params.date)

            setVisible(false)
            onConfirm && onConfirm(params)
        },
        [setVisible, onConfirm, field]
    )

    const onDismissDatePicker = React.useCallback(
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
                    style={[{ 'color': primary }, styles.date]}
                    variant='bodyMedium'
                    onPress={() => setVisible(true)}
                >
                    {stringHelper.isEmpty(field.value) ? '__/__/____' : field.value}
                </Text>
                <IconButton
                    style={styles.dateBtn}
                    mode='contained'
                    icon='calendar-month'
                    size={22}
                    onPress={() => setVisible(true)}
                />
                <IconButton
                    style={styles.dateRemoveBtn}
                    mode='contained'
                    icon='calendar-remove'
                    size={22}
                    onPress={() => field.onChange('')}
                />
            </View>
            <DatePickerModal
                {...rest}
                visible={visible}
                date={stringHelper.isEmpty(field.value) ? undefined : new Date(field.value)}
                onConfirm={onConfirmDatePicker}
                onDismiss={onDismissDatePicker}
            />
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    date: {
        textAlignVertical: 'center',
        height: 38,
    },
    dateBtn: {
        margin: 0,
        marginLeft: 5,
        padding: 0
    },
    dateRemoveBtn: {
        margin: 0,
        marginLeft: 5,
        padding: 0
    }
})
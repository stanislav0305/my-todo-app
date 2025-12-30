import { calendarDateHelper, dateHelper } from '@shared/lib/helpers'
import { useAppTheme } from '@shared/theme/hooks'
import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import { BaseCalendarProps, CalendarDate, SingleChange } from 'react-native-paper-dates/lib/typescript/Date/Calendar'
import { HeaderPickProps } from 'react-native-paper-dates/lib/typescript/Date/DatePickerModalContentHeader'


type AppDatePickerModalPros =
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

type State = {
    visible: boolean
}

export function AppDatePickerSingleModal({ onConfirm, onDismiss, locale, ...rest }: AppDatePickerModalPros) {
    const appTheme = useAppTheme()
    const { primary } = appTheme.colors
    const [state, setSate] = useState<State>({
        visible: false
    } as State)

    const setStateData = (visible: boolean) => {
        setSate(prev => {
            return {
                ...prev,
                visible
            }
        })
    }

    const onConfirmDatePicker = useCallback(
        (params: { date: CalendarDate }) => {
            rest.date = params.date
            console.log('selected date:', rest.date)

            setStateData(false)
            onConfirm && onConfirm(params)
        },
        [rest, onConfirm]
    )

    const onDismissDatePicker = useCallback(
        () => {
            setStateData(false)
            onDismiss && onDismiss()
        },
        [rest.date, onDismiss]
    )

    return (
        <>
            <View style={styles.row}>
                <Text
                    style={[{ 'color': primary }, styles.date]}
                    variant='bodyMedium'
                    onPress={() => setStateData(true)}
                >
                    {calendarDateHelper.isUndefined(rest.date)
                        ? dateHelper.getTemplate('DD/MM/YYYY')
                        : calendarDateHelper.toFormattedStringOrEmpty(rest.date, 'DD/MM/YYYY')
                    }
                </Text>
                <IconButton
                    style={styles.dateBtn}
                    mode='contained'
                    icon='calendar-month'
                    size={22}
                    onPress={() => setStateData(true)
                    }
                />
                <IconButton
                    style={styles.dateRemoveBtn}
                    mode='contained'
                    icon='calendar-remove'
                    size={22}
                    onPress={() => onConfirmDatePicker({ date: undefined })}
                />
            </View>
            <DatePickerModal
                {...rest}
                visible={state.visible}
                date={rest.date}
                onConfirm={onConfirmDatePicker}
                onDismiss={onDismissDatePicker}
                locale={locale}
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
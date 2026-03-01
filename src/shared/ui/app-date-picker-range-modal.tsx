import { calendarDateHelper } from '@shared/lib/helpers'
import { useAppTheme } from '@shared/theme/hooks'
import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar'


type Props = {
    startDate: CalendarDate
    endDate: CalendarDate
    withDateRemoveBtn?: boolean
    onConfirm?: (startDate: CalendarDate, endDate: CalendarDate) => void
    onDismiss?: () => any
    locale: string
}
type State = {
    visible: boolean
}

export function AppDatePickerRangeModal({ onConfirm, onDismiss, locale, withDateRemoveBtn = true, ...rest }: Props) {
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
        (params: { startDate: CalendarDate, endDate: CalendarDate }) => {
            rest.startDate = params.startDate
            rest.endDate = params.endDate
            console.log(`selected period: ${rest.startDate}-${rest.endDate}`)

            setStateData(false)
            onConfirm && onConfirm(rest.startDate, rest.endDate)
        },
        [rest, onConfirm]
    )

    const onDismissDatePicker = useCallback(
        () => {
            setStateData(false)
            onDismiss && onDismiss()
        },
        [onDismiss]
    )

    const rangeString = calendarDateHelper.getRangeOrTemplateString(rest.startDate, rest.endDate, 'DD/MM/YYYY')

    // Define the valid range for selection (e.g., a rolling 7-day window)
    // Here, we define a fixed valid range, but you could also calculate this dynamically
    //const today = new Date()
    //const maxDate = new Date(today)
    //maxDate.setDate(maxDate.getDate() + 7)

    return (
        <>
            <View style={styles.row}>
                <Text
                    style={[{ 'color': primary }, styles.date]}
                    variant='titleMedium'
                    onPress={() => setStateData(true)}
                >
                    {rangeString}
                </Text>
                <IconButton
                    style={styles.dateBtn}
                    mode='contained'
                    icon='calendar-month'
                    size={22}
                    onPress={() => setStateData(true)
                    }
                />
                {withDateRemoveBtn &&
                    <IconButton
                        style={styles.dateRemoveBtn}
                        mode='contained'
                        icon='calendar-remove'
                        size={22}
                        onPress={() => onConfirmDatePicker({ startDate: rest.startDate, endDate: rest.endDate })}
                    />
                }
            </View>
            <DatePickerModal
                visible={state.visible}
                mode='range'
                startDate={rest.startDate}
                endDate={rest.endDate}
                onConfirm={onConfirmDatePicker}
                onDismiss={onDismissDatePicker}
                locale={locale}
            /* validRange={{
                startDate: today, // Optional: minimum selectable date
                endDate: maxDate, // Optional: maximum selectable date (7 days later)
            }}
            label="Select a 7 day period"
            */
            />
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    date: {
        marginLeft: 5,
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
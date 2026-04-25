import { ActualTaskDatesPeriod, ActualTaskPagingPeriodModel } from '@entities/actual-tasks'
import { dateHelper } from '@shared/lib/helpers'
import { DropDownItems } from '@shared/lib/types'
import { useAppTheme } from '@shared/theme/hooks'
import { Select } from '@shared/ui/select'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, IconButton, Text } from 'react-native-paper'
import { changeDates, getDefaultDates } from '../lib/list-period-filter-functions'


export const actualPeriods: Record<ActualTaskDatesPeriod, DropDownItems> = {
    'byDay': { label: 'by day', value: 'byDay', iconType: 'MaterialDesignIcons', icon: 'calendar-today' },
    'byWeek': { label: 'by week', value: 'byWeek', iconType: 'MaterialDesignIcons', icon: 'calendar-today' },
    'byMonth': { label: 'by month', value: 'byMonth', iconType: 'MaterialDesignIcons', icon: 'calendar-today' },
}

export const actualPeriodsDropDownItems = Object.entries(actualPeriods)
    .map((value: [string, DropDownItems]) => {
        return value[1] as DropDownItems
    })

type Props = {
    model: ActualTaskPagingPeriodModel
    onChange: (pagingPeriodModel: ActualTaskPagingPeriodModel) => void
}


export function ListPeriodFilter(props: Props) {
    const appTheme = useAppTheme()
    const { primary } = appTheme.colors

    const setPrevRange = () => {
        const newModel = changeDates(props.model, false)
        props.onChange(newModel)
    }

    const setNextRange = () => {
        const newModel = changeDates(props.model, true)
        props.onChange(newModel)
    }

    const onChangePeriod = (item: DropDownItems) => {
        const newModel = getDefaultDates(item.value as ActualTaskDatesPeriod)
        props.onChange(newModel)
    }

    const { dateFrom, dateTo, period } = props.model
    const rangeString = dateHelper.getRangeOrTemplateString(dateFrom, dateTo, 'DD/MM/YYYY')

    return (
        <View style={styles.row}>
            <View style={styles.col1}>
                <Select
                    dropdownStyle={{ width: 130 }}
                    itemsContainerStyle={{ top: 0 }}
                    label="period"
                    placeholder="period..."
                    searchPlaceholder="period..."
                    value={period}
                    data={actualPeriodsDropDownItems}
                    onChange={(item: DropDownItems) => onChangePeriod(item)}
                    renderItemIcon={(
                        item: DropDownItems,
                        selected?: boolean | undefined,
                    ) => {
                        return (
                            <View style={{ marginRight: 5 }}>
                                <Icon source={item.icon} size={20} />
                            </View>
                        )
                    }}
                    renderLeftIcon={(
                        isFocus: boolean,
                        focusedColor: string | undefined,
                        unFocusedColor: string | undefined,
                    ) => {
                        return (
                            <View style={{ marginLeft: 5 }}>
                                <Icon
                                    color={isFocus ? focusedColor : unFocusedColor}
                                    source={
                                        actualPeriodsDropDownItems.find(
                                            i => i.value === period,
                                        )?.icon
                                    }
                                    size={20}
                                />
                            </View>
                        )
                    }}
                />
            </View>
            <View style={styles.col2}>
                <IconButton
                    style={styles.dateBtn}
                    mode='contained'
                    icon='menu-left-outline'
                    size={22}
                    onPress={() => setPrevRange()}
                />
            </View>
            <View style={styles.col2}>
                <Text
                    style={[{ 'color': primary }, styles.date]}
                    variant='titleSmall'
                >
                    {rangeString}
                </Text>
            </View>
            <View style={styles.col2}>
                <IconButton
                    style={styles.dateBtn}
                    mode='contained'
                    icon='menu-right-outline'
                    size={22}
                    onPress={() => setNextRange()}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'center',
        justifyContent: 'flex-start',
    },
    col1: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
    },
    col2: {
        marginTop: 15,
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
})
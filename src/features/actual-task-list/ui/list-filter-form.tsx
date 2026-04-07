import { ActualTasksFilter, ActualTasksFilterModeType, ActualTaskView } from '@entities/actual-tasks'
import { calendarDateHelper, stringHelper, timeHelper } from '@shared/lib/helpers'
import { DbFilter } from '@shared/lib/types'
import { sharedStyles } from '@shared/styles'
import { useAppTheme } from '@shared/theme/hooks'
import { AppTimePickerModal, ThemedModal } from '@shared/ui'
import { AppDatePickerRangeModal } from '@shared/ui/app-date-picker-range-modal'
import { FormikProps, useFormik } from 'formik'
import { Keyboard, StyleSheet, View } from 'react-native'
import { Button, Divider, SegmentedButtons, Text, TextInput } from 'react-native-paper'
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar'
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'
import { Between, FindOptionsWhere, IsNull, Like, Not } from 'typeorm'

type Props = {
    filter: DbFilter<ActualTaskView, ActualTasksFilterModeType>
    onChangeFilter: (filter: DbFilter<ActualTaskView, ActualTasksFilterModeType>) => void
    onClose: () => void
}

type FilterEnteredValuesType = {
    [key: string]: any
}

function convertToTaskFilter(
    dbFilter: DbFilter<ActualTaskView, ActualTasksFilterModeType>,
): ActualTasksFilter {
    let filterEnteredValues: FilterEnteredValuesType = {
        mode: dbFilter.mode,
        withDeleted: dbFilter.withDeleted,
    }

    if (!!dbFilter && !!dbFilter.where) {
        Object.entries(dbFilter.where)
            .filter(([key, _value]) => key !== 'deletedAt')
            .forEach(([key, value]) => {
                if (key === 'title') {
                    filterEnteredValues[key] = (
                        Object.entries(value as FindOptionsWhere<ActualTaskView>)
                            .find(v => v[0] === '_value')!
                            .at(1) as string
                    ).replaceAll('%', '')
                } else if (key === 'date') {
                    //between
                    const valueArr = Object.entries(value as FindOptionsWhere<ActualTaskView>)
                        .find(v => v[0] === '_value')!
                        .at(1) as any

                    filterEnteredValues['date0'] = valueArr[0]
                    filterEnteredValues['date1'] = valueArr[1]
                } else {
                    filterEnteredValues[key] = value
                }
            })
    }

    console.log('filterEnteredValues:', filterEnteredValues)
    const res: ActualTasksFilter = Object.assign(
        {} as ActualTasksFilter,
        filterEnteredValues,
    ) as ActualTasksFilter
    console.log('TasksFilter obj:', res)

    return res ?? ({} as ActualTasksFilter)
}

function convertToDbFilter(
    filter: ActualTasksFilter,
): DbFilter<ActualTaskView, ActualTasksFilterModeType> {
    let newFilter: DbFilter<ActualTaskView, ActualTasksFilterModeType> = {
        mode: filter.mode,
        withDeleted: filter.withDeleted,
    } as DbFilter<ActualTaskView, ActualTasksFilterModeType>

    let newFilterElements: FilterEnteredValuesType = {} as FilterEnteredValuesType
    if (
        !stringHelper.isEmpty(filter.date0) &&
        !stringHelper.isEmpty(filter.date1)
    ) {
        newFilterElements['date'] = Between(filter.date0, filter.date1)
    }

    Object.entries(filter)
        .filter(
            ([name, value]) =>
                value !== 'undefined' &&
                typeof value != 'undefined' &&
                !(typeof value === 'string' && stringHelper.isEmpty(value)) &&
                !['mode', 'withDeleted', 'date0', 'date1'].includes(name), //exclude fields
        )
        .forEach(([key, value]) => {
            if (key === 'title') newFilterElements['title'] = Like(`%${value}%`)
            else newFilterElements[key] = value
        })

    if (filter.withDeleted === true) {
        newFilterElements['deletedAt'] = Not(IsNull())
    }

    if (Object.keys(newFilterElements ?? {}).length > 0)
        newFilter.where = { ...newFilterElements } as
            | FindOptionsWhere<ActualTaskView>
            | undefined

    newFilter.count = !!newFilter.where
        ? Object.keys(newFilter.where ?? {}).filter(p => p !== 'deletedAt').length
        : 0

    console.log('newFilter:', newFilter)

    return newFilter
}


export function ListFilterForm({ filter, onChangeFilter, onClose }: Props) {
    const appTheme = useAppTheme()
    const { success, danger } = appTheme.colors

    const formik: FormikProps<ActualTasksFilter> = useFormik<ActualTasksFilter>({
        initialValues: convertToTaskFilter(filter),
        onReset: (values: ActualTasksFilter) => {
            console.log('Form reset, old data:', values)

            let newFilter = convertToDbFilter({
                withDeleted: false,
            } as ActualTasksFilter)
            onChangeFilter(newFilter)
        },
        onSubmit: (values: ActualTasksFilter) => {
            console.log('Form submit:', JSON.stringify(values, null, 2))

            let newFilter = convertToDbFilter(values)
            console.log('Form submit converted:', newFilter)
            onChangeFilter(newFilter)
        },
    })

    return (
        <ThemedModal title="List filter" isVisible={true} onClose={onClose}>
            <TextInput
                label="id"
                placeholder="id"
                keyboardType="numeric"
                onChangeText={(v: string) =>
                    formik.setFieldValue(
                        'id',
                        stringHelper.isEmpty(v) ? undefined : parseInt(v, 10),
                    )
                }
                onBlur={formik.handleBlur('id')}
                value={
                    typeof formik.values.id === 'undefined' ? '' : formik.values.id + ''
                }
                mode="outlined"
                dense={true}
                onSubmitEditing={Keyboard.dismiss}
            />

            <Divider style={styles.divider0} />

            <AppTimePickerModal
                use24HourClock={true}
                hours={timeHelper.getHoursFromStringOrUndefined(formik.values.time)}
                minutes={timeHelper.getMinutesFromStringOrUndefined(formik.values.time)}
                onConfirm={(hoursAndMinutes: {
                    hours: number | undefined
                    minutes: number | undefined
                }) => {
                    formik.setFieldValue(
                        'time',
                        timeHelper.toFormattedStringOrEmpty(hoursAndMinutes, 'hh:mm'),
                    )
                }}
                locale="ru"
            />
            <Divider style={styles.divider0} />
            <View style={sharedStyles.row}>
                <View style={sharedStyles.col}>
                    <Text variant="labelMedium" style={{ marginLeft: 5 }}>
                        Date:
                    </Text>
                    <AppDatePickerRangeModal
                        startDate={calendarDateHelper.toCalendarDate(formik.values.date0)}
                        endDate={calendarDateHelper.toCalendarDate(formik.values.date1)}
                        locale="ru"
                        startLabel='# From date'
                        endLabel='# To date'
                        onConfirm={(startDate: CalendarDate, endDate: CalendarDate) => {
                            formik.setValues({
                                ...formik.values,
                                date0: calendarDateHelper.toFormattedStringOrEmpty(startDate, 'YYYY-MM-DD'),
                                date1: calendarDateHelper.toFormattedStringOrEmpty(endDate, 'YYYY-MM-DD')
                            })
                        }}
                        onDismiss={() => {
                            formik.setValues({
                                ...formik.values,
                                date0: undefined,
                                date1: undefined
                            })
                        }}
                    />
                </View>
            </View>
            <Divider style={styles.divider0} />
            <TextInput
                label="title contains"
                placeholder="title contains"
                multiline={true}
                numberOfLines={5}
                onChangeText={formik.handleChange('title')}
                onBlur={formik.handleBlur('title')}
                value={formik.values.title ?? ''}
                mode="outlined"
                dense={true}
                onSubmitEditing={Keyboard.dismiss}
            />
            <Divider style={styles.divider0} />
            <SegmentedButtons
                value={formik.values.isImportant + ''}
                onValueChange={v =>
                    formik.setFieldValue(
                        'isImportant',
                        v === 'undefined' ? undefined : v === 'true',
                    )
                }
                buttons={[
                    {
                        value: 'undefined',
                        label: 'Any',
                    },
                    {
                        value: 'true',
                        icon: {
                            source: 'chevron-double-up',
                            direction: 'ltr',
                        } as IconSource,
                        checkedColor: success,
                        label: 'important',
                    },
                    {
                        value: 'false',
                        label: 'not important',
                    },
                ]}
            />
            <Divider style={styles.divider0} />
            <SegmentedButtons
                value={formik.values.isUrgent + ''}
                onValueChange={v =>
                    formik.setFieldValue(
                        'isUrgent',
                        v === 'undefined' ? undefined : v === 'true',
                    )
                }
                buttons={[
                    {
                        value: 'undefined',
                        label: 'Any',
                    },
                    {
                        value: 'true',
                        icon: {
                            source: 'fire',
                            direction: 'ltr',
                        } as IconSource,
                        checkedColor: danger,
                        label: 'urgent',
                    },
                    {
                        value: 'false',
                        label: 'not urgent',
                    },
                ]}
            />

            <Divider style={styles.divider1} />

            <View style={sharedStyles.btnRow}>
                <Button
                    onPress={() => formik.handleReset()}
                    disabled={!formik.isValid}
                    mode="contained"
                >
                    Clear filter
                </Button>
                <Button
                    onPress={() => formik.handleSubmit()}
                    disabled={!formik.isValid}
                    icon={{ source: 'filter', direction: 'ltr' }}
                    mode="contained"
                >
                    Filter
                </Button>
                <Button onPress={onClose} mode="outlined">
                    Cancel
                </Button>
            </View>
        </ThemedModal>
    )
}

const styles = StyleSheet.create({
    divider0: {
        marginVertical: 5,
        backgroundColor: 'transparent',
    },
    divider1: {
        marginVertical: 15,
        backgroundColor: 'transparent',
    },
})
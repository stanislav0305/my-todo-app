import { ONE_DAY_IN_MILLISECONDS } from '@/src/shared/lib/constants'
import { filterModesDropDownItems, Task, TasksFilter, TasksFilterModeType, taskStatusIconNames } from '@entities/tasks'
import { calendarDateHelper, stringHelper, timeHelper } from '@shared/lib/helpers'
import { DbFilter, DropDownItems } from '@shared/lib/types'
import { sharedStyles } from '@shared/styles'
import { useAppTheme } from '@shared/theme/hooks'
import { AppDatePickerSingleModal, AppTimePickerModal, ThemedModal } from '@shared/ui'
import { Select } from '@shared/ui/select'
import { FormikProps, useFormik } from 'formik'
import { Keyboard, StyleSheet, View } from 'react-native'
import { Button, Divider, Icon, SegmentedButtons, Text, TextInput } from 'react-native-paper'
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar'
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'
import { Between, FindOptionsWhere, IsNull, Like, Not } from 'typeorm'

type Props = {
    filter: DbFilter<Task, TasksFilterModeType>
    onChangeFilter: (filter: DbFilter<Task, TasksFilterModeType>) => void
    onClose: () => void
}

type FilterEnteredValuesType = {
    [key: string]: any
}

function convertToTaskFilter(
    dbFilter: DbFilter<Task, TasksFilterModeType>,
): TasksFilter {
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
                        Object.entries(value as FindOptionsWhere<Task>)
                            .find(v => v[0] === '_value')!
                            .at(1) as string
                    ).replaceAll('%', '')
                } else if (key === 'date') {
                    //between
                    const valueArr = Object.entries(value as FindOptionsWhere<Task>)
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
    const res: TasksFilter = Object.assign(
        {} as TasksFilter,
        filterEnteredValues,
    ) as TasksFilter
    console.log('TasksFilter obj:', res)

    return res ?? ({} as TasksFilter)
}

function convertToDbFilter(
    filter: TasksFilter,
): DbFilter<Task, TasksFilterModeType> {
    let newFilter: DbFilter<Task, TasksFilterModeType> = {
        mode: filter.mode,
        withDeleted: filter.withDeleted,
    } as DbFilter<Task, TasksFilterModeType>

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
            | FindOptionsWhere<Task>
            | undefined

    newFilter.count = !!newFilter.where
        ? Object.keys(newFilter.where ?? {}).filter(p => p !== 'deletedAt').length
        : 0

    console.log('newFilter:', newFilter)

    return newFilter
}

function onChangeFilterMode(
    item: DropDownItems,
    formik: FormikProps<TasksFilter>,
) {
    switch (item.value as TasksFilterModeType) {
        case 'all': {
            formik.setValues({
                ...formik.values,
                mode: item.value as TasksFilterModeType,
                withDeleted: false,
                date0: undefined,
                date1: undefined,
            })
            break
        }
        case 'today': {
            const date = new Date()

            formik.setValues({
                ...formik.values,
                mode: item.value as TasksFilterModeType,
                withDeleted: false,
                date0: calendarDateHelper.toFormattedStringOrEmpty(
                    date as CalendarDate,
                    'YYYY-MM-DD',
                ),
                date1: calendarDateHelper.toFormattedStringOrEmpty(
                    date as CalendarDate,
                    'YYYY-MM-DD',
                ),
            })
            break
        }
        case 'byPeriod': {
            const date0 = new Date()
            const date1 = new Date(
                new Date().getTime() + ONE_DAY_IN_MILLISECONDS * 7,
            )

            formik.setValues({
                ...formik.values,
                mode: item.value as TasksFilterModeType,
                withDeleted: false,
                date0: calendarDateHelper.toFormattedStringOrEmpty(
                    date0 as CalendarDate,
                    'YYYY-MM-DD',
                ),
                date1: calendarDateHelper.toFormattedStringOrEmpty(
                    date1 as CalendarDate,
                    'YYYY-MM-DD',
                ),
            })
            break
        }
        case 'inTrash': {
            formik.setValues({
                ...formik.values,
                mode: item.value as TasksFilterModeType,
                withDeleted: true,
                date0: undefined,
                date1: undefined,
            })
            break
        }
    }
}

export function ListFilterForm({ filter, onChangeFilter, onClose }: Props) {
    const appTheme = useAppTheme()
    const { success, danger } = appTheme.colors

    const formik: FormikProps<TasksFilter> = useFormik<TasksFilter>({
        initialValues: convertToTaskFilter(filter),
        onReset: (values: TasksFilter) => {
            console.log('Form reset, old data:', values)

            let newFilter = convertToDbFilter({
                mode: 'all',
                withDeleted: false,
            } as TasksFilter)
            onChangeFilter(newFilter)
        },
        onSubmit: (values: TasksFilter) => {
            console.log('Form submit:', values)

            let newFilter = convertToDbFilter(values)
            console.log('Form submit converted:', newFilter)
            onChangeFilter(newFilter)
        },
    })

    return (
        <ThemedModal title="List filter" isVisible={true} onClose={onClose}>
            <Select
                label="Filter mode"
                placeholder="Filter mode..."
                searchPlaceholder="Filter mode..."
                value={formik.values.mode}
                data={filterModesDropDownItems}
                onChange={item => onChangeFilterMode(item, formik)}
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
                                    filterModesDropDownItems.find(
                                        i => i.value === formik.values.mode,
                                    )?.icon
                                }
                                size={20}
                            />
                        </View>
                    )
                }}
            />
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
                        Date from:
                    </Text>
                    <AppDatePickerSingleModal
                        date={calendarDateHelper.toCalendarDate(formik.values.date0)}
                        onConfirm={(params: { date: CalendarDate }) => {
                            formik.setFieldValue(
                                'date0',
                                calendarDateHelper.toFormattedStringOrEmpty(
                                    params.date,
                                    'YYYY-MM-DD',
                                ),
                            )
                        }}
                        locale="ru"
                        mode="single"
                    />
                </View>
                <View style={sharedStyles.col}>
                    <Text variant="labelMedium" style={{ marginLeft: 5 }}>
                        Date to:
                    </Text>
                    <AppDatePickerSingleModal
                        date={calendarDateHelper.toCalendarDate(formik.values.date1)}
                        onConfirm={(params: { date: CalendarDate }) => {
                            formik.setFieldValue(
                                'date1',
                                calendarDateHelper.toFormattedStringOrEmpty(
                                    params.date,
                                    'YYYY-MM-DD',
                                ),
                            )
                        }}
                        locale="ru"
                        mode="single"
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
                value={formik.values.status + ''}
                onValueChange={formik.handleChange('status')}
                buttons={[
                    {
                        value: 'undefined',
                        label: 'Any',
                    },
                    {
                        value: 'todo',
                        icon: taskStatusIconNames['todo'],
                        label: 'Todo',
                    },
                    {
                        value: 'doing',
                        icon: taskStatusIconNames['doing'],
                        label: 'Doing',
                    },
                    {
                        value: 'done',
                        icon: taskStatusIconNames['done'],
                        label: 'Done',
                    },
                ]}
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
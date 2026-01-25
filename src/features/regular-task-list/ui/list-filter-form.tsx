import { filterModesDropDownItems, RegularTask, RegularTasksFilter, RegularTasksFilterModeType } from '@entities/regular-tasks'
import { ONE_DAY_IN_MILLISECONDS } from '@shared/lib/constants'
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
    filter: DbFilter<RegularTask, RegularTasksFilterModeType>
    onChangeFilter: (filter: DbFilter<RegularTask, RegularTasksFilterModeType>) => void
    onClose: () => void
}

type FilterEnteredValuesType = {
    [key: string]: any
}

function convertToRegularTaskFilter(dbFilter: DbFilter<RegularTask, RegularTasksFilterModeType>): RegularTasksFilter {
    let filterEnteredValues: FilterEnteredValuesType = {
        mode: dbFilter.mode,
        withDeleted: dbFilter.withDeleted,
    }

    if (!!dbFilter && !!dbFilter.where) {
        Object.entries(dbFilter.where)
            .filter(([key, _value]) => key !== 'deletedAt')
            .forEach(([key, value]) => {
                if (key === 'title') {
                    filterEnteredValues[key] = (Object.entries(value as FindOptionsWhere<RegularTask>)
                        .find(v => v[0] === '_value')!
                        .at(1) as string)
                        .replaceAll('%', '')
                } else if (key === 'beginDate') {
                    //between
                    const valueArr = Object.entries(value as FindOptionsWhere<RegularTask>)
                        .find(v => v[0] === '_value')!
                        .at(1) as any

                    filterEnteredValues['beginDate0'] = valueArr[0]
                    filterEnteredValues['beginDate1'] = valueArr[1]
                }
                else if (key === 'endDate') {
                    //between
                    const valueArr = Object.entries(value as FindOptionsWhere<RegularTask>)
                        .find(v => v[0] === '_value')!
                        .at(1) as any

                    filterEnteredValues['endDate0'] = valueArr[0]
                    filterEnteredValues['endDate1'] = valueArr[1]
                }
                else {
                    filterEnteredValues[key] = value
                }
            })
    }

    console.log('filterEnteredValues:', filterEnteredValues)
    const res: RegularTasksFilter = Object.assign({} as RegularTasksFilter, filterEnteredValues) as RegularTasksFilter
    console.log('RegularTasksFilter obj:', res)

    return res ?? {} as RegularTasksFilter
}

function convertToDbFilter(filter: RegularTasksFilter): DbFilter<RegularTask, RegularTasksFilterModeType> {
    let newFilter: DbFilter<RegularTask, RegularTasksFilterModeType> = {
        mode: filter.mode,
        withDeleted: filter.withDeleted
    } as DbFilter<RegularTask, RegularTasksFilterModeType>

    let newFilterElements: FilterEnteredValuesType = {}
    if (
        !stringHelper.isEmpty(filter.beginDate0) &&
        !stringHelper.isEmpty(filter.beginDate1)
    ) {
        newFilterElements['beginDate'] = Between(filter.beginDate0, filter.beginDate1)
    }

    if (
        !stringHelper.isEmpty(filter.endDate0) &&
        !stringHelper.isEmpty(filter.endDate1)
    ) {
        newFilterElements['endDate'] = Between(filter.endDate0, filter.endDate1)
    }

    Object.entries(filter)
        .filter(([name, value]) =>
            value !== 'undefined'
            && typeof value != 'undefined'
            && !(typeof value === 'string' && stringHelper.isEmpty(value))
            && !(['mode', 'withDeleted', 'beginDate0', 'beginDate1', 'endDate0', 'endDate1'].includes(name)) //exclude fields)
        )
        .forEach(([key, value]) => {
            if (key === 'title')
                newFilterElements['title'] = Like(`%${value}%`)
            else
                newFilterElements[key] = value
        })

    if (filter.withDeleted === true) {
        newFilterElements['deletedAt'] = Not(IsNull())
    }

    if (Object.keys(newFilterElements ?? {}).length > 0)
        newFilter.where = { ...newFilterElements } as FindOptionsWhere<RegularTask> | undefined

    newFilter.count = !!newFilter.where
        ? Object.keys(newFilter.where ?? {}).filter(p => p !== 'deletedAt').length
        : 0

    console.log('newFilter:', newFilter)

    return newFilter
}

function onChangeFilterMode(
    item: DropDownItems,
    formik: FormikProps<RegularTasksFilter>,
) {
    switch (item.value as RegularTasksFilterModeType) {
        case 'all': {
            formik.setValues({
                ...formik.values,
                mode: item.value as RegularTasksFilterModeType,
                withDeleted: false,
                beginDate0: undefined,
                beginDate1: undefined,
                endDate0: undefined,
                endDate1: undefined,
            })
            break
        }
        case 'today': {
            const date = new Date()

            formik.setValues({
                ...formik.values,
                mode: item.value as RegularTasksFilterModeType,
                withDeleted: false,
                beginDate0: calendarDateHelper.toFormattedStringOrEmpty(
                    date as CalendarDate,
                    'YYYY-MM-DD',
                ),
                beginDate1: calendarDateHelper.toFormattedStringOrEmpty(
                    date as CalendarDate,
                    'YYYY-MM-DD',
                ),
                endDate0: undefined,
                endDate1: undefined,
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
                mode: item.value as RegularTasksFilterModeType,
                withDeleted: undefined,
                beginDate0: calendarDateHelper.toFormattedStringOrEmpty(
                    date0 as CalendarDate,
                    'YYYY-MM-DD',
                ),
                beginDate1: calendarDateHelper.toFormattedStringOrEmpty(
                    date1 as CalendarDate,
                    'YYYY-MM-DD',
                ),
            })
            break
        }
        case 'inTrash': {
            formik.setValues({
                ...formik.values,
                mode: item.value as RegularTasksFilterModeType,
                withDeleted: true,
                beginDate0: undefined,
                beginDate1: undefined,
                endDate0: undefined,
                endDate1: undefined,
            })
            break
        }
    }
}

export function ListFilterForm({ filter, onChangeFilter, onClose }: Props) {
    const appTheme = useAppTheme()
    const { success, danger } = appTheme.colors

    const formik = useFormik({
        initialValues: convertToRegularTaskFilter(filter),
        onReset: (values: RegularTasksFilter) => {
            console.log('Form reset, old data:', values)

            let newFilter = convertToDbFilter({
                mode: 'all',
                withDeleted: undefined
            } as RegularTasksFilter)
            onChangeFilter(newFilter)
        },
        onSubmit: (values: RegularTasksFilter) => {
            console.log('Form submit:', values)

            let newFilter = convertToDbFilter(values)
            onChangeFilter(newFilter)
        }
    })

    return (
        <ThemedModal
            title='List filter'
            isVisible={true}
            onClose={onClose}
        >
            <Select
                label='Filter mode'
                placeholder='Filter mode...'
                searchPlaceholder='Filter mode...'
                value={formik.values.mode}
                data={filterModesDropDownItems}
                onChange={item => onChangeFilterMode(item, formik)}
                renderItemIcon={(item: DropDownItems, selected?: boolean | undefined) => {
                    return (
                        <View style={{ marginRight: 5 }}>
                            <Icon
                                source={item.icon}
                                size={20}
                            />
                        </View>
                    )
                }}
                renderLeftIcon={(isFocus: boolean,
                    focusedColor: string | undefined,
                    unFocusedColor: string | undefined) => {
                    return (
                        <View style={{ marginLeft: 5 }}>
                            <Icon
                                color={isFocus ? focusedColor : unFocusedColor}
                                source={filterModesDropDownItems.find(i => i.value === formik.values.mode)?.icon}
                                size={20}
                            />
                        </View>
                    )
                }}
            />
            <TextInput
                label='id'
                placeholder='id'
                keyboardType='numeric'
                onChangeText={(v: string) => formik.setFieldValue('id', stringHelper.isEmpty(v) ? undefined : parseInt(v, 10))}
                onBlur={formik.handleBlur('id')}
                value={(typeof formik.values.id === 'undefined') ? '' : formik.values.id + ''}
                mode='outlined'
                dense={true}
                onSubmitEditing={Keyboard.dismiss}
            />

            <Divider style={styles.divider0} />

            <AppTimePickerModal
                use24HourClock={true}
                hours={timeHelper.getHoursFromStringOrUndefined(formik.values.time)}
                minutes={timeHelper.getMinutesFromStringOrUndefined(formik.values.time)}
                onConfirm={(hoursAndMinutes: { hours: number | undefined, minutes: number | undefined }) => {
                    formik.setFieldValue('time', timeHelper.toFormattedStringOrEmpty(hoursAndMinutes, 'hh:mm'))
                }}
                locale='ru'
            />
            <Divider style={styles.divider0} />
            <View style={sharedStyles.row}>
                <View style={sharedStyles.col}>
                    <Text variant='bodyMedium' style={{ marginLeft: 5 }}>From begin date</Text>
                    <AppDatePickerSingleModal
                        date={formik.values.beginDate0 as CalendarDate}
                        onConfirm={(params: { date: CalendarDate }) => {
                            formik.setFieldValue('beginDate0', calendarDateHelper.toFormattedStringOrEmpty(params.date, 'YYYY-MM-DD'))
                        }}
                        locale='ru'
                        mode='single'
                    />
                </View>
                <View style={sharedStyles.col}>
                    <Text variant='bodyMedium' style={{ marginLeft: 5 }}>To begin date</Text>
                    <AppDatePickerSingleModal
                        date={formik.values.beginDate1 as CalendarDate}
                        onConfirm={(params: { date: CalendarDate }) => {
                            formik.setFieldValue('beginDate1', calendarDateHelper.toFormattedStringOrEmpty(params.date, 'YYYY-MM-DD'))
                        }}
                        locale='ru'
                        mode='single'
                    />
                </View>
            </View>
            <Divider style={styles.divider0} />
            <View style={sharedStyles.row}>
                <View style={sharedStyles.col}>
                    <Text variant='bodyMedium' style={{ marginLeft: 5 }}>From end date</Text>
                    <AppDatePickerSingleModal
                        date={formik.values.endDate0 as CalendarDate}
                        onConfirm={(params: { date: CalendarDate }) => {
                            formik.setFieldValue('endDate0', calendarDateHelper.toFormattedStringOrEmpty(params.date, 'YYYY-MM-DD'))
                        }}
                        locale='ru'
                        mode='single'
                    />
                </View>
                <View style={sharedStyles.col}>
                    <Text variant='bodyMedium' style={{ marginLeft: 5 }}>To end date</Text>
                    <AppDatePickerSingleModal
                        date={formik.values.endDate1 as CalendarDate}
                        onConfirm={(params: { date: CalendarDate }) => {
                            formik.setFieldValue('endDate1', calendarDateHelper.toFormattedStringOrEmpty(params.date, 'YYYY-MM-DD'))
                        }}
                        locale='ru'
                        mode='single'
                    />
                </View>
            </View>
            <Divider style={styles.divider0} />
            <TextInput
                label='title contains'
                placeholder='title contains'
                multiline={true}
                numberOfLines={5}
                onChangeText={formik.handleChange('title')}
                onBlur={formik.handleBlur('title')}
                value={formik.values.title ?? ''}
                mode='outlined'
                dense={true}
                onSubmitEditing={Keyboard.dismiss}
            />
            <Divider style={styles.divider0} />
            <SegmentedButtons
                value={formik.values.isImportant + ''}
                onValueChange={(v) => formik.setFieldValue('isImportant', v === 'undefined' ? undefined : (v === 'true'))}
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
                onValueChange={(v) => formik.setFieldValue('isUrgent', v === 'undefined' ? undefined : (v === 'true'))}
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

            <View style={sharedStyles.row}>
                <Button
                    onPress={(e) => formik.handleReset(e)}
                    disabled={!formik.isValid}
                    mode='contained'
                >
                    Clear filter
                </Button>
                <Button
                    onPress={() => formik.handleSubmit()}
                    disabled={!formik.isValid}
                    icon={{ source: 'filter', direction: 'ltr' }}
                    mode='contained'
                >
                    Filter
                </Button>
                <Button
                    onPress={onClose}
                    mode='outlined'
                >
                    Cancel
                </Button>
            </View>
        </ThemedModal >
    )
}

const styles = StyleSheet.create({
    divider0: {
        marginVertical: 5,
        backgroundColor: 'transparent'
    },
    divider1: {
        marginVertical: 15,
        backgroundColor: 'transparent'
    }
})
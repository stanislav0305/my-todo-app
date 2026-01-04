import { RegularTask } from '@entities/regular-tasks'
import { calendarDateHelper, stringHelper, timeHelper } from '@shared/lib/helpers'
import { sharedStyles } from '@shared/styles'
import { useAppTheme } from '@shared/theme/hooks'
import { AppDatePickerSingleModal, AppTimePickerModal, ThemedModal } from '@shared/ui'
import { useFormik } from 'formik'
import { Keyboard, StyleSheet, View } from 'react-native'
import { Button, Divider, SegmentedButtons, TextInput } from 'react-native-paper'
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar'
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'
import { FindOptionsWhere, Like } from 'typeorm'


type Props = {
    filter: FindOptionsWhere<RegularTask> | undefined
    onChangeFilter: (filter: FindOptionsWhere<RegularTask> | undefined) => void
    onClose: () => void
}

type FilterEnteredValuesType = {
    [key: string]: any;
}

function convertFilterToRegTask(filter: FindOptionsWhere<RegularTask> | undefined): RegularTask {
    let filterEnteredValues: FilterEnteredValuesType = {}

    if (!!filter) {
        Object.entries(filter).forEach(([key, value]) => {
            if (key === 'title') {
                filterEnteredValues[key] = (Object.entries(value as FindOptionsWhere<RegularTask>)
                    .find(v => v[0] === '_value')!
                    .at(1) as string)
                    .replaceAll('%', '')
            }
            else {
                filterEnteredValues[key] = value
            }
        })
    }

    console.log('filterEnteredValues:', filterEnteredValues)
    const res: RegularTask = Object.assign({} as RegularTask, filterEnteredValues) as RegularTask
    console.log('Task obj:', res)

    return res ?? {} as RegularTask
}

function convertRegTaskToFilter(task: RegularTask): FindOptionsWhere<RegularTask> | undefined {
    let newFilterElements: FilterEnteredValuesType = {}

    Object.entries(task)
        .filter(([_, value]) =>
            value !== 'undefined'
            && typeof value != 'undefined'
            && !(typeof value === 'string' && stringHelper.isEmpty(value))
        )
        .forEach(([key, value]) => {
            if (key === 'title')
                newFilterElements['title'] = Like(`%${value}%`)
            else
                newFilterElements[key] = value
        })

    let newFilter: FindOptionsWhere<RegularTask> | undefined = undefined
    if (Object.keys(newFilterElements ?? {}).length > 0)
        newFilter = { ...newFilterElements } as FindOptionsWhere<RegularTask> | undefined

    console.log('newFilter:', newFilter)

    return newFilter
}

export function ListFilterForm({ filter, onChangeFilter, onClose }: Props) {
    const appTheme = useAppTheme()
    const { success, danger } = appTheme.colors

    const onConfirmTimePicker = (hoursAndMinutes: { hours: number | undefined, minutes: number | undefined }) => {
        const timeStr = timeHelper.toFormattedStringOrEmpty(hoursAndMinutes, 'hh:mm')
        console.log('selected time in form:', timeStr)
        formik.setFieldValue('time', timeStr)
    }

    const onConfirmDatePicker = (date: CalendarDate) => {
        const dateStr = calendarDateHelper.toFormattedStringOrEmpty(date, 'YYYY-MM-DD')
        console.log('selected date in form:', dateStr)
        formik.setFieldValue('date', dateStr)
    }

    const formik = useFormik({
        initialValues: convertFilterToRegTask(filter),
        onReset: (values: RegularTask) => {
            console.log('Form reset, old data:', values)

            let newFilter = convertRegTaskToFilter({} as RegularTask)
            onChangeFilter(newFilter)
        },
        onSubmit: (values: RegularTask) => {
            console.log('Form submit:', values)

            let newFilter = convertRegTaskToFilter(values)
            onChangeFilter(newFilter)
        }
    })

    return (
        <ThemedModal
            title='List filter'
            isVisible={true}
            onClose={onClose}
        >
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
                onConfirm={(hoursAndMinutes) => onConfirmTimePicker(hoursAndMinutes)}
                locale='ru'
            />
            <Divider style={styles.divider0} />
            <AppDatePickerSingleModal
                date={formik.values.from as CalendarDate}
                onConfirm={(params: { date: CalendarDate }) => {
                    onConfirmDatePicker(params.date)
                }}
                locale='ru'
                mode='single'
            />
            <Divider style={styles.divider0} />
            <TextInput
                label='title contains'
                placeholder='title contains'
                multiline={true}
                numberOfLines={5}
                onChangeText={formik.handleChange('title')}
                onBlur={formik.handleBlur('title')}
                value={(typeof formik.values.title === 'undefined') ? '' : (formik.values.title + '')}
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
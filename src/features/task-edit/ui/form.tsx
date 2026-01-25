import { sharedStyles } from '@/src/shared/styles'
import { useAppTheme } from '@/src/shared/theme/hooks'
import { Task, taskStatusIconNames } from '@entities/tasks'
import { calendarDateHelper, dateHelper, timeHelper } from '@shared/lib/helpers'
import {
    AppDatePickerSingleModal, AppTimePickerModal, CustomCheckbox, FormErrorText,
    ThemedModal
} from '@shared/ui'
import { useFormik } from 'formik'
import { Keyboard, StyleSheet, View } from 'react-native'
import { Button, Divider, Icon, SegmentedButtons, Text, TextInput } from 'react-native-paper'
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar'
import * as Yup from 'yup'

const taskEditSchema = Yup.object().shape({
    title: Yup.string()
        .min(1, 'Min value length is 1')
        .max(300, 'Max value length is 300')
        .required('This is required'),
})

type Props = {
    item: Task
    onChangeItem: (task: Task, withListReload: boolean) => void
    onClose: () => void
}

export function TaskEditFormModal({ item, onChangeItem, onClose }: Props) {
    const onConfirmTimePicker = (hoursAndMinutes: {
        hours: number | undefined
        minutes: number | undefined
    }) => {
        const timeStr = timeHelper.toFormattedStringOrEmpty(hoursAndMinutes, 'hh:mm')
        console.log('selected time in form:', timeStr)
        formik.setFieldValue('time', timeStr)
    }

    const formik = useFormik({
        initialValues: item,
        validationSchema: taskEditSchema,
        onSubmit: (values: Task) => {
            console.log('Form submit:', values)
            const withListReload = !values.id || values.time !== item.time || values.date !== item.date

            onChangeItem(values, withListReload)
        },
    })

    const appTheme = useAppTheme()
    const { success, danger } = appTheme.colors

    return (
        <ThemedModal
            title={!!formik.values.id ? 'Update task' : 'Add task'}
            isVisible={true}
            onClose={onClose}
        >
            {!!formik.values.id && (
                <View style={sharedStyles.row}>
                    <Text variant="labelMedium">id:</Text>
                    <Text variant="labelMedium">{formik.values.id}</Text>
                </View>
            )}
            <Divider style={styles.divider0} />
            <AppTimePickerModal
                use24HourClock={true}
                hours={timeHelper.getHoursFromStringOrUndefined(formik.values.time)}
                minutes={timeHelper.getMinutesFromStringOrUndefined(formik.values.time)}
                onConfirm={hoursAndMinutes => onConfirmTimePicker(hoursAndMinutes)}
                locale="ru"
            />
            <Divider style={styles.divider0} />
            <AppDatePickerSingleModal
                date={calendarDateHelper.toCalendarDate(formik.values.date)}
                onConfirm={(params: { date: CalendarDate }) => {
                    formik.setFieldValue(
                        'date',
                        calendarDateHelper.toFormattedStringOrEmpty(
                            params.date,
                            'YYYY-MM-DD',
                        ),
                    )
                }}
                locale="ru"
                mode="single"
            />
            <Divider style={styles.divider0} />
            <TextInput
                multiline={true}
                numberOfLines={5}
                onChangeText={formik.handleChange('title')}
                onBlur={formik.handleBlur('title')}
                value={formik.values.title ?? ''}
                label='title'
                placeholder='title'
                mode='outlined'
                dense={true}
                onSubmitEditing={Keyboard.dismiss}
            />
            {!!formik.errors.title && (
                <FormErrorText>{formik.errors.title}</FormErrorText>
            )}
            <Divider style={styles.divider0} />
            <SegmentedButtons
                value={formik.values.status}
                onValueChange={formik.handleChange('status')}
                buttons={[
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
            {!!formik.errors.status && (
                <FormErrorText>{formik.errors.status}</FormErrorText>
            )}
            <Divider style={styles.divider0} />
            <CustomCheckbox
                checkBoxState={formik.values.isImportant ? 'checked' : 'unchecked'}
                onPress={() =>
                    formik.setFieldValue('isImportant', !formik.values.isImportant)
                }
            >
                <Text variant="labelMedium">is important</Text>
                <Icon source="chevron-double-up" size={20} color={success} />
            </CustomCheckbox>
            <Divider style={styles.divider0} />
            <CustomCheckbox
                checkBoxState={formik.values.isUrgent ? 'checked' : 'unchecked'}
                onPress={() =>
                    formik.setFieldValue('isUrgent', !formik.values.isUrgent)
                }
            >
                <Text variant="labelMedium">is urgent</Text>
                <Icon source="fire" size={20} color={danger} />
            </CustomCheckbox>

            <Divider style={styles.divider1} />

            <View style={sharedStyles.row}>
                <Text variant="labelMedium">created at:</Text>
                <Text variant="labelMedium">{dateHelper.dbStrDateToFormattedString(formik.values.createdAt, 'DD/MM/YYYY hh:mm:ss')}
                </Text>
            </View>
            <View style={sharedStyles.row}>
                <Text variant='labelMedium'>update at:</Text>
                <Text variant='labelMedium'>{dateHelper.dbStrDateToFormattedString(formik.values.updateAt, 'DD/MM/YYYY hh:mm:ss')}
                </Text>
            </View>
            <View style={sharedStyles.row}>
                <Text variant='labelMedium'>deleted at:</Text>
                <Text variant='labelMedium'>{dateHelper.dbStrDateToFormattedString(formik.values.deletedAt, 'DD/MM/YYYY hh:mm:ss')}
                </Text>
            </View>

            <View style={sharedStyles.btnRow}>
                <Button
                    onPress={() => formik.handleSubmit()}
                    disabled={!formik.isValid}
                    icon={{
                        source: !!formik.values.id ? 'pencil' : 'plus-thick',
                        direction: 'ltr',
                    }}
                    mode="contained"
                >
                    Save
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
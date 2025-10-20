import { Task, taskStatusIconNames } from '@entities/tasks-management'
import { calendarDateHelper, timeHelper } from '@shared/lib/helpers'
import { sharedStyles } from '@shared/styles'
import { FormErrorText, ThemedModal } from '@shared/ui'
import { useFormik } from 'formik'
import { View } from 'react-native'
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper'
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar'
import * as Yup from 'yup'
import { AppDatePickerSingleModal } from './app-date-picker-single-modal'
import { AppTimePickerModal } from './app-time-picker-modal'


const taskEditSchema = Yup.object().shape({
    title: Yup.string()
        .min(1, 'Min value length is 1')
        .max(300, 'Max value length is 300')
        .required('This is required'),
})

type Props = {
    item: Task
    onChangeItem: (word: Task) => void
    onClose: () => void
}

export function TaskEditFormModal({ item, onChangeItem, onClose }: Props) {

    const onConfirmTimePicker = (hoursAndMinutes: { hours: number | undefined, minutes: number | undefined }) => {
        console.log('selected time in form:', hoursAndMinutes)
        formik.setFieldValue('time', timeHelper.toFormattedStringOrEmpty(hoursAndMinutes))
    }

    const onConfirmDatePicker = (params: { date: CalendarDate }) => {
        console.log('selected date  in form:', params.date?.toString())
        formik.setFieldValue('date', calendarDateHelper.isUndefined(params.date) ? '' : params.date!.toDateString())
    }

    const formik = useFormik({
        initialValues: item,
        validationSchema: taskEditSchema,
        onSubmit: (values: Task) => {
            console.log('Form submit:', values)
            onChangeItem(values)
        }
    })

    return (
        <ThemedModal
            title={item.key ? 'Update task' : 'Add task'}
            isVisible={true}
            onClose={onClose}
        >
            {item.key &&

                <>
                    <Text variant='labelMedium'>key:</Text>
                    <Text variant='bodyMedium'>{item.key}</Text>
                </>
            }

            <AppTimePickerModal
                use24HourClock={true}
                hours={timeHelper.getHoursFromStringOrUndefined(item.time)}
                minutes={timeHelper.getMinutesFromStringOrUndefined(item.time)}
                onConfirm={(hoursAndMinutes) => onConfirmTimePicker(hoursAndMinutes)}
                locale='ru'
            />

            <AppDatePickerSingleModal
                date={calendarDateHelper.toCalendarDate(item.date)}
                onConfirm={(params: { date: CalendarDate }) => {
                    onConfirmDatePicker(params)
                }}
                locale='ru'
                mode='single'
            />

            <Text variant='labelMedium'>title:</Text>
            <TextInput
                onChangeText={formik.handleChange('title')}
                onBlur={formik.handleBlur('title')}
                value={formik.values.title + ''}
                placeholder='title'
                mode='outlined'
                dense={true}
            />
            {formik.errors.title && <FormErrorText>{formik.errors.title}</FormErrorText>}

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
            {formik.errors.status && <FormErrorText>{formik.errors.status}</FormErrorText>}

            <View style={sharedStyles.btnRow}>
                <Button
                    onPress={() => formik.handleSubmit()}
                    disabled={!formik.isValid}
                    icon={{ source: item.key ? 'pencil' : 'plus-thick', direction: 'ltr' }}
                    mode='contained'
                >
                    Save
                </Button>
                <Button
                    onPress={onClose}
                    mode='outlined'
                >
                    Cancel
                </Button>
            </View>
        </ThemedModal>
    )
}
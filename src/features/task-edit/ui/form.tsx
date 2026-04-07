import { ActualTaskViewExtendedRepository } from '@/src/entities/actual-tasks'
import { AppDispatchType } from '@/src/shared/lib/hooks'
import { selectAppTheme } from '@/src/shared/theme/model'
import { createTask, findOneTask, Task, TaskExtendedRepository, taskStatusIconNames, updateTask } from '@entities/tasks'
import { calendarDateHelper, dateHelper, timeHelper } from '@shared/lib/helpers'
import { sharedStyles } from '@shared/styles'
import { AppTheme } from '@shared/theme/lib'
import { AppDatePickerSingleModal, AppTimePickerModal, CustomCheckbox, FormErrorText, ThemedModal } from '@shared/ui'
import { FormikBag, FormikProps, withFormik } from 'formik'
import { PureComponent } from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'
import { Button, Divider, Icon, SegmentedButtons, Text, TextInput } from 'react-native-paper'
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar'
import { connect } from 'react-redux'
import * as Yup from 'yup'


const taskEditSchema = Yup.object().shape({
    title: Yup.string()
        .min(1, 'Min value length is 1')
        .max(300, 'Max value length is 300')
        .required('This is required'),
})


interface Props {
    appTheme: AppTheme
    taskRep: TaskExtendedRepository
    actualTaskViewRep: ActualTaskViewExtendedRepository
    dispatch: AppDispatchType
    id: number
    item: Task
    onSavedItem: (task: Task) => void
    onClose: () => void
}

export class TaskEditForm extends PureComponent<Props & FormikProps<Task>> {
    taskRep: TaskExtendedRepository
    actualTaskViewRep: ActualTaskViewExtendedRepository

    /* constructor(props: Props & FormikProps<Task>) {
         super(props)
     }*/

    componentDidMount(): void {
        const { dispatch, id, taskRep } = this.props
        console.log('------------------')
        console.log('id', id)
        dispatch(findOneTask({ taskRep, id }))
        console.log('------------------')
    }

    onConfirmTimePicker(hoursAndMinutes: {
        hours: number | undefined
        minutes: number | undefined
    }) {
        const { setFieldValue } = this.props
        const timeStr = timeHelper.toFormattedStringOrEmpty(hoursAndMinutes, 'hh:mm')
        console.log('selected time in form:', timeStr)
        setFieldValue('time', timeStr)
    }

    render() {
        const { handleSubmit, setFieldValue, handleBlur, handleChange, isValid,
            errors, values, onClose, appTheme } = this.props

        const { success, danger } = appTheme.colors

        return (
            <ThemedModal
                title={!!values.id ? 'Update task' : 'Add task'}
                isVisible={true}
                onClose={onClose}
            >
                {!!values.id && (
                    <View style={sharedStyles.row}>
                        <Text variant="labelMedium">id:</Text>
                        <Text variant="labelMedium">{values.id}</Text>
                    </View>
                )}
                <Divider style={styles.divider0} />
                <AppTimePickerModal
                    use24HourClock={true}
                    hours={timeHelper.getHoursFromStringOrUndefined(values.time)}
                    minutes={timeHelper.getMinutesFromStringOrUndefined(values.time)}
                    onConfirm={hoursAndMinutes => this.onConfirmTimePicker(hoursAndMinutes)}
                    locale="ru"
                />
                <Divider style={styles.divider0} />
                <AppDatePickerSingleModal
                    date={calendarDateHelper.toCalendarDate(values.date)}
                    onConfirm={(params: { date: CalendarDate }) => {
                        setFieldValue(
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
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                    value={values.title ?? ''}
                    label='title'
                    placeholder='title'
                    mode='outlined'
                    dense={true}
                    onSubmitEditing={Keyboard.dismiss}
                />
                {!!errors.title && (
                    <FormErrorText>{errors.title}</FormErrorText>
                )}
                <Divider style={styles.divider0} />
                <SegmentedButtons
                    value={values.status}
                    onValueChange={handleChange('status')}
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
                {!!errors.status && (
                    <FormErrorText>{errors.status}</FormErrorText>
                )}
                <Divider style={styles.divider0} />
                <CustomCheckbox
                    checkBoxState={values.isImportant ? 'checked' : 'unchecked'}
                    onPress={() =>
                        setFieldValue('isImportant', !values.isImportant)
                    }
                >
                    <Text variant="labelMedium">is important</Text>
                    <Icon source="chevron-double-up" size={20} color={success} />
                </CustomCheckbox>
                <Divider style={styles.divider0} />
                <CustomCheckbox
                    checkBoxState={values.isUrgent ? 'checked' : 'unchecked'}
                    onPress={() =>
                        setFieldValue('isUrgent', !values.isUrgent)
                    }
                >
                    <Text variant="labelMedium">is urgent</Text>
                    <Icon source="fire" size={20} color={danger} />
                </CustomCheckbox>

                <Divider style={styles.divider1} />

                <View style={sharedStyles.row}>
                    <Text variant="labelMedium">created at:</Text>
                    <Text variant="labelMedium">{dateHelper.dbStrDateToFormattedString(values.createdAt, 'DD/MM/YYYY hh:mm:ss')}
                    </Text>
                </View>
                <View style={sharedStyles.row}>
                    <Text variant='labelMedium'>update at:</Text>
                    <Text variant='labelMedium'>{dateHelper.dbStrDateToFormattedString(values.updateAt, 'DD/MM/YYYY hh:mm:ss')}
                    </Text>
                </View>
                <View style={sharedStyles.row}>
                    <Text variant='labelMedium'>deleted at:</Text>
                    <Text variant='labelMedium'>{dateHelper.dbStrDateToFormattedString(values.deletedAt, 'DD/MM/YYYY hh:mm:ss')}
                    </Text>
                </View>

                <View style={sharedStyles.btnRow}>
                    <Button
                        onPress={() => handleSubmit()}
                        disabled={!isValid}
                        icon={{
                            source: !!values.id ? 'pencil' : 'plus-thick',
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
            </ThemedModal >
        )
    }
}

//--------------------------------------------------

const TaskEditFormModalComponent = withFormik<Props, Task>({
    enableReinitialize: true,
    mapPropsToValues: ({ item }) => {
        return item
    },
    validate: () => undefined,
    validationSchema: taskEditSchema,
    handleSubmit: async (values: Task, formikBag: FormikBag<Props, Task>) => {
        console.log('Form submit:', JSON.stringify(values, null, 2))

        const { item, onSavedItem, taskRep, actualTaskViewRep, dispatch } = formikBag.props
        await dispatch(!!item.id
            ? updateTask({ taskRep, actualTaskViewRep, item: values, })
            : createTask({ taskRep, actualTaskViewRep, item: values })
        )

        !!onSavedItem && onSavedItem(values)
    }
})(TaskEditForm)

//--------------------------------------------------

const mapStateToProps = (state: RootState, ownProps: ownPropsType) => {
    return {
        appTheme: selectAppTheme(state),
        item: state.tasks.currentItem,
    } as Props & FormikProps<Task>
}

const mapDispatchToProps = (dispatch: AppDispatchType) => {
    return {
        dispatch: dispatch,
    } as Props
}

type ownPropsType = {
    taskRep: TaskExtendedRepository
    actualTaskViewRep: ActualTaskViewExtendedRepository
    id: number
    onSavedItem: (task: Task) => void
    onClose: () => void
}

function mergeProps(
    stateProps: Props & FormikProps<Task>,
    dispatchProps: Props,
    ownProps: ownPropsType,
) {
    return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export const TaskEditFormModal = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,

)(TaskEditFormModalComponent)

//--------------------------------------------------

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
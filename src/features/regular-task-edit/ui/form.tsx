import { ActualTaskViewExtendedRepository } from '@entities/actual-tasks'
import {
    createRegTask,
    createRegTaskWeek,
    findAnyOneRegTask,
    periodNamesDropDownItems, RegularTaskExtendedRepository, RegularTaskModel, RegularTaskViewExtendedRepository, RegularTaskWeekExtendedRepository,
    updateRegTask,
    updateRegTaskWeek
} from '@entities/regular-tasks'
import { MaterialIcons } from '@expo/vector-icons'
import { calendarDateHelper, dateHelper, numberHelper, stringHelper, timeHelper } from '@shared/lib/helpers'
import { AppDispatchType } from '@shared/lib/hooks'
import { sharedStyles } from '@shared/styles'
import { AppTheme } from '@shared/theme/lib'
import { selectAppTheme } from '@shared/theme/model'
import {
    AppDatePickerSingleModal, AppText, AppTimePickerModal, BorderedView, CustomCheckbox, FormErrorText, ThemedModal
} from '@shared/ui'
import { Select } from '@shared/ui/select'
import { FormikBag, FormikProps, withFormik } from 'formik'
import React, { PureComponent } from 'react'
import { Keyboard, OpaqueColorValue, StyleSheet, View } from 'react-native'
import { Button, Divider, Icon, Surface, Text, TextInput } from 'react-native-paper'
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar'
import { connect } from 'react-redux'
import * as Yup from 'yup'
import { RegularTaskInfo } from './regular-task-info'
import { WeekDayButton } from './week-day-button'


const regularTaskEditSchema = Yup.object<RegularTaskModel>().shape({
    title: Yup.string()
        .min(1, 'Min value length is 1')
        .max(300, 'Max value length is 300')
        .required('This is required'),
    period: Yup.string()
        .required('This is required'),
    periodSize: Yup.number()
        .min(1, 'Min value is 1')
        .required('This is required')
        .when(
            'period',
            (period, schema) => ((!!period && period + '' === 'everyDay') ? schema.max(365, 'Max value is 365 days') : schema),
        )
        .when(
            'period',
            (period, schema) => ((!!period && period + '' === 'everyWeek') ? schema.max(52, 'Max value is 52 weeks') : schema),
        )
        .when(
            'period',
            (period, schema) => ((!!period && period + '' === 'everyMonth') ? schema.max(12, 'Max value is 12 months') : schema),
        )
        .when(
            'period',
            (period, schema) => ((!!period && period + '' === 'everyYear') ? schema.max(10, 'Max value is 10 years') : schema),
        ),
    su: Yup.boolean(),
    mo: Yup.boolean(),
    tu: Yup.boolean(),
    we: Yup.boolean(),
    th: Yup.boolean(),
    fr: Yup.boolean(),
    sa: Yup.boolean(),
})
    .test(
        'at-least-one-of-week-day',
        'At least one of week day',
        function (value) {
            if (value.period === 'everyWeek'
                && (typeof value.su === 'undefined' || value.su === false)
                && (typeof value.mo === 'undefined' || value.mo === false)
                && (typeof value.tu === 'undefined' || value.tu === false)
                && (typeof value.we === 'undefined' || value.we === false)
                && (typeof value.th === 'undefined' || value.th === false)
                && (typeof value.fr === 'undefined' || value.fr === false)
                && (typeof value.sa === 'undefined' || value.sa === false)) {
                return this.createError({
                    path: 'su', // Specify which field the error message attaches to
                    message: 'You must specify at least one of the following days of the week: su, mo, tu, we, th, fr, sa',
                })
            }

            return true // Validation passes
        }
    )

type Props = {
    appTheme: AppTheme
    actualTaskViewRep: ActualTaskViewExtendedRepository
    regularTaskRep: RegularTaskExtendedRepository
    regularTaskViewRep: RegularTaskViewExtendedRepository
    regularTaskWeekRep: RegularTaskWeekExtendedRepository
    dispatch: AppDispatchType
    id: number
    //period: Period
    item: RegularTaskModel
    onSavedItem: (regTask: RegularTaskModel) => void
    onClose: () => void
}

export class RegularTaskEditForm extends PureComponent<Props & FormikProps<RegularTaskModel>> {
    actualTaskViewRep: ActualTaskViewExtendedRepository
    regularTaskRep: RegularTaskExtendedRepository
    regularTaskViewRep: RegularTaskViewExtendedRepository
    regularTaskWeekRep: RegularTaskWeekExtendedRepository

    /*constructor(props: Props & FormikProps<RegularTaskModel>) {
        super(props)
    }*/

    componentDidMount(): void {
        const { dispatch, id, regularTaskRep } = this.props
        console.log('------------------')
        console.log(`id: ${id}`)
        dispatch(findAnyOneRegTask({ regularTaskRep, id }))
        console.log('------------------')
    }

    onConfirmTimePicker(hoursAndMinutes: { hours: number | undefined, minutes: number | undefined }) {
        const { setFieldValue } = this.props

        const timeStr = timeHelper.toFormattedStringOrEmpty(hoursAndMinutes, 'hh:mm')
        console.log('selected time in form:', timeStr)
        setFieldValue('time', timeStr)
    }

    render() {
        const { id, handleSubmit, setFieldValue, handleBlur, handleChange, isValid,
            errors, values, onClose, appTheme, setValues } = this.props

        const { success, danger, secondary, secondaryContainer, primary, background } = appTheme.colors

        return (
            <ThemedModal
                title={!!id ? 'Update regular task' : 'Add regular task'}
                isVisible={true}
                onClose={onClose}
            >
                {
                    !!id &&
                    <View style={sharedStyles.row}>
                        <Text variant='labelMedium'>id:</Text>
                        <Text variant='labelMedium'>{id}</Text>
                    </View>
                }
                <Divider style={styles.divider0} />
                <View style={[sharedStyles.row, { alignItems: 'center' }]}>
                    <Text variant='labelMedium'>time:</Text>
                    <AppTimePickerModal
                        use24HourClock={true}
                        hours={timeHelper.getHoursFromStringOrUndefined(values.time)}
                        minutes={timeHelper.getMinutesFromStringOrUndefined(values.time)}
                        onConfirm={(hoursAndMinutes) => this.onConfirmTimePicker(hoursAndMinutes)}
                        locale='ru'
                    />
                </View>
                <Divider style={styles.divider0} />
                <View style={[sharedStyles.row, { alignItems: 'center' }]}>
                    <Text variant='labelMedium'>From date:</Text>
                    <AppDatePickerSingleModal
                        date={calendarDateHelper.toCalendarDate(values.beginDate)}
                        onConfirm={(params: { date: CalendarDate }) => {
                            setValues({
                                ...values,
                                beginDate: calendarDateHelper.toFormattedStringOrEmpty(params.date, 'YYYY-MM-DD'),
                                endDate:
                                    (!stringHelper.isEmpty(values.endDate)
                                        && (!calendarDateHelper.isUndefined(params.date))
                                        && (params.date! < dateHelper.dbStrDateToDate(values.endDate!)))
                                        ? values.endDate
                                        : null
                            })
                        }}
                        locale='ru'
                        mode='single'
                        withDateRemoveBtn={false}
                    />
                </View>
                {(values.period === 'everyMonth'
                    && [29, 30, 31].includes(dateHelper.dbStrDateToMonthDayNumberOrZero(values.beginDate))
                ) &&
                    <BorderedView
                        borderColorType='warning'
                    >
                        <AppText
                            textColor='warning'
                            iconType='warning'
                        >
                            If the date does not exist in the month, the last day of the month will be used.
                        </AppText>
                    </BorderedView>
                }
                {(values.period === 'everyYear'
                    && dateHelper.dbStrDateToMonthDayNumberOrZero(values.beginDate) === 29
                    && dateHelper.dbStrDateToMonthNumberOrZero(values.beginDate) === 2
                ) &&
                    <BorderedView
                        borderColorType='warning'
                    >
                        <AppText
                            textColor='warning'
                            iconType='warning'
                        >
                            The date 29 february is only in leap years, so in non-leap years the last day of the month (28 february) will be used.
                        </AppText>
                    </BorderedView>
                }
                <Divider style={styles.divider0} />
                <View style={[sharedStyles.row, { alignItems: 'center' }]}>
                    <Text variant='labelMedium'>To date:</Text>
                    <AppDatePickerSingleModal
                        date={calendarDateHelper.toCalendarDate(values.endDate)}
                        validRange={{
                            startDate: calendarDateHelper.toCalendarDate(values.beginDate) as CalendarDate
                        }}
                        onConfirm={(params: { date: CalendarDate }) => {
                            setFieldValue('endDate', calendarDateHelper.toFormattedStringOrEmpty(params.date, 'YYYY-MM-DD'))
                        }}
                        locale='ru'
                        mode='single'
                    />
                </View>
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
                {!!errors.title && <FormErrorText>{errors.title}</FormErrorText>}
                <Divider style={styles.divider0} />
                <Select
                    label='period'
                    placeholder='Select period...'
                    searchPlaceholder='Search period...'
                    value={values.period}
                    data={periodNamesDropDownItems}
                    disable={!!id}
                    onChange={(item: any) => {
                        setFieldValue('period', item.value)
                    }}
                    renderLeftIcon={(isFocus: boolean,
                        focusedColor: string | OpaqueColorValue | undefined,
                        unFocusedColor: string | OpaqueColorValue | undefined) => {
                        return (
                            <MaterialIcons
                                style={{ marginLeft: 5 }}
                                color={isFocus ? focusedColor : unFocusedColor}
                                name="view-timeline"
                                size={20}
                            />
                        )
                    }}
                />
                <Divider style={styles.divider0} />
                <View style={sharedStyles.row}>
                    <Surface style={[styles.textInputLabel, {
                        borderColor: secondary,
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5,
                    }]} elevation={4}>
                        <Text style={{ color: primary }}>
                            {'each'}
                        </Text>
                    </Surface>
                    <TextInput
                        mode='outlined'
                        disabled={!!id}
                        style={[styles.periodSizeTextInput,
                        !!id ? {
                            backgroundColor: secondaryContainer,
                            borderColor: secondary,
                        }
                            : {
                                backgroundColor: background,
                                borderColor: secondary,
                            }]
                        }
                        maxLength={3}
                        keyboardType='number-pad'
                        onBlur={handleBlur('periodSize')}
                        value={numberHelper.numberOrUndefinedToStringOrEmpty(values.periodSize)}
                        label='period size'
                        placeholder='period size'
                        dense={true}
                        onSubmitEditing={Keyboard.dismiss}
                        onChangeText={(text: string) => {
                            setFieldValue('periodSize', stringHelper.toNumberOrUndefinedIfNan(text))
                        }}
                    />
                    <Surface style={[styles.textInputLabel, {
                        borderColor: secondary,
                        borderTopRightRadius: 5,
                        borderBottomRightRadius: 5,
                    }]} elevation={4}>
                        <Text style={{ color: primary, padding: 9 }}>
                            {values.period === 'everyDay' && 'days'}
                            {values.period === 'everyWeek' && 'weeks'}
                            {values.period === 'everyMonth' && 'months'}
                            {values.period === 'everyYear' && 'years'}
                        </Text>
                    </Surface>
                </View>
                {!!errors.periodSize && <FormErrorText>{errors.periodSize}</FormErrorText>}
                <Divider style={styles.divider0} />
                {values.period === 'everyWeek' && (
                    <>
                        <View style={[sharedStyles.btnRow, { marginTop: 0 }]}>
                            <WeekDayButton
                                day='mo'
                                disabled={!!id}
                                dayValue={values.mo!}
                                onPress={() => { setFieldValue('mo', !values.mo) }}
                            />
                            <WeekDayButton
                                day='tu'
                                disabled={!!id}
                                dayValue={values.tu!}
                                onPress={() => { setFieldValue('tu', !values.tu) }}
                            />
                            <WeekDayButton
                                day='we'
                                disabled={!!id}
                                dayValue={values.we!}
                                onPress={() => { setFieldValue('we', !values.we) }}
                            />
                            <WeekDayButton
                                day='th'
                                disabled={!!id}
                                dayValue={values.th!}
                                onPress={() => { setFieldValue('th', !values.th) }}
                            />
                            <WeekDayButton
                                day='fr'
                                disabled={!!id}
                                dayValue={values.fr!}
                                onPress={() => { setFieldValue('fr', !values.fr) }}
                            />
                            <WeekDayButton
                                day='sa'
                                disabled={!!id}
                                dayValue={values.sa!}
                                onPress={() => { setFieldValue('sa', !values.sa) }}
                            />
                            <WeekDayButton
                                day='su'
                                disabled={!!id}
                                dayValue={values.su!}
                                onPress={() => { setFieldValue('su', !values.su) }}
                            />
                        </View>
                    </>
                )}
                {!!errors.su && <FormErrorText>{errors.su}</FormErrorText>}
                <Divider style={styles.divider0} />
                <RegularTaskInfo item={values} />
                <Divider style={styles.divider0} />
                <CustomCheckbox
                    checkBoxState={values.isImportant ? 'checked' : 'unchecked'}
                    onPress={() => setFieldValue('isImportant', !values.isImportant)}
                >
                    <Text variant='labelMedium'>is important</Text>
                    <Icon
                        source='chevron-double-up'
                        size={20}
                        color={success}
                    />
                </CustomCheckbox>
                <Divider style={styles.divider0} />
                <CustomCheckbox
                    checkBoxState={values.isUrgent ? 'checked' : 'unchecked'}
                    onPress={() => setFieldValue('isUrgent', !values.isUrgent)}
                >
                    <Text variant='labelMedium'>is urgent</Text>
                    <Icon
                        source='fire'
                        size={20}
                        color={danger}
                    />
                </CustomCheckbox>
                <Divider style={styles.divider1} />
                {!!values.id &&
                    <View>
                        <View style={sharedStyles.row}>
                            <Text variant='labelMedium'>created at:</Text>
                            <Text variant='labelMedium'>{dateHelper.dbStrDateToFormattedString(values.createdAt, 'DD/MM/YYYY hh:mm:ss')}</Text>
                        </View>
                        <View style={sharedStyles.row}>
                            <Text variant='labelMedium'>update at:</Text>
                            <Text variant='labelMedium'>{dateHelper.dbStrDateToFormattedString(values.updateAt, 'DD/MM/YYYY hh:mm:ss')}</Text>
                        </View>
                        {!!values.deletedAt &&
                            <View style={sharedStyles.row}>
                                <Text variant='labelMedium'>deleted at:</Text>
                                <Text variant='labelMedium'>{dateHelper.dbStrDateToFormattedString(values.deletedAt, 'DD/MM/YYYY hh:mm:ss')}</Text>
                            </View>
                        }
                    </View>
                }

                <View style={sharedStyles.btnRow}>
                    <Button
                        onPress={() => handleSubmit()}
                        disabled={!isValid}
                        icon={{ source: id ? 'pencil' : 'plus-thick', direction: 'ltr' }}
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
            </ThemedModal >
        )
    }
}

//--------------------------------------------------

const RegularTaskEditFormModalComponent = withFormik<Props, RegularTaskModel>({
    enableReinitialize: true,
    mapPropsToValues: ({ item }) => {
        return item
    },
    validate: () => undefined,
    validationSchema: regularTaskEditSchema,
    handleSubmit: async (values: RegularTaskModel, formikBag: FormikBag<Props, RegularTaskModel>) => {
        console.log('Form submit:', JSON.stringify(values, null, 2))
        const { regularTaskRep, regularTaskWeekRep, regularTaskViewRep, actualTaskViewRep, item, dispatch, onSavedItem } = formikBag.props
        const oldWeekId = item.weekId

        if (!values.id && values.period !== 'everyWeek') {
            //create daily, monthly or yearly reg task
            await dispatch(createRegTask({ regularTaskRep, regularTaskViewRep, actualTaskViewRep, model: values }))
        } else if (!!values.id && values.period !== 'everyWeek') {
            //update daily, monthly or yearly reg task
            await dispatch(updateRegTask({ regularTaskRep, regularTaskWeekRep, regularTaskViewRep, actualTaskViewRep, model: values, oldWeekId }))
        } else if (!values.id && values.period === 'everyWeek') {
            //create weekly reg task
            await dispatch(createRegTaskWeek({ regularTaskWeekRep, regularTaskViewRep, actualTaskViewRep, model: values }))
        } else if (!!values.id && values.period === 'everyWeek') {
            //update weekly reg task
            await dispatch(updateRegTaskWeek({ regularTaskWeekRep, regularTaskRep, regularTaskViewRep, actualTaskViewRep, model: values, oldWeekId }))
        }

        !!onSavedItem && onSavedItem(values)
    }
})(RegularTaskEditForm)

//--------------------------------------------------

const mapStateToProps = (state: RootState, ownProps: ownPropsType) => {
    console.log('ITEM:', JSON.stringify(state.regularTasks.currentItem, null, 2))
    return {
        appTheme: selectAppTheme(state),
        item: state.regularTasks.currentItem,
    } as Props & FormikProps<RegularTaskModel>
}

const mapDispatchToProps = (dispatch: AppDispatchType) => {
    return {
        dispatch: dispatch,
    } as Props
}

type ownPropsType = {
    actualTaskViewRep: ActualTaskViewExtendedRepository
    regularTaskRep: RegularTaskExtendedRepository
    regularTaskViewRep: RegularTaskViewExtendedRepository
    regularTaskWeekRep: RegularTaskWeekExtendedRepository
    id: number
    //period: Period
    onSavedItem: (regTask: RegularTaskModel) => void
    onClose: () => void
}

function mergeProps(
    stateProps: Props & FormikProps<RegularTaskModel>,
    dispatchProps: Props,
    ownProps: ownPropsType,
) {
    return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export const RegularTaskEditFormModal = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,

)(RegularTaskEditFormModalComponent)

//--------------------------------------------------

const styles = StyleSheet.create({
    divider0: {
        marginVertical: 5,
        backgroundColor: 'transparent'
    },
    divider1: {
        marginVertical: 15,
        backgroundColor: 'transparent'
    },
    button: {
        marginHorizontal: 1,
        marginVertical: 2,
    },
    textInputLabel: {
        marginTop: 6,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: 'transparent'
    },
    periodSizeTextInput: {
        flexGrow: 1,
        margin: 0,
        borderRadius: 0,
    }
})
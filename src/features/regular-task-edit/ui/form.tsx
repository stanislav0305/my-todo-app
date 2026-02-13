import { periodNamesDropDownItems, RegularTaskModel } from '@entities/regular-tasks'
import { MaterialIcons } from '@expo/vector-icons'
import { calendarDateHelper, dateHelper, numberHelper, stringHelper, timeHelper } from '@shared/lib/helpers'
import { sharedStyles } from '@shared/styles'
import { useAppTheme } from '@shared/theme/hooks'
import { AppDatePickerSingleModal, AppText, AppTimePickerModal, BorderedView, CustomCheckbox, FormErrorText, ThemedModal } from '@shared/ui'
import { Select } from '@shared/ui/select'
import { useFormik } from 'formik'
import React from 'react'
import { Keyboard, OpaqueColorValue, StyleSheet, View } from 'react-native'
import { Button, Divider, Icon, Surface, Text, TextInput } from 'react-native-paper'
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar'
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
    item: RegularTaskModel
    onChangeItem: (task: RegularTaskModel, withListReload: boolean) => void
    onClose: () => void
}

export function RegularTaskEditFormModal({ item, onChangeItem, onClose }: Props) {
    const appTheme = useAppTheme()
    const { success, danger, primary, secondary, background } = appTheme.colors

    const onConfirmTimePicker = (hoursAndMinutes: { hours: number | undefined, minutes: number | undefined }) => {
        const timeStr = timeHelper.toFormattedStringOrEmpty(hoursAndMinutes, 'hh:mm')
        console.log('selected time in form:', timeStr)
        formik.setFieldValue('time', timeStr)
    }

    const formik = useFormik({
        initialValues: item,
        validationSchema: regularTaskEditSchema,
        onSubmit: (values: RegularTaskModel) => {
            console.log('Form submit:', values)

            const withListReload = !values.id || values.time !== item.time || values.beginDate !== item.beginDate
                || values.endDate !== item.endDate
                || (!!values.id && values.period === 'everyWeek')

            onChangeItem(values, withListReload)
        }
    })

    return (
        <ThemedModal
            title={!!item.id ? 'Update regular task' : 'Add regular task'}
            isVisible={true}
            onClose={onClose}
        >
            {
                !!item.id &&
                <View style={sharedStyles.row}>
                    <Text variant='labelMedium'>id:</Text>
                    <Text variant='labelMedium'>{item.id}</Text>
                </View>
            }
            <Divider style={styles.divider0} />
            <View style={[sharedStyles.row, { alignItems: 'center' }]}>
                <Text variant='labelMedium'>time:</Text>
                <AppTimePickerModal
                    use24HourClock={true}
                    hours={timeHelper.getHoursFromStringOrUndefined(formik.values.time)}
                    minutes={timeHelper.getMinutesFromStringOrUndefined(formik.values.time)}
                    onConfirm={(hoursAndMinutes) => onConfirmTimePicker(hoursAndMinutes)}
                    locale='ru'
                />
            </View>
            <Divider style={styles.divider0} />
            <View style={[sharedStyles.row, { alignItems: 'center' }]}>
                <Text variant='labelMedium'>From date:</Text>
                <AppDatePickerSingleModal
                    date={calendarDateHelper.toCalendarDate(formik.values.beginDate)}
                    onConfirm={(params: { date: CalendarDate }) => {
                        formik.setValues({
                            ...formik.values,
                            beginDate: calendarDateHelper.toFormattedStringOrEmpty(params.date, 'YYYY-MM-DD'),
                            endDate:
                                (!stringHelper.isEmpty(formik.values.endDate)
                                    && (!calendarDateHelper.isUndefined(params.date))
                                    && (params.date! < dateHelper.dbStrDateToDate(formik.values.endDate!)))
                                    ? formik.values.endDate
                                    : null
                        })
                    }}
                    locale='ru'
                    mode='single'
                    withDateRemoveBtn={false}
                />
            </View>
            {(formik.values.period === 'everyMonth'
                && [29, 30, 31].includes(dateHelper.dbStrDateToMonthDayNumberOrZero(formik.values.beginDate))
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
            {(formik.values.period === 'everyYear'
                && dateHelper.dbStrDateToMonthDayNumberOrZero(formik.values.beginDate) === 29
                && dateHelper.dbStrDateToMonthNumberOrZero(formik.values.beginDate) === 2
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
                    date={calendarDateHelper.toCalendarDate(formik.values.endDate)}
                    validRange={{
                        startDate: calendarDateHelper.toCalendarDate(formik.values.beginDate) as CalendarDate
                    }}
                    onConfirm={(params: { date: CalendarDate }) => {
                        formik.setFieldValue('endDate', calendarDateHelper.toFormattedStringOrEmpty(params.date, 'YYYY-MM-DD'))
                    }}
                    locale='ru'
                    mode='single'
                />
            </View>
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
            {!!formik.errors.title && <FormErrorText>{formik.errors.title}</FormErrorText>}
            <Divider style={styles.divider0} />
            <Select
                label='period'
                placeholder='Select period...'
                searchPlaceholder='Search period...'
                value={formik.values.period}
                data={periodNamesDropDownItems}
                onChange={(item: any) => {
                    formik.setFieldValue('period', item.value)
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
                    style={[styles.periodSizeTextInput, {
                        backgroundColor: background,
                        borderColor: secondary,
                    }]}
                    maxLength={3}
                    keyboardType='number-pad'
                    onBlur={formik.handleBlur('periodSize')}
                    value={numberHelper.numberOrUndefinedToStringOrEmpty(formik.values.periodSize)}
                    label='period size'
                    placeholder='period size'
                    dense={true}
                    onSubmitEditing={Keyboard.dismiss}
                    onChangeText={(text: string) => {
                        formik.setFieldValue('periodSize', stringHelper.toNumberOrUndefinedIfNan(text))
                    }}
                />
                <Surface style={[styles.textInputLabel, {
                    borderColor: secondary,
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                }]} elevation={4}>
                    <Text style={{ color: primary, padding: 9 }}>
                        {formik.values.period === 'everyDay' && 'days'}
                        {formik.values.period === 'everyWeek' && 'weeks'}
                        {formik.values.period === 'everyMonth' && 'months'}
                        {formik.values.period === 'everyYear' && 'years'}
                    </Text>
                </Surface>
            </View>
            {!!formik.errors.periodSize && <FormErrorText>{formik.errors.periodSize}</FormErrorText>}
            <Divider style={styles.divider0} />
            {formik.values.period === 'everyWeek' && (
                <>
                    <View style={[sharedStyles.btnRow, { marginTop: 0 }]}>
                        <WeekDayButton
                            day='mo'
                            dayValue={formik.values.mo!}
                            onPress={() => { formik.setFieldValue('mo', !formik.values.mo) }}
                        />
                        <WeekDayButton
                            day='tu'
                            dayValue={formik.values.tu!}
                            onPress={() => { formik.setFieldValue('tu', !formik.values.tu) }}
                        />
                        <WeekDayButton
                            day='we'
                            dayValue={formik.values.we!}
                            onPress={() => { formik.setFieldValue('we', !formik.values.we) }}
                        />
                        <WeekDayButton
                            day='th'
                            dayValue={formik.values.th!}
                            onPress={() => { formik.setFieldValue('th', !formik.values.th) }}
                        />
                        <WeekDayButton
                            day='fr'
                            dayValue={formik.values.fr!}
                            onPress={() => { formik.setFieldValue('fr', !formik.values.fr) }}
                        />
                        <WeekDayButton
                            day='sa'
                            dayValue={formik.values.sa!}
                            onPress={() => { formik.setFieldValue('sa', !formik.values.sa) }}
                        />
                        <WeekDayButton
                            day='su'
                            dayValue={formik.values.su!}
                            onPress={() => { formik.setFieldValue('su', !formik.values.su) }}
                        />
                    </View>
                </>
            )}
            {!!formik.errors.su && <FormErrorText>{formik.errors.su}</FormErrorText>}
            <Divider style={styles.divider0} />
            <RegularTaskInfo item={formik.values} />
            <Divider style={styles.divider0} />
            <CustomCheckbox
                checkBoxState={formik.values.isImportant ? 'checked' : 'unchecked'}
                onPress={() => formik.setFieldValue('isImportant', !formik.values.isImportant)}
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
                checkBoxState={formik.values.isUrgent ? 'checked' : 'unchecked'}
                onPress={() => formik.setFieldValue('isUrgent', !formik.values.isUrgent)}
            >
                <Text variant='labelMedium'>is urgent</Text>
                <Icon
                    source='fire'
                    size={20}
                    color={danger}
                />
            </CustomCheckbox>
            <Divider style={styles.divider1} />
            <View style={sharedStyles.row}>
                <Text variant='labelMedium'>created at:</Text>
                <Text variant='labelMedium'>{dateHelper.dbStrDateToFormattedString(item.createdAt, 'DD/MM/YYYY hh:mm:ss')}</Text>
            </View>
            <View style={sharedStyles.row}>
                <Text variant='labelMedium'>update at:</Text>
                <Text variant='labelMedium'>{dateHelper.dbStrDateToFormattedString(item.updateAt, 'DD/MM/YYYY hh:mm:ss')}</Text>
            </View>
            <View style={sharedStyles.row}>
                <Text variant='labelMedium'>deleted at:</Text>
                <Text variant='labelMedium'>{dateHelper.dbStrDateToFormattedString(item.deletedAt, 'DD/MM/YYYY hh:mm:ss')}</Text>
            </View>

            <View style={sharedStyles.btnRow}>
                <Button
                    onPress={() => formik.handleSubmit()}
                    disabled={!formik.isValid}
                    icon={{ source: item.id ? 'pencil' : 'plus-thick', direction: 'ltr' }}
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
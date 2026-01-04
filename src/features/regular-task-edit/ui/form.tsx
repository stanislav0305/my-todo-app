import { periodNamesDropDownItems, RegularTask } from '@entities/regular-tasks'
import { MaterialIcons } from '@expo/vector-icons'
import { calendarDateHelper, dateHelper, numberHelper, stringHelper, timeHelper } from '@shared/lib/helpers'
import { sharedStyles } from '@shared/styles'
import { useAppTheme } from '@shared/theme/hooks'
import { AppDatePickerSingleModal, AppTimePickerModal, CustomCheckbox, FormErrorText, ThemedModal } from '@shared/ui'
import { Select } from '@shared/ui/select'
import { useFormik } from 'formik'
import React from 'react'
import { Keyboard, OpaqueColorValue, StyleSheet, View } from 'react-native'
import { Button, Divider, Icon, Surface, Text, TextInput } from 'react-native-paper'
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar'
import * as Yup from 'yup'
import { WeekDayButton } from './week-day-button'

type RegularTaskPartial = Partial<RegularTask>

const regularTaskEditSchema = Yup.object().shape({
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
})

type Props = {
    item: RegularTask
    onChangeItem: (task: RegularTask) => void
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

    const onConfirmDatePicker = (params: { date: CalendarDate }, fieldName: string) => {
        const dateStr = calendarDateHelper.toFormattedStringOrEmpty(params.date, 'YYYY-MM-DD')
        console.log('selected date from in form:', dateStr)

        formik.setFieldValue(fieldName, params.date as Date)
    }

    const itemPartial: RegularTaskPartial = { ...item }
    console.log('itemPartial:', itemPartial)
    const formik = useFormik({
        initialValues: itemPartial,
        validationSchema: regularTaskEditSchema,
        onSubmit: (values: RegularTaskPartial) => {
            const newItem = Object.assign({} as RegularTask, values) as RegularTask
            console.log('Form submit:', newItem)
            onChangeItem(newItem)
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
                    <Text variant='bodyMedium'>{item.id}</Text>
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
                <Text variant='labelMedium'>from:</Text>
                <AppDatePickerSingleModal
                    date={calendarDateHelper.toCalendarDate(formik.values.from)}
                    onConfirm={(params: { date: CalendarDate }) => {
                        onConfirmDatePicker(params, 'from')
                    }}
                    locale='ru'
                    mode='single'
                    withDateRemoveBtn={false}
                />
            </View>
            <Divider style={styles.divider0} />
            <View style={[sharedStyles.row, { alignItems: 'center' }]}>
                <Text variant='labelMedium'>to:</Text>
                <AppDatePickerSingleModal
                    date={calendarDateHelper.toCalendarDate(formik.values.to)}
                    validRange={{
                        startDate: formik.values.from as CalendarDate
                    }}
                    onConfirm={(params: { date: CalendarDate }) => {
                        onConfirmDatePicker(params, 'to')
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
                value={formik.values.title + ''}
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
            {
                formik.values.period === 'everyWeek' && (
                    <>
                        <View style={sharedStyles.btnRow}>
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
                )
            }
            {
                (formik.values.period === 'everyMonth' || formik.values.period === 'everyYear') && (
                    <>
                        <Divider style={styles.divider0} />
                        <CustomCheckbox
                            checkBoxState={formik.values.useLastDayFix ? 'checked' : 'unchecked'}
                            onPress={() => formik.setFieldValue('useLastDayFix', !formik.values.useLastDayFix)}
                        >
                            <Text variant='labelMedium'>last month day fix</Text>
                            <MaterialIcons
                                style={{ marginLeft: 5 }}
                                name='auto-fix-high'
                                size={20}
                            />
                        </CustomCheckbox>
                    </>
                )
            }

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
                <Text variant='bodyMedium'>{dateHelper.toFormattedString(item.createdAt, 'DD/MM/YYYY hh:mm:ss')}</Text>
            </View>
            <View style={sharedStyles.row}>
                <Text variant='labelMedium'>update at:</Text>
                <Text variant='bodyMedium'>{dateHelper.toFormattedString(item.updateAt, 'DD/MM/YYYY hh:mm:ss')}</Text>
            </View>
            <View style={sharedStyles.row}>
                <Text variant='labelMedium'>deleted at:</Text>
                <Text variant='bodyMedium'>{dateHelper.toFormattedString(item.deletedAt, 'DD/MM/YYYY hh:mm:ss')}</Text>
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

/*
            <Divider style={styles.divider0} />
            <RegularTaskInfo
                period={formik.values.period}
                periodSize={formik.values.periodSize}
                from={formik.values.from}
                to={formik.values.to}
                useLastDayFix={formik.values.useLastDayFix}
                su={formik.values.su}
                mo={formik.values.mo}
                tu={formik.values.tu}
                we={formik.values.we}
                th={formik.values.th}
                fr={formik.values.fr}
                sa={formik.values.sa}
            />
*/
import { MainSettings, saveMainSettings, selectMainSettings } from '@entities/settings'
import { useAppDispatch, useAppSelector } from '@shared/lib/hooks'
import { sharedStyles } from '@shared/styles'
import { FormErrorText } from '@shared/ui'
import { useFormik } from 'formik'
import React from 'react'
import { View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import * as Yup from 'yup'


const mainSettingsSchema = Yup.object().shape({
    wordsLearningPartSize: Yup
        .string()
        .matches(/^[0-9]{1,3}$/, 'Must be exactly digits')
        .min(1, 'Min value is 1')
        .max(100, 'Max value is 100')
        .required('This is required'),
})

export const MainSettingsForm = () => {
    const dispatch = useAppDispatch()
    const mainSettings = useAppSelector(selectMainSettings)

    const formik = useFormik({
        initialValues: mainSettings,
        validationSchema: mainSettingsSchema,
        onSubmit: (values: MainSettings) => {
            console.log('Form submit:', values)
            dispatch(saveMainSettings(values))
        }
    })

    return (
        <>
            <Text variant='bodyLarge'>Word learning</Text>
            <TextInput
                onChangeText={formik.handleChange('wordsLearningPartSize')}
                onBlur={formik.handleBlur('wordsLearningPartSize')}
                value={formik.values.wordsLearningPartSize + ''}
                placeholder='Word learning'
                keyboardType='numeric'
                mode='outlined'
                dense={true}
            />
            {formik.errors.wordsLearningPartSize && <FormErrorText>{formik.errors.wordsLearningPartSize}</FormErrorText>}

            <View style={sharedStyles.btnRow}>
                <Button
                    onPress={() => formik.handleSubmit()}
                    disabled={!formik.isValid}
                    mode='contained'
                >
                    Save
                </Button>
                <Button
                    onPress={() => formik.resetForm()}
                    mode='outlined'
                >
                    Reset
                </Button>
            </View>
        </>
    )
}
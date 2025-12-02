import { MainSettings } from '@entities/settings'
import { sharedStyles } from '@shared/styles'
import { FormErrorText, ThemedModal } from '@shared/ui'
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

type Props = {
    item: MainSettings
    onChangeItem: (mainSettings: MainSettings) => void
    onClose: () => void
}

export const MainSettingsFormModal = ({ item, onChangeItem, onClose }: Props) => {
    const formik = useFormik({
        initialValues: item,
        validationSchema: mainSettingsSchema,
        onSubmit: (values: MainSettings) => {
            console.log('Form submit:', values)
            onChangeItem(values)
        }
    })

    return (
        <ThemedModal
            title='Main settings'
            isVisible={true}
            onClose={onClose}
        >
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
            {!!formik.errors.wordsLearningPartSize && <FormErrorText>{formik.errors.wordsLearningPartSize}</FormErrorText>}

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
        </ThemedModal>
    )
}
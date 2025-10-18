import { WordShort } from '@entities/dictionary'
import { sharedStyles } from '@shared/styles'
import { FormErrorText, ThemedModal } from '@shared/ui'
import { useFormik } from 'formik'
import React from 'react'
import { View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import * as Yup from 'yup'


const wordEditSchema = Yup.object().shape({
    word: Yup.string()
        .min(1, 'Min value length is 1')
        .max(100, 'Max value length is 100')
        .required('This is required'),
    translate: Yup.string()
        .min(1, 'Min value length is 1')
        .max(100, 'Max value length is 100')
        .required('This is required'),
})

type Props = {
    item: WordShort
    onChangeItem: (word: WordShort) => void
    onClose: () => void
}

export function WordEditFormModal({ item, onChangeItem, onClose }: Props) {
    const formik = useFormik({
        initialValues: item,
        validationSchema: wordEditSchema,
        onSubmit: (values: WordShort) => {
            console.log('Form submit:', values)
            onChangeItem(values)
        }
    })

    return (
        <ThemedModal
            title={item.key ? 'Update word' : 'Add word'}
            isVisible={true}
            onClose={onClose}
        >
            {item.key &&
                <>
                    <Text variant='labelMedium'>key:</Text>
                    <Text variant='bodyMedium'>{item.key}</Text>
                </>
            }

            <Text variant='labelMedium'>word:</Text>
            <TextInput
                onChangeText={formik.handleChange('word')}
                onBlur={formik.handleBlur('word')}
                value={formik.values.word + ''}
                placeholder='word'
                mode='outlined'
                dense={true}
            />
            {formik.errors.word && <FormErrorText>{formik.errors.word}</FormErrorText>}


            <Text variant='labelMedium'>translate:</Text>
            <TextInput
                onChangeText={formik.handleChange('translate')}
                onBlur={formik.handleBlur('translate')}
                value={formik.values.translate + ''}
                placeholder='translate'
                mode='outlined'
                dense={true}
            />
            {formik.errors.translate && <FormErrorText>{formik.errors.translate}</FormErrorText>}

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
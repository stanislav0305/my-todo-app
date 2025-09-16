import { WordShort } from '@entities/dictionary'
import { sharedStyles } from '@shared/styles'
import {
    FormErrorMaxLength, FormErrorRequired, ThemedModal
} from '@shared/ui'
import React from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { WordEditFormInput } from './input'


type Props = {
    item: WordShort
    onChangeItem: (word: WordShort) => void
    onClose: () => void
}

export function WordEditFormModal({ item, onChangeItem, onClose }: Props) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<WordShort>({
        defaultValues: {
            ...item
        }
    })

    const { word, translate } = errors

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

            <WordEditFormInput name='word'
                label='word'
                control={control}
                rules={{
                    required: true,
                    maxLength: 100,
                }}
                error={!!word}
            />
            <FormErrorRequired errorField={word}>This is required.</FormErrorRequired>
            <FormErrorMaxLength errorField={word}>Max value length is 100</FormErrorMaxLength>

            <WordEditFormInput name='translate'
                label='Translate'
                control={control}
                rules={{
                    required: true,
                    maxLength: 100,
                }}
                error={!!translate}
            />
            <FormErrorRequired errorField={translate}>This is required.</FormErrorRequired>
            <FormErrorMaxLength errorField={translate}>Max value length is 100</FormErrorMaxLength>

            <View style={sharedStyles.btnRow}>
                <Button
                    onPress={handleSubmit(onChangeItem)}
                    icon={{ source: item.key ? 'pencil' : 'plus-thick', direction: 'ltr' }}
                    mode='contained'
                >
                    Submit
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
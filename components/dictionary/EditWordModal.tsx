import ThemedModal from '@/components/ThemedModal'
import { sharedStyles } from '@/shared/sharedStyles'
import { DictionaryWord } from '@/store/dictionary.slice'
import { selectAppTheme } from '@/store/settings.slice'
import React from 'react'
import { useController, UseControllerProps, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button, Text, TextInput, TextInputProps } from 'react-native-paper'
import { useSelector } from 'react-redux'


type Props = {
    item: DictionaryWord
    onChangeItem: (word: DictionaryWord) => void
    onClose: () => void
}


type InputPros =
    UseControllerProps<DictionaryWord, keyof DictionaryWord, DictionaryWord>
    & TextInputProps


/*
type InputPros = {
    name: keyof DictionaryWord
    defaultValue?: string | undefined
    control: Control<DictionaryWord, any, DictionaryWord>
    rules?: Omit<RegisterOptions<DictionaryWord, keyof DictionaryWord>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'> | undefined
} & TextInputProps
*/

function Input({ name, defaultValue = '', control, rules, ...rest }: InputPros) {
    const { field } = useController({
        control,
        defaultValue,
        name,
        rules
    })

    return (
        <TextInput
            value={field.value + ''}
            onChangeText={field.onChange}
            {...rest}
            mode='outlined'
            dense={true}
        />
    )
}

export default function EditWordModal({ item, onChangeItem, onClose }: Props) {
    const appTheme = useSelector(selectAppTheme)
    const { error } = appTheme.colors

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<DictionaryWord>({
        defaultValues: {
            ...item
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

            <Input name='word'
                label='word'
                control={control}
                rules={{
                    required: true,
                    maxLength: 100,
                }}
            />
            {errors.word &&
                <Text variant='labelMedium' style={{ color: error }}>This is required.</Text>}
            {errors.word?.type === 'maxLength' &&
                <Text variant='labelMedium' style={{ color: error }}>Problem with word length.</Text>}

            <Input name='translate'
                label='Translate'
                control={control}
                rules={{
                    required: true,
                    maxLength: 100,
                }}
            />
            {errors.translate?.type === 'required' &&
                <Text variant='labelMedium' style={{ color: error }}>This is required.</Text>}
            {errors.translate?.type === 'maxLength' &&
                <Text variant='labelMedium' style={{ color: error }}>Problem with word length.</Text>}
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
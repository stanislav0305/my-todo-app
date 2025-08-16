import ThemedModal from '@/components/ThemedModal'
import { ThemedText } from '@/components/ThemedText'
import { ThemedTextInput, ThemedTextInputProps } from '@/components/ThemedTextInput'
import { DictionaryWord } from '@/store/dictionary.slice'
import React from 'react'
import { Control, RegisterOptions, useController, useForm } from 'react-hook-form'
import { Button } from 'react-native'


type Props = {
    item: DictionaryWord
    onChangeItem: (word: DictionaryWord) => void
    onClose: () => void
}

type InputPros = {
    name: keyof DictionaryWord
    control: Control<DictionaryWord, any, DictionaryWord>
    rules?: Omit<RegisterOptions<DictionaryWord, keyof DictionaryWord>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'> | undefined
} & ThemedTextInputProps


function Input({ name, control, rules, ...rest }: InputPros) {
    const { field } = useController({
        control,
        defaultValue: '',
        name,
        rules
    })

    return (
        <ThemedTextInput
            value={field.value}
            onChangeText={field.onChange}
            type='default'
            {...rest}
        />
    )
}

export default function EditWordModal({ item, onChangeItem, onClose }: Props) {
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
                    <ThemedText type='link'>key:</ThemedText>
                    <ThemedText type='link'>{item.key}</ThemedText>
                </>
            }

            <ThemedText type='link'>word:</ThemedText>
            <Input name='word' control={control}
                rules={{
                    required: true,
                    maxLength: 100,
                }}
            />
            {errors.word && <ThemedText type='error'>This is required.</ThemedText>}
            {errors.word?.type === 'maxLength' && <ThemedText type='error'>Problem with word length.</ThemedText>}

            <ThemedText type='link'>translate:</ThemedText>
            <Input name='translate' control={control}
                rules={{
                    required: true,
                    maxLength: 100,
                }}
            />
            {errors.translate?.type === 'required' && <ThemedText type='error'>This is required.</ThemedText>}
            {errors.translate?.type === 'maxLength' && <ThemedText type='error'>Problem with word length.</ThemedText>}

            <Button title='Submit' onPress={handleSubmit(onChangeItem)} />
            <Button title='Cancel' onPress={onClose} />
        </ThemedModal>
    )
}
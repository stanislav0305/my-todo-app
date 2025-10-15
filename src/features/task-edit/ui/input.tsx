import { Task } from '@/src/entities/tasks-management'
import React from 'react'
import { useController, UseControllerProps } from 'react-hook-form'
import { TextInput, TextInputProps } from 'react-native-paper'


type InputPros =
    UseControllerProps<Task, keyof Task, Task>
    & TextInputProps

/*
type InputPros = {
name: keyof WordShort
defaultValue?: string | undefined
control: Control<WordShort, any, WordShort>
rules?: Omit<RegisterOptions<WordShort, keyof WordShort>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'> | undefined
} & TextInputProps
*/

export function TaskEditFormInput({ name, defaultValue = undefined, control, rules, ...rest }: InputPros) {
    const { field } = useController({
        control,
        defaultValue,
        name,
        rules,
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
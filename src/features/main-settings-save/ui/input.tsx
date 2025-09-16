import { MainSettings } from '@entities/settings'
import { useController, UseControllerProps } from 'react-hook-form'
import { TextInput, TextInputProps } from 'react-native-paper'


type InputPros = 
    UseControllerProps<MainSettings, keyof MainSettings, MainSettings>
    & TextInputProps

export function MainSettingsFormInput({ name, defaultValue = undefined, control, rules, ...rest }: InputPros) {
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
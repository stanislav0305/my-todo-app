import { ThemedText } from '@/components/ThemedText'
import { ThemedTextInput, ThemedTextInputProps } from '@/components/ThemedTextInput'
import { ThemedView } from "@/components/ThemedView"
import { useAppDispatch } from '@/hooks/store/useAppDispatch'
import { useAppSelector } from '@/hooks/store/useAppSelector'
import { changeSelectedThemeName, MainSettings, saveMainSettings, selectMainSettings, selectSelectedThemeName } from '@/store/settings.slice'
import { useController, UseControllerProps, useForm } from 'react-hook-form'
import { StyleSheet } from 'react-native'
import { Button, SegmentedButtons } from 'react-native-paper'


type InputPros =
    UseControllerProps<MainSettings, keyof MainSettings, MainSettings>
    & ThemedTextInputProps

function Input({ name, defaultValue = undefined, control, rules, ...rest }: InputPros) {
    const { field } = useController({
        control,
        defaultValue,
        name,
        rules
    })

    return (
        <ThemedTextInput
            value={field.value + ''}
            onChangeText={field.onChange}
            type='default'
            {...rest}
        />
    )
}

export default function SettingsScreen() {
    const dispatch = useAppDispatch()
    const mainSettings = useAppSelector(selectMainSettings)
    const selectedThemeName = useAppSelector(selectSelectedThemeName)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<MainSettings>({
        defaultValues: {
            ...mainSettings
        }
    })

    return (
        <ThemedView style={styles.container}>
            <SegmentedButtons
                value={selectedThemeName}
                onValueChange={value => dispatch(changeSelectedThemeName(value))}
                buttons={[
                    {
                        value: 'light',
                        label: 'light',
                    },
                    {
                        value: 'automatic',
                        label: 'automatic',
                    },
                    {
                        value: 'dark',
                        label: 'dark'
                    },
                ]}
            />
            <ThemedText type='link'>Word learning</ThemedText>
            <ThemedText type='link'>part size:</ThemedText>
            <Input name='wordsLearningPartSize'
                control={control}
                rules={{
                    required: true,
                    maxLength: 3,
                    min: 2,
                    max: 999,
                }}
                autoFocus={true}
            />
            {errors.wordsLearningPartSize && <ThemedText type='error'>This is required.</ThemedText>}
            {errors.wordsLearningPartSize?.type === 'maxLength' && <ThemedText type='error'>Max value length is 3</ThemedText>}
            {errors.wordsLearningPartSize?.type === 'min' && <ThemedText type='error'>{'Value shod be > 1'}</ThemedText>}
            {errors.wordsLearningPartSize?.type === 'max' && <ThemedText type='error'>{'Value shod be < 1000'}</ThemedText>}

            <Button mode='contained' onPress={handleSubmit(val => dispatch(saveMainSettings(val)))}>Save</Button>
            <Button mode='outlined' onPress={() => reset(mainSettings)}>Reset</Button>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
})
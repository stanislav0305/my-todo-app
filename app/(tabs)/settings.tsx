import ScreenLayout from '@/app/_screen-layout'
import { useAppDispatch } from '@/hooks/store/useAppDispatch'
import { useAppSelector } from '@/hooks/store/useAppSelector'
import { changeSelectedThemeName, MainSettings, saveMainSettings, selectAppTheme, selectMainSettings, selectSelectedThemeName } from '@/store/settings.slice'
import { useController, UseControllerProps, useForm } from 'react-hook-form'
import { Button, SegmentedButtons, Text, TextInput, TextInputProps } from 'react-native-paper'
import { useSelector } from 'react-redux'


type InputPros =
    UseControllerProps<MainSettings, keyof MainSettings, MainSettings>
    & TextInputProps

function Input({ name, defaultValue = undefined, control, rules, ...rest }: InputPros) {
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

export default function SettingsScreen() {

    const dispatch = useAppDispatch()
    const mainSettings = useAppSelector(selectMainSettings)
    const selectedThemeName = useAppSelector(selectSelectedThemeName)

    const appTheme = useSelector(selectAppTheme)
    const { error } = appTheme.colors

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
        <ScreenLayout>
            <Text variant='headlineLarge'>Dictionary</Text>
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
            <Text variant='bodyLarge'>Word learning</Text>
            <Input name='wordsLearningPartSize'
                label='Part size'
                control={control}
                rules={{
                    required: true,
                    maxLength: 3,
                    min: 2,
                    max: 999
                }}
                autoFocus={true}
                error={!!errors.wordsLearningPartSize}
            />
            {errors.wordsLearningPartSize &&
                <Text variant='labelMedium' style={{ color: error }}>This is required.</Text>}

            {errors.wordsLearningPartSize?.type === 'maxLength' &&
                <Text variant='labelMedium' style={{ color: error }}>Max value length is 3</Text>}

            {errors.wordsLearningPartSize?.type === 'min' &&
                <Text variant='labelMedium' style={{ color: error }}>{'Value shod be > 1'}</Text>}

            {errors.wordsLearningPartSize?.type === 'max' &&
                <Text variant='labelMedium' style={{ color: error }}>{'Value shod be < 1000'}</Text>}

            {errors.wordsLearningPartSize?.type === 'valueAsNumber' &&
                <Text variant='labelMedium' style={{ color: error }}>{'Value shod be number'}</Text>}

            <Button mode='contained'
                onPress={handleSubmit(val => dispatch(saveMainSettings(val)))}
            >
                Save
            </Button>
            <Button mode='outlined'
                onPress={() => reset(mainSettings)}
            >
                Reset
            </Button>
        </ScreenLayout>
    )
}
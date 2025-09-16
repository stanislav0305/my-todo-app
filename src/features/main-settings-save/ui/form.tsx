import { MainSettings, saveMainSettings, selectMainSettings } from '@entities/settings'
import { useAppDispatch, useAppSelector } from '@shared/lib/hooks'
import {
    sharedStyles
} from '@shared/styles'
import {
    FormErrorMax, FormErrorMaxLength,
    FormErrorMin,
    FormErrorRequired, FormErrorValueAsNumber
} from '@shared/ui'
import React from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { MainSettingsFormInput } from './input'


export const MainSettingsForm = () => {
    const dispatch = useAppDispatch()
    const mainSettings = useAppSelector(selectMainSettings)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<MainSettings>({
        mode: 'onChange',
        defaultValues: {
            ...mainSettings
        }
    })

    const { wordsLearningPartSize } = errors

    return (
        <>
            <Text variant='bodyLarge'>Word learning</Text>
            <MainSettingsFormInput name='wordsLearningPartSize'
                label='Part size'
                control={control}
                rules={{
                    maxLength: 3,
                    min: 2,
                    max: 999,
                    //pattern:test'/i',
                    required: true,
                }}
                error={!!wordsLearningPartSize}
                keyboardType='numeric'
            />
            <FormErrorRequired errorField={wordsLearningPartSize}>This is required.</FormErrorRequired>
            <FormErrorMaxLength errorField={wordsLearningPartSize}>Max value length is 3</FormErrorMaxLength>
            <FormErrorMin errorField={wordsLearningPartSize}>{'Value shod be > 1'}</FormErrorMin>
            <FormErrorMax errorField={wordsLearningPartSize}>{'Value shod be < 1000'}</FormErrorMax>
            <FormErrorValueAsNumber errorField={wordsLearningPartSize}>Value shod be number</FormErrorValueAsNumber>

            <View style={sharedStyles.btnRow}>
                <Button
                    onPress={handleSubmit((val) => dispatch(saveMainSettings(val)))}
                    mode='contained'
                >
                    Save
                </Button>
                <Button
                    onPress={() => reset(mainSettings)}
                    mode='outlined'
                >
                    Reset
                </Button>
            </View>
        </>
    )
}
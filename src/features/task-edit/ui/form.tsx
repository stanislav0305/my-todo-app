import { Task } from '@/src/entities/tasks-management'
import { sharedStyles } from '@shared/styles'
import {
    FormErrorMaxLength, FormErrorRequired, ThemedModal
} from '@shared/ui'
import React from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { TaskEditFormInput } from './input'


type Props = {
    item: Task
    onChangeItem: (word: Task) => void
    onClose: () => void
}

export function TaskEditFormModal({ item, onChangeItem, onClose }: Props) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<Task>({
        defaultValues: {
            ...item
        }
    })

    const { title } = errors

    return (
        <ThemedModal
            title={item.key ? 'Update task' : 'Add task'}
            isVisible={true}
            onClose={onClose}
        >
            {item.key &&
                <>
                    <Text variant='labelMedium'>key:</Text>
                    <Text variant='bodyMedium'>{item.title}</Text>
                </>
            }

            <TaskEditFormInput name='title'
                label='title'
                control={control}
                rules={{
                    required: true,
                    maxLength: 300,
                }}
                error={!!title}
            />
            <FormErrorRequired errorField={title}>This is required.</FormErrorRequired>
            <FormErrorMaxLength errorField={title}>Max value length is 300</FormErrorMaxLength>


            <View style={sharedStyles.btnRow}>
                <Button
                    onPress={handleSubmit(onChangeItem)}
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
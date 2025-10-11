import { sharedStyles } from '@shared/styles'
import { ThemedModal } from '@shared/ui'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'


type Props = {
    itemKey: string
    title: string
    onDelete: (key: string) => void
    onClose: () => void
}

export function TaskRemoveFormModal({ itemKey, title, onDelete, onClose }: Props) {
    return (
        <ThemedModal
            title='Delete task'
            isVisible={true}
            onClose={onClose}
        >
            <Text variant='bodyMedium'
                style={{ textAlign: 'center' }}
            >
                Do you really want to delete task &apos;{title}&apos; by key &apos;{itemKey}&apos;?
            </Text>
            <View style={sharedStyles.btnRow}>
                <Button
                    onPress={() => onDelete(itemKey)}
                    icon={{ source: 'trash-can', direction: 'ltr' }}
                    mode='outlined'
                >
                    Delete
                </Button>
                <Button
                    onPress={() => onClose()}
                    mode='outlined'
                >
                    Cancel
                </Button>
            </View>
        </ThemedModal>
    )
}
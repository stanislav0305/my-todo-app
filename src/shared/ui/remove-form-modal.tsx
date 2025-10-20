import { sharedStyles } from '@shared/styles'
import { ThemedModal } from '@shared/ui/themed-modal'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'


type Props = {
    itemKey: string
    questionText: string
    deleteBtnText?: string
    closeBtnText?: string
    onDelete: (key: string) => void
    onClose: () => void
}

export function RemoveFormModal({ itemKey, questionText, deleteBtnText, closeBtnText, onDelete, onClose }: Props) {
    return (
        <ThemedModal
            title='Delete task'
            isVisible={true}
            onClose={onClose}
        >
            <Text variant='bodyMedium'
                style={{ textAlign: 'center' }}
            >
                {questionText}
            </Text>
            <View style={sharedStyles.btnRow}>
                <Button
                    onPress={() => onDelete(itemKey)}
                    icon={{ source: 'trash-can', direction: 'ltr' }}
                    mode='outlined'
                >
                    {deleteBtnText ?? 'Delete'}
                </Button>
                <Button
                    onPress={() => onClose()}
                    mode='outlined'
                >
                    {closeBtnText ?? 'Cancel'}
                </Button>
            </View>
        </ThemedModal>
    )
}
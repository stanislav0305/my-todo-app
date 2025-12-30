import { sharedStyles } from '@shared/styles'
import { ThemedModal } from '@shared/ui/themed-modal'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'


type Props = {
    itemId: number
    questionText: string
    deleteBtnText?: string
    closeBtnText?: string
    onDelete: (id: number) => void
    onClose: () => void
}

export function RemoveFormModal({ itemId, questionText, deleteBtnText, closeBtnText, onDelete, onClose }: Props) {
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
            <View style={sharedStyles.row}>
                <Button
                    onPress={() => onDelete(itemId)}
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
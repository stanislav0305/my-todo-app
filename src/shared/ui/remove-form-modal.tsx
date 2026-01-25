import { sharedStyles } from '@shared/styles'
import { ThemedModal } from '@shared/ui/themed-modal'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'


type Props = {
    itemId: number
    softRemove: boolean
    questionText: string
    deleteBtnText?: string
    closeBtnText?: string
    onDelete: (id: number) => void
    onClose: () => void
}

export function RemoveFormModal({ itemId, softRemove, questionText, deleteBtnText, closeBtnText, onDelete, onClose }: Props) {
    return (
        <ThemedModal
            title={softRemove ? 'Move to trash' : 'Remove'}
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
                    onPress={() => onDelete(itemId)}
                    icon={{ source: softRemove ? 'trash-can' : 'close-thick', direction: 'ltr' }}
                    mode='outlined'
                >
                    {deleteBtnText ?? softRemove ? 'Move to trash' : 'Remove'}
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
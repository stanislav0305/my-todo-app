import { sharedStyles } from '@shared/styles'
import { ThemedModal } from '@shared/ui/themed-modal'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'


type Props = {
    itemId: number
    questionText: string
    restoreBtnText?: string
    closeBtnText?: string
    onRestore: (id: number) => void
    onClose: () => void
}

export function RestoreFormModal({ itemId, questionText, restoreBtnText, closeBtnText, onRestore, onClose }: Props) {
    return (
        <ThemedModal
            title={'Restore'}
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
                    onPress={() => onRestore(itemId)}
                    icon={{ source: 'delete-restore', direction: 'ltr' }}
                    mode='outlined'
                >
                    {restoreBtnText ?? 'Restore'}
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
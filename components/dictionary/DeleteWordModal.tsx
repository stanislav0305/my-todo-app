import ThemedModal from '@/components/ThemedModal'
import { sharedStyles } from '@/shared/sharedStyles'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'


type DeleteProps = {
    itemKey: string
    word: string
    onDelete: (key: string) => void
    onClose: () => void
}

export default function DeleteWordModal({ itemKey, word, onDelete, onClose }: DeleteProps) {
    return (
        <ThemedModal
            title='Delete word'
            isVisible={true}
            onClose={onClose}
        >
            <Text variant='bodyMedium' style={{textAlign:'center'}}>Do you really want to delete word '{word}' by key '{itemKey}'?</Text>
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
import ThemedModal from '@/components/ThemedModal'
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
            <Text variant='bodyMedium'>Do you really want to delete word '{word}' by key '{itemKey}'?</Text>
            <Button
                onPress={() => onDelete(itemKey)}
                mode='contained'
            >
                Delete
            </Button>
            <Button
                onPress={() => onClose()}
                mode='outlined'
            >
                Cancel
            </Button>
        </ThemedModal>
    )
}
import ThemedModal from "@/components/ThemedModal"
import { ThemedText } from "@/components/ThemedText"
import { Button } from "react-native"


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
            <ThemedText>Do you really want to delete word '{word}' by key '{itemKey}'?</ThemedText>
            <Button title='Delete' onPress={() => onDelete(itemKey)} />
            <Button title='Cancel' onPress={() => onClose()} />
        </ThemedModal>
    )
}
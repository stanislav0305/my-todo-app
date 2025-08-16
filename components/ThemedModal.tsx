import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useThemeColor } from '@/hooks/useThemeColor'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { PropsWithChildren } from 'react'
import { Modal, ModalProps, Pressable, StyleSheet } from 'react-native'


type ThemedModalProps = ModalProps & {
    lightColor?: string
    darkColor?: string
    title?: string
    isVisible: boolean
    onClose: () => void
}

type Props = PropsWithChildren<ThemedModalProps>

export default function ThemedModal({ title, isVisible, children, onClose, style, lightColor, darkColor, ...otherProps }: Props) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')
    const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border')

    return (
        <Modal
            visible={isVisible}
            animationType='slide'
            transparent={true}
            {...otherProps}
        >
            <ThemedView style={styles.modal}>
                <ThemedView style={[{ backgroundColor, borderColor }, styles.modalContainer]}>
                    <ThemedView style={styles.titleContainer}>
                        <ThemedText type='title'>{title}</ThemedText>
                        <Pressable onPress={onClose}>
                            <MaterialIcons name='close' color='#fff' size={22} />
                        </Pressable>
                    </ThemedView>
                    {children}
                </ThemedView>
            </ThemedView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        height: '100%',
        width: '100%',
        backgroundColor: '#bbbbbbe3'
    },
    modalContainer: {
        padding: 10,
        top: 50,
        borderWidth: 2,
        borderStyle: 'solid'
    },
    titleContainer: {
        flexDirection: 'row',
    },
})
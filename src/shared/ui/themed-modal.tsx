import { useAppTheme } from '@shared/theme-model'
import { PropsWithChildren } from 'react'
import { Modal, ModalProps, StyleSheet, View } from 'react-native'
import { IconButton, Text } from 'react-native-paper'


type ThemedModalProps = ModalProps & {
    title?: string
    isVisible: boolean
    onClose: () => void
}

type Props = PropsWithChildren<ThemedModalProps>

export function ThemedModal({ title, isVisible, children, onClose, style, ...otherProps }: Props) {
    const appTheme = useAppTheme()
    const { background, border } = appTheme.colors

    return (
        <Modal
            visible={isVisible}
            animationType='slide'
            transparent={true}
            {...otherProps}
        >
            <View style={styles.modal}>
                <View style={[{ backgroundColor: background }, { borderColor: border }, styles.modalContainer]}>
                    <View style={styles.titleContainer}>
                        <Text variant='headlineSmall'>{title}</Text>
                        <IconButton
                            icon='close-outline'
                            size={30}
                            onPress={onClose}
                        />
                    </View>
                    {children}
                </View>
            </View>
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
        margin: 10,
        padding: 10,
        top: 50,
        borderWidth: 2,
        borderStyle: 'solid'
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})
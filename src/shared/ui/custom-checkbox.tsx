import { PropsWithChildren } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { Checkbox } from "react-native-paper"


export type TProps = {
    checkBoxState: 'checked' | 'unchecked' | 'indeterminate'
    onPress: () => void
} & PropsWithChildren

export const CustomCheckbox = ({ checkBoxState, onPress, children }: TProps) => {
    return (
        <Pressable
            style={styles.customCheckbox}
            onPress={(e) => onPress()}
        >
            <Checkbox
                status={checkBoxState}
            />
            <View style={styles.customCheckboxLabel}>
                {children}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    customCheckbox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-end',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15,
    },
    customCheckboxLabel: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        borderRadius: 15,
    }
})
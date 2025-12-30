import { PropsWithChildren } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { Switch } from "react-native-paper"


type TProps = {
    switched: boolean
    onValueChange: () => void
} & PropsWithChildren

export const CustomSwitch = ({ switched, onValueChange, children }: TProps) => {
    return (
        <View
            style={styles.customSwitch}
        >
            <Switch
                value={switched}
                onValueChange={onValueChange}
            />
            <Pressable
                style={styles.customSwitchLabel}
                onPress={(e) => onValueChange()}
            >
                {children}
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    customSwitch: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-end',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15,
    },
    customSwitchLabel: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        borderRadius: 15,
    }
})
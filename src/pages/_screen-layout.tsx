import { PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

interface Props extends PropsWithChildren {
    style?: StyleProp<ViewStyle>
}

export default function ScreenLayout({ children, style }: Props) {
    return (
        <View style={[style, styles.container]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        gap: 16,
        alignContent: 'flex-start',
        overflow: 'hidden',
        position: 'relative',
    },
})
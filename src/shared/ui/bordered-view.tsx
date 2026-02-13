import { useAppTheme } from '@shared/theme/hooks'
import { ColorType, themeHelper } from '@shared/theme/lib'
import { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'


type Props = {
    borderColorType: ColorType,
} & PropsWithChildren

export const BorderedView = ({ borderColorType, children }: Props) => {
    const appTheme = useAppTheme()
    const color = themeHelper.getColor(appTheme, borderColorType)

    return (
        <View style={[{ borderColor: color }, styles.container]}>{children}</View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        padding: 5
    }
})
import { AntDesign } from '@expo/vector-icons'
import { useAppTheme } from '@shared/theme/hooks'
import { ColorType, themeHelper } from '@shared/theme/lib'
import { PropsWithChildren } from 'react'
import { Text } from 'react-native-paper'


export type IconTypes = 'info' | 'warning'
type Props = {
    iconType?: IconTypes,
    textColor: ColorType,
} & PropsWithChildren

export const AppText = ({ iconType, textColor, children }: Props) => {
    const appTheme = useAppTheme()
    const color = themeHelper.getColor(appTheme, textColor)

    return (
        <Text style={{ color }}>
            {(iconType === 'info' || iconType === 'warning') && (
                <>
                    <AntDesign
                        name={iconType === 'info' ? 'infocirlce' : 'warning'}
                        size={20}
                        color={color}
                    />
                    {'  '}
                </>
            )}
            {children}
        </Text>
    )
}
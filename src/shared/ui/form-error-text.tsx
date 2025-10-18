import { useAppTheme } from '@shared/theme/hooks'
import { PropsWithChildren } from 'react'
import { Text } from 'react-native-paper'


export const FormErrorText = ({ children }: PropsWithChildren) => {
    const appTheme = useAppTheme()
    const { error } = appTheme.colors

    return (
        <Text variant='labelMedium' style={{ color: error }}>{children}</Text>
    )
}
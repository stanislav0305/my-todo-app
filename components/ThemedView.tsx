import { useThemeOrPropsColor } from '@/hooks/useThemeOrPropsColor'
import { View, type ViewProps } from 'react-native'


export type ThemedViewProps = ViewProps & {
  lightColor?: string
  darkColor?: string
}

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeOrPropsColor({ light: lightColor, dark: darkColor }, 'background')

  return <View style={[{ backgroundColor }, style]} {...otherProps} />
}

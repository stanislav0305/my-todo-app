import { useThemeColor } from '@/hooks/useThemeColor'
import { StyleSheet, TextInput, type TextInputProps } from 'react-native'


export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string
  darkColor?: string
  type?: 'default'
}

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
  const placeholderTextColor = useThemeColor({ light: lightColor, dark: darkColor }, 'placeholderTextColor')

  return (
    <TextInput
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        style,
      ]}
      placeholderTextColor={placeholderTextColor}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 16,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderStyle: 'solid',
  }
})

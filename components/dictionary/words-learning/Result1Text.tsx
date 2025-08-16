import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, Text, type TextProps } from 'react-native';


export type Result1TextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'defaultSemiBold'
  specialColor?: 'text' | 'colorSilver' | 'colorRed' | 'colorYellow' | 'colorGreen'
}

export function Result1Text({
  style,
  lightColor,
  darkColor,
  type = 'default',
  specialColor = 'text',
  ...rest
}: Result1TextProps) {

  const color = useThemeColor({ light: lightColor, dark: darkColor }, specialColor)

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        style,
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
})
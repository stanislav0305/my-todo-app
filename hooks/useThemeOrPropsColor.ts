
import { selectAppTheme } from '@/store/settings.slice'
import { AppThemeColors } from '@/theme/appThemes'
import { useSelector } from 'react-redux'


export function useThemeOrPropsColor(
  props: { light?: string, dark?: string},
  colorName: AppThemeColors
) {
  const appTheme = useSelector(selectAppTheme)
  const colorFromProps = props[appTheme.dark ? 'dark' : 'light']
  return colorFromProps ?? appTheme.colors[colorName].toString()
}

import { selectAppTheme } from '@app/theme-slice'
import { useAppSelector } from '@shared/lib/hooks'


export const useAppTheme = () => useAppSelector(selectAppTheme)
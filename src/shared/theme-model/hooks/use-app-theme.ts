import { useAppSelector } from '@shared/lib/hooks'
import { selectAppTheme } from '../model/select-app-theme'


export const useAppTheme = () => useAppSelector(selectAppTheme)
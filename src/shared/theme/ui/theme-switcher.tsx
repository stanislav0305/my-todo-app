import { useAppDispatch, useAppSelector } from '@shared/lib/hooks'
import { SegmentedButtons, Text } from 'react-native-paper'
import { selectSelectedThemeName } from '../model/select-selected-theme-name'
import { changeSelectedThemeName } from '../model/theme.slice'


export const ThemeSwitcher = () => {
    const dispatch = useAppDispatch()
    const selectedThemeName = useAppSelector(selectSelectedThemeName)

    return (
        <>
            <Text variant='bodyLarge'>Mode</Text>
            <SegmentedButtons
                value={selectedThemeName}
                onValueChange={value => dispatch(changeSelectedThemeName(value))}
                buttons={[
                    {
                        value: 'light',
                        label: 'light',
                    },
                    {
                        value: 'automatic',
                        label: 'automatic',
                    },
                    {
                        value: 'dark',
                        label: 'dark'
                    },
                ]}
            />
        </>
    )
}
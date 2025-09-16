import { changeSelectedThemeName, selectSelectedThemeName } from '@app/theme-slice'
import { useAppDispatch, useAppSelector } from '@shared/lib/hooks'
import { SegmentedButtons, Text } from 'react-native-paper'


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
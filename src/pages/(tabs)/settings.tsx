import ScreenLayout from '@pages/_screen-layout'
import { ThemeSwitcher } from '@shared/theme/ui'
import { MainSettingsWidget } from '@widgets/main-settings'


export default function SettingsScreen() {
    return (
        <ScreenLayout>
            <ThemeSwitcher />
            <MainSettingsWidget />
        </ScreenLayout>
    )
}
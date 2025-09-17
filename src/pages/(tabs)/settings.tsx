import { MainSettingsForm } from '@features/main-settings-save'
import ScreenLayout from '@pages/_screen-layout'
import { ThemeSwitcher } from '@shared/theme/ui'


export default function SettingsScreen() {
    return (
        <ScreenLayout>
            <ThemeSwitcher/>
            <MainSettingsForm />
        </ScreenLayout>
    )
}
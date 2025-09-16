import { ThemeSwitcher } from '@/src/shared/theme-model'
import { MainSettingsForm } from '@features/main-settings-save'
import ScreenLayout from '@pages/_screen-layout'


export default function SettingsScreen() {
    return (
        <ScreenLayout>
            <ThemeSwitcher/>
            <MainSettingsForm />
        </ScreenLayout>
    )
}
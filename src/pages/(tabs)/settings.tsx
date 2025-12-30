import ScreenLayout from '@pages/_screen-layout'
import { ThemeSwitcher } from '@shared/theme/ui'
import { MainSettingsWidget } from '@widgets/main-settings'
import { Card } from 'react-native-paper'


export default function SettingsScreen() {
    return (
        <ScreenLayout>
            <Card>
                <Card.Content>
                    <ThemeSwitcher />
                    <MainSettingsWidget />
                </Card.Content>
            </Card>
        </ScreenLayout>
    )
}
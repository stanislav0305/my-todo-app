import { useAppData } from '@/src/app/providers/app-data-provider'
import { runMigrations } from '@/src/app/type-orm-database/data-source'
import { revertAll } from '@shared/lib/actions'
import { useAppDispatch } from '@shared/lib/hooks'
import { Button, Card } from 'react-native-paper'


export const MainSettingsWidget = () => {
    const appData = useAppData()
    const dispatch = useAppDispatch()

    return (
        <Card mode='outlined'>
            <Card.Content>
                <Card.Actions style={{ justifyContent: 'flex-start' }}>
                    <Button
                        onPress={async () => {
                            console.log('Clear DB')
                            await appData.dataManager.clear()
                            dispatch(revertAll())
                            await runMigrations()
                        }}
                        mode='outlined'
                    >
                        Clear all
                    </Button>
                    <Button
                        onPress={async () => {
                            console.log('Import DB')
                            await appData.dataManager.restore()
                        }}
                        mode='outlined'
                    >
                        Import DB
                    </Button>
                    <Button
                        onPress={async () => {
                            console.log('Export DB')
                            await appData.dataManager.backup()
                        }}
                        mode='outlined'
                    >
                        Export DB
                    </Button>
                </Card.Actions>
            </Card.Content>
        </Card>
    )
}
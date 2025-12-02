import { useAppData } from '@/src/app/providers/app-data-provider'
import { runMigrations } from '@/src/app/type-orm-database/data-source'
import { MainSettings, saveMainSettings, selectMainSettings } from '@/src/entities/settings'
import { MainSettingsFormModal } from '@/src/features/main-settings-save'
import { revertAll } from '@shared/lib/actions'
import { useAppDispatch, useAppSelector } from '@shared/lib/hooks'
import { ModificationType } from '@shared/lib/types'
import { sharedStyles } from '@shared/styles'
import { useState } from 'react'
import { View } from 'react-native'
import { Col, Grid, Row } from 'react-native-easy-grid'
import { Button, IconButton, Text } from 'react-native-paper'


interface PageState {
    mode: ModificationType
}

export const MainSettingsWidget = () => {
    const appData = useAppData()
    const dispatch = useAppDispatch()
    const mainSettings = useAppSelector(selectMainSettings)

    const [modeData, setModeData] = useState<PageState>({
        mode: 'none'
    })

    const changeMode = (mode: ModificationType = 'none') => {
        setModeData({
            ...modeData,
            mode: mode
        })
    }

    return (
        <>
            <Grid>
                <Row style={{ height: 40 }}>
                    <Text variant='bodyLarge'>Main settings</Text>
                    <IconButton
                        mode='contained'
                        icon='pencil'
                        size={22}
                        onPress={() => {
                            changeMode('edit')
                        }}
                    />
                </Row>
                <Row style={{ height: 40 }}>
                    <Col>
                        <Text variant='labelMedium'>Word learning:</Text>
                    </Col>
                    <Col>
                        <Text variant='bodyMedium'>{mainSettings.wordsLearningPartSize}</Text>
                    </Col>
                </Row>
            </Grid>
            {modeData.mode === 'edit' &&
                <MainSettingsFormModal
                    item={mainSettings}
                    onChangeItem={(item: MainSettings) => {
                        dispatch(saveMainSettings(item))
                        changeMode()
                    }}
                    onClose={changeMode}
                />
            }
            {__DEV__ &&
                <View style={sharedStyles.btnRow}>
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
                </View>
            }
        </>
    )
}
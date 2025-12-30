import { useAppData } from '@/src/app/providers/app-data-provider'
import { runMigrations } from '@/src/app/type-orm-database/data-source'
import { saveMainSettings, selectMainSettings } from '@/src/entities/settings'
import { EditableField, FieldType } from '@/src/shared/ui'
import { revertAll } from '@shared/lib/actions'
import { useAppDispatch, useAppSelector } from '@shared/lib/hooks'
import { StyleSheet } from 'react-native'
import { Button, Card } from 'react-native-paper'
import * as Yup from 'yup'


const mainSettingsSchema = Yup.object().shape({
    wordsLearningPartSize: Yup
        .number()
        .integer('Must be integer')
        .min(1, 'Min value is 1')
        .max(100, 'Max value is 100')
        .required('This is required'),
})

interface MainSettingsErrors {
    wordsLearningPartSize: number
}

export const MainSettingsWidget = () => {
    const appData = useAppData()
    const dispatch = useAppDispatch()
    const mainSettings = useAppSelector(selectMainSettings)

    function onChangeMainSettingsField(fieldName: string, fieldType: FieldType, fieldValue: string | number) {
        dispatch(saveMainSettings({
            ...mainSettings,
            [fieldName]: fieldValue
        }))
    }

    return (
        <Card mode='outlined'>
            <Card.Title title='Main settings' />
            <Card.Content>

                <EditableField
                    schema={mainSettingsSchema}
                    title='Word learning:'
                    fieldName='wordsLearningPartSize'
                    fieldType='numberInt'
                    fieldValue={mainSettings.wordsLearningPartSize}
                    onSave={onChangeMainSettingsField}
                />

                {__DEV__ &&
                    <Card.Actions>
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
                }
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        marginTop: 2,
    },
    inputFocused: {
        borderWidth: 1,
    },
    inputUnFocused: {
        borderWidth: 0,
    },
    container: {
        flex: 1,
        padding: 2,
        gap: 16,
        alignContent: 'flex-start',
        overflow: 'hidden',
        position: 'relative',
    },
})

import { SQLITE_DB_NAME } from '@app/model/sqlite-config'
import { migrateDbIfNeeded } from '@app/model/sqlite-migration'
import { SQLiteProvider } from 'expo-sqlite'
import { PropsWithChildren, Suspense } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'



export function AppSqliteProvider({ children }: PropsWithChildren) {
    return (
        <Suspense
            fallback={
                <Text
                    style={[styles.loader]}
                    variant='bodyMedium'
                >
                    Loading ...
                </Text>}
        >
            <>

                {Platform.OS === 'web' &&
                    { children }
                }
                {Platform.OS !== 'web' &&
                    <SQLiteProvider
                        databaseName={SQLITE_DB_NAME}
                        useSuspense={true}
                        onInit={migrateDbIfNeeded}
                    >
                        {children}
                    </SQLiteProvider>
                }

            </>
        </Suspense>
    )
}

const styles = StyleSheet.create({
    loader: {
        textAlignVertical: 'center',
        height: 38,
    },
})
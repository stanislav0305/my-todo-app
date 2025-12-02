import { SQLiteProvider } from 'expo-sqlite'
import { PropsWithChildren, Suspense } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { initializeTypeORM, SQLITE_DB_NAME } from '../type-orm-database/data-source'


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
                        onInit={async (db) => {
                            await initializeTypeORM()
                        }}
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
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite'
import { storageEngine } from '../model/configure-store'
import { SQLITE_DB_NAME } from './data-source'


export default class SQLiteManager {
    constructor(private db: SQLiteDatabase) { }

    async clear(): Promise<void> {
        await storageEngine.clear()
        await this.db.execAsync(`
                PRAGMA writable_schema = 1;
                DELETE FROM sqlite_master;
                PRAGMA writable_schema = 0;
                VACUUM;
                PRAGMA integrity_check;
        `)
    }
    async backup(backupName: string = `${SQLITE_DB_NAME}-backup.db`): Promise<void> {
        await backupDatabase(this.db, backupName)
    }
    async restore(): Promise<void> {
        await restoreDatabase(this.db)
    }
}

const backupDatabase = async (db: SQLiteDatabase, backupName: string) => {
    try {
        await db.execAsync('PRAGMA wal_checkpoint(FULL)')
        const appPath = FileSystem.documentDirectory
        const dbPath = `${appPath}/SQLite/${SQLITE_DB_NAME}` //db.databasePath
        const backupPath = `${appPath}/SQLite/${backupName}`

        await FileSystem.copyAsync({
            from: dbPath,
            to: backupPath,
        });

        await Sharing.shareAsync(backupPath, { mimeType: 'application/x-sqlite3' });
        await FileSystem.deleteAsync(backupPath, { idempotent: true });
    } catch (err) {
        console.error('Failed to backup', err);
    }
};

const restoreDatabase = async (db: SQLiteDatabase) => {
    try {
        const appPath = FileSystem.documentDirectory
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: true,
            multiple: false,
        });
        if (result.canceled) {
            return;
        }
        const backupPath = result.assets[0].uri;
        if (!(await FileSystem.getInfoAsync(backupPath)).exists) {
            return;
        }
        await db.execAsync('PRAGMA wal_checkpoint(FULL)');
        await db.closeAsync();
        const dbPath = `${appPath}/SQLite/${SQLITE_DB_NAME}` ////db.databasePath
        await FileSystem.deleteAsync(`${dbPath}-wal`, { idempotent: true });
        await FileSystem.deleteAsync(`${dbPath}-shm`, { idempotent: true });

        await FileSystem.copyAsync({
            to: dbPath,
            from: backupPath,
        });
    } catch (err) {
        console.error('Failed to backup', err);
    }
}

export { openDatabaseAsync, SQLiteDatabase }


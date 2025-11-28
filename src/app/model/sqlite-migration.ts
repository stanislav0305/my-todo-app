import { SQLiteDatabase } from 'expo-sqlite'


export async function migrateDbIfNeeded(db: SQLiteDatabase) {

    console.log('Begin sqlite db migration...')

    const NEW_DATABASE_VERSION = 1 //need to be updated
    console.log('NEW_DATABASE_VERSION', NEW_DATABASE_VERSION)

    try {
        let user_version = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')
        console.log('user_version', user_version!.user_version)

        let currentDbVersion = user_version!.user_version

        if (currentDbVersion >= NEW_DATABASE_VERSION) {
            console.log('Migration not needed.')
            console.log('End sqlite db migration.')
            return
        }

        if (currentDbVersion < 1) {
            console.log('Migration number 1')

            await db.execAsync(`
                PRAGMA journal_mode = 'wal';

                CREATE TABLE IF NOT EXISTS theme (
                    appThemeName TEXT,
                    selectedThemeName TEXT,
                    systemThemeName TEXT
                );
        `);

            currentDbVersion = 1
        }

        await db.execAsync(`PRAGMA user_version = ${NEW_DATABASE_VERSION};`)
    }
    catch (error) {
        console.error("Error in handleGenerateQuestions:", error)
        throw error; // Ensure the caller knows if this fails
    }
    finally {
        if (db) {
            await db.closeAsync(); // Ensure the connection is closed
            console.log("Database connection closed.")
        }
    }

    console.log('End sqlite db migration.')
}

/*
 id INTEGER PRIMARY KEY NOT NULL, 
                done INT, 
                value TEXT
*/

/*
export const runSqliteMigration = () => {
    console.log('defaultDatabaseDirectory is:', defaultDatabaseDirectory)
    const db = SQLite.openDatabaseSync(SQLITE_DB_NAME)
    new MyDatabaseHelper(db)
    db.closeSync()
}

//--------------------------------
type DBVersion = {
    version: number
}

// Assuming a database helper class
class MyDatabaseHelper {
    private db: SQLiteDatabase
    private currentDbVersion = -1

    constructor(db: SQLiteDatabase) {
        this.db = db;
        this.currentDbVersion = this.getDatabaseVersion();

        if (this.currentDbVersion < PERSIST_MIGRATION_NEW_VERSION) {
            this.migrateDatabase(this.currentDbVersion, PERSIST_MIGRATION_NEW_VERSION);
        }
    }

    private getDatabaseVersion(): number {
        let dbVersion: DBVersion | null;
        try {
            dbVersion = this.getDBVersionQuery()
        } catch (err) {
            console.warn("Table database_version not exist.", err)

            this.db.runSync("CREATE TABLE database_version (version INTEGER);")
            console.log("Table database_version created.")

            this.db.runSync("INSERT INTO database_version (version) VALUES (-1);")
            dbVersion = this.getDBVersionQuery()
        }

        if (!dbVersion) {
            console.error('Database version not detected.')
            throw new Error('Database version not detected.')
        } else {
            console.error(`Current database version is:${dbVersion.version} and new version is:${PERSIST_MIGRATION_NEW_VERSION}`)
            return dbVersion.version
        }
    }

    private getDBVersionQuery() {
        return this.db.getFirstSync<DBVersion>("SELECT version FROM database_version LIMIT 1")
    }




    private migrateDatabase(oldVersion: number, newVersion: number): void {
        console.log('Begin database migration...');
        for (let version = oldVersion + 1; version <= newVersion; version++) {
            switch (version) {
                case 0:
                    this.applyMigrationToV0()
                    break;
                // case 1:
                //     this.applyMigrationV2ToV3();
                //     break;
                // Add more cases for subsequent versions
            }
        }

        this.updateDatabaseVersion(newVersion);
        console.log('Done database migration.');
    }

    private applyMigrationToV0(): void {
        console.log("Applying migration to V0...");
        this.db.execSync("ALTER TABLE users ADD COLUMN email TEXT;");
        console.log("Applying migration to V0 ended.");
    }


    private updateDatabaseVersion(newVersion: number): void {
        try {
            this.db.runSync(
                "UPDATE database_version SET version = ?",
                [newVersion]
            )
            this.currentDbVersion = newVersion
        }
        catch (err: any) {
            console.error('Error in updateDatabaseVersion')
            throw new Error(err.message)
        }
    }
}
*/

/*
const db = await SQLite.openDatabaseSync('todo.db')

await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
INSERT INTO test (value, intValue) VALUES ('test1', 123);
INSERT INTO test (value, intValue) VALUES ('test2', 456);
INSERT INTO test (value, intValue) VALUES ('test3', 789);
`);
*/
/*
db.transact(tx => {
    tx.executeSql(
        `CREATE TABLE IF NOT EXISTS notes (
       id TEXT PRIMARY KEY NOT NULL,
       title TEXT,
       content TEXT,
       updated_at INTEGER
     );`
    );
});
*/


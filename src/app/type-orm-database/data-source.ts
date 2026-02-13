import { RegularTask, RegularTaskWeek } from '@entities/regular-tasks'
import { Task } from '@entities/tasks'
import * as SQLite from 'expo-sqlite'
import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import { TasksTableCreate1764668295103 } from './migrations/1764668295103-tasks-table-create'
import { NextMigration1765049101409 } from './migrations/1765049101409-next-migration'
import { RegularTasksTableCreate1767122311432 } from './migrations/1767122311432-regular-tasks-table-create'
import { ChangeDateFieldsTypesAndNames1767695493784 } from './migrations/1767695493784-change-dateFields-types-and-names'
import { RegularTaskRemoveFieldUseLastDayFix1770038161469 } from './migrations/1770038161469-regular-task-remove-field-useLastDayFix'
import { NextMigration1770200115507 } from './migrations/1770200115507-next-migration'
import { RegularTaskWeekTableCreate1770203616594 } from './migrations/1770203616594-regular-task-week-table-create'
import { RegularTaskWeekAddFields1770640160283 } from './migrations/1770640160283-regular-task-week-add-fields'
import { RegularTaskWeekFieldChange1770804758238 } from './migrations/1770804758238-regular-task-week-field-change'
import { NextMigration1770806236490 } from './migrations/1770806236490-next-migration'


export const SQLITE_DB_NAME = 'my-todo.db'

export const AppDataSource = new DataSource({
    database: SQLITE_DB_NAME,
    type: 'expo',
    driver: SQLite,
    entities: [Task, RegularTask, RegularTaskWeek],
    logging: true,

    synchronize: false,
    migrationsTableName: 'db_migrations',
    migrationsTransactionMode: 'each',
    migrations: [
        TasksTableCreate1764668295103,
        NextMigration1765049101409,
        RegularTasksTableCreate1767122311432,
        ChangeDateFieldsTypesAndNames1767695493784,
        RegularTaskRemoveFieldUseLastDayFix1770038161469,
        NextMigration1770200115507,
        RegularTaskWeekTableCreate1770203616594,
        RegularTaskWeekAddFields1770640160283,
        RegularTaskWeekFieldChange1770804758238,
        NextMigration1770806236490
    ], //['migrations/*{.js,.ts}'],
    migrationsRun: true,
} as DataSourceOptions)

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
export async function initializeTypeORM() {
    try {
        await AppDataSource.initialize()
            .then(async (value: DataSource) => {
                console.log('typeORM initialized.')
            })
            .catch((error) => console.log('Error in typeORM initialization:', error))
    } catch (error) {
        console.log(error)
    }
}

export async function runMigrations() {
    await AppDataSource.runMigrations()
}
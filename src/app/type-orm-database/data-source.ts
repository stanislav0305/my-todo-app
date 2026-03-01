import { ActualTaskPaging, ActualTaskView } from '@entities/actual-tasks'
import { RegularTask, RegularTaskResult, RegularTaskView, RegularTaskWeek } from '@entities/regular-tasks'
import { Task } from '@entities/tasks'
import * as SQLite from 'expo-sqlite'
import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import { NextMigration1771492520614 } from './migrations/1771492520614-next-migration'
import { NextMigration1772125435142 } from './migrations/1772125435142-next-migration'


export const SQLITE_DB_NAME = 'my-todo.db'

export const AppDataSource = new DataSource({
    database: SQLITE_DB_NAME,
    type: 'expo',
    driver: SQLite,
    entities: [
        Task,
        RegularTask, RegularTaskWeek, RegularTaskView, RegularTaskResult,
        ActualTaskPaging, ActualTaskView
    ],
    logging: true,

    synchronize: false,
    migrationsTableName: 'db_migrations',
    migrationsTransactionMode: 'each',
    migrations: [
        NextMigration1771492520614,
        NextMigration1772125435142
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
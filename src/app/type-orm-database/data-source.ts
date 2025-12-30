import { Task } from '@entities/tasks-management'
import * as SQLite from 'expo-sqlite'
import "reflect-metadata"
import { DataSource, DataSourceOptions } from 'typeorm'
import { TasksTableCreate1764668295103 } from './migrations/1764668295103-tasks-table-create'
import { NextMigration1765049101409 } from './migrations/1765049101409-next-migration'


export const SQLITE_DB_NAME = 'my-todo.db'

export const AppDataSource = new DataSource({
    database: SQLITE_DB_NAME,
    type: 'expo',
    driver: SQLite,
    entities: [Task],
    logging: true,

    synchronize: false,
    migrationsTableName: 'db_migrations',
    migrationsTransactionMode: 'each',
    migrations: [TasksTableCreate1764668295103, NextMigration1765049101409],//['migrations/*{.js,.ts}'],
    migrationsRun: true,
} as DataSourceOptions)

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
export async function initializeTypeORM() {
    try {
        await AppDataSource.initialize().then(async () => {
            console.log("typeORM initialized.")
        }).catch(error => console.log('Error in typeORM initialization:', error))

    } catch (error) {
        console.log(error)
    }
}

export async function runMigrations() {
    await AppDataSource.runMigrations()
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//This data source only for generate migrations with typeorm cli
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/* sqlite3 lib is needed and is used in project only for typeorm cli migrations */
import { DataSource } from 'typeorm'
import { Task } from '../../entities/tasks-management/types/task'

export const AppDataSource = new DataSource({
    database: 'my-todo-migration-test.db',//"C:/Users/Stas/Downloads/my-todo.db-backup (3).db", //only for migration generation and check
    type: "sqlite",
    entities: [Task],
    logging: true,
    synchronize: false,
    migrations: ['migrations/*{.js,.ts}'],
    subscribers: [],
    migrationsTableName: 'db_migrations',
    migrationsTransactionMode: 'each',
    migrationsRun: true,
})
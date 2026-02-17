//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//This data source only for generate migrations with typeorm cli
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/* sqlite3 lib is needed and is used in project only for typeorm cli migrations */
import { DataSource } from 'typeorm'
import { RegularTaskView } from '../../entities/regular-tasks/types/regular-task-view.entity'
import { RegularTaskWeek } from '../../entities/regular-tasks/types/regular-task-week.entity'
import { RegularTask } from '../../entities/regular-tasks/types/regular-task.entity'
import { Task } from '../../entities/tasks/types/task.entity'


export const AppDataSource = new DataSource({
    database: 'my-todo-migration-test.db',//"C:/Users/Stas/Downloads/my-todo.db-backup (3).db", //only for migration generation and check
    type: "sqlite",
    entities: [Task, RegularTask, RegularTaskWeek, RegularTaskView],
    logging: true,
    synchronize: false,
    migrations: ['migrations/*{.js,.ts}'],
    subscribers: [],
    migrationsTableName: 'db_migrations',
    migrationsTransactionMode: 'each',
    migrationsRun: true,
})
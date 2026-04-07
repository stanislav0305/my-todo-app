import { ActualTaskPaging, ActualTaskView } from '@entities/actual-tasks'
import { RegularTask, RegularTaskResult, RegularTaskView, RegularTaskWeek } from '@entities/regular-tasks'
import { Task } from '@entities/tasks'
import 'reflect-metadata'
import { DataSource } from 'typeorm'


export const setupTestAppDataSource = async () => {
    const testAppDataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true, //if true then not need migrate database
        entities: [
            Task,
            RegularTask, RegularTaskWeek, RegularTaskView, RegularTaskResult,
            ActualTaskPaging, ActualTaskView
        ],
        logging: false,
        synchronize: true,
        migrationsRun: true,
        subscribers: []
    })

    await testAppDataSource.initialize()
        .catch((error) => console.error('Error in typeORM initialization:', error))

    return testAppDataSource
}
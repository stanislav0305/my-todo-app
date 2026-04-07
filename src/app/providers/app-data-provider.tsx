import { ActualTaskPaging, ActualTaskView } from '@entities/actual-tasks'
import { actualTaskPagingExtendedRepository, ActualTaskPagingExtendedRepository } from '@entities/actual-tasks/model/actual-task-paging.extended.repository'
import { actualTaskViewExtendedRepository, ActualTaskViewExtendedRepository } from '@entities/actual-tasks/model/actual-task-view.extended.repository'
import { RegularTask, RegularTaskResult, RegularTaskView, RegularTaskWeek } from '@entities/regular-tasks'
import { regularTaskResultExtendedRepository, RegularTaskResultExtendedRepository } from '@entities/regular-tasks/model/regular-task-result.extended.repository'
import { RegularTaskViewExtendedRepository, regularTaskViewExtendedRepository } from '@entities/regular-tasks/model/regular-task-view.extended.repository'
import { regularTaskWeekExtendedRepository, RegularTaskWeekExtendedRepository } from '@entities/regular-tasks/model/regular-task-week.extended.repository'
import { RegularTaskExtendedRepository, regularTaskExtendedRepository } from '@entities/regular-tasks/model/regular-task.extended.repository'
import { Task, taskExtendedRepository, TaskExtendedRepository } from '@entities/tasks'
import * as SQLite from 'expo-sqlite'
import React, { createContext, PropsWithChildren, useContext } from "react"
import 'reflect-metadata'
import { AppDataSource, SQLITE_DB_NAME } from '../type-orm-database/data-source'
import SQLiteManager from '../type-orm-database/sqlite-manager'


type AppDataContextValueType = {
    dataManager: SQLiteManager
    taskRep: TaskExtendedRepository
    regularTaskRep: RegularTaskExtendedRepository
    regularTaskViewRep: RegularTaskViewExtendedRepository
    regularTaskWeekRep: RegularTaskWeekExtendedRepository
    regularTaskResultRep: RegularTaskResultExtendedRepository
    actualTaskViewRep: ActualTaskViewExtendedRepository
    actualTaskPagingRep: ActualTaskPagingExtendedRepository
}

const db = SQLite.openDatabaseSync(SQLITE_DB_NAME)

export const AppDataContext = createContext<AppDataContextValueType>({
    dataManager: new SQLiteManager(db),
    taskRep: AppDataSource.getRepository(Task).extend(taskExtendedRepository),
    regularTaskRep: AppDataSource.getRepository(RegularTask).extend(regularTaskExtendedRepository),
    regularTaskViewRep: AppDataSource.getRepository(RegularTaskView).extend(regularTaskViewExtendedRepository),
    regularTaskWeekRep: AppDataSource.getRepository(RegularTaskWeek).extend(regularTaskWeekExtendedRepository),
    regularTaskResultRep: AppDataSource.getRepository(RegularTaskResult).extend(regularTaskResultExtendedRepository),
    actualTaskViewRep: AppDataSource.getRepository(ActualTaskView).extend(actualTaskViewExtendedRepository),
    actualTaskPagingRep: AppDataSource.getRepository(ActualTaskPaging).extend(actualTaskPagingExtendedRepository),
} satisfies AppDataContextValueType as AppDataContextValueType)

export const useAppData = () => {
    const context = useContext(AppDataContext)
    if (!context) {
        throw new Error('useAppDataContext must be used within a AppDataProvider')
    }

    return context
}

export const AppDataProvider = ({ children }: PropsWithChildren) => {
    const appDataContext = useAppData()

    return (
        <AppDataContext.Provider value={appDataContext}>
            {children}
        </AppDataContext.Provider>
    )
}
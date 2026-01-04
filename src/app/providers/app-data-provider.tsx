import { RegularTask } from '@entities/regular-tasks'
import { Task } from '@entities/tasks'
import * as SQLite from 'expo-sqlite'
import React, { createContext, PropsWithChildren, useContext } from "react"
import 'reflect-metadata'
import { Repository } from 'typeorm'
import { AppDataSource, SQLITE_DB_NAME } from '../type-orm-database/data-source'
import SQLiteManager from '../type-orm-database/sqlite-manager'


type AppDataContextValueType = {
    dataManager: SQLiteManager
    taskRep: Repository<Task>
    regularTaskRep: Repository<RegularTask>
}

const db = SQLite.openDatabaseSync(SQLITE_DB_NAME)

export const AppDataContext = createContext<AppDataContextValueType>({
    dataManager: new SQLiteManager(db),
    taskRep: AppDataSource.getRepository(Task),
    regularTaskRep: AppDataSource.getRepository(RegularTask)
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
export type TaskStatus = 'todo' | 'doing' | 'done'

export interface Task {
    key: string
    time: string
    date: string
    title: string
    status: TaskStatus
}
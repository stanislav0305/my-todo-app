import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'


export type TaskStatus = 'todo' | 'doing' | 'done'

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text', { nullable: true })
    time: string

    @Column('text', { nullable: true })
    date: string

    @Column('text', { nullable: true })
    title: string

    @Column('text')
    status: TaskStatus
}
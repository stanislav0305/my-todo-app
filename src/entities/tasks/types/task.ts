import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'


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

    @Column('boolean', { nullable: false, default: false })
    isImportant: boolean

    @Column('boolean', { nullable: false, default: false })
    isUrgent: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updateAt: Date

    @DeleteDateColumn()
    deletedAt: Date | null
}
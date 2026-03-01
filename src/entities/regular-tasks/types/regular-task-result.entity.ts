import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'


export type RegularTaskStatus = 'todo' | 'doing' | 'done'

@Entity('regularTasksResults')
export class RegularTaskResult {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('integer', { nullable: true })
    regularTaskId: number | null

    @Column('varchar', { length: 5, nullable: true })
    time: string

    @Column('varchar', { length: 10, nullable: true })
    date: string

    @Column('text', { nullable: true })
    title: string

    @Column('text')
    status: RegularTaskStatus

    @Column('boolean', { nullable: false, default: false })
    isImportant: boolean

    @Column('boolean', { nullable: false, default: false })
    isUrgent: boolean

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updateAt: string

    @DeleteDateColumn()
    deletedAt: string | null
}
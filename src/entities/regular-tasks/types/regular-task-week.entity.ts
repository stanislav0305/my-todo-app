import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import type { RegularTask } from './regular-task.entity'


@Entity('regularTasksWeek')
export class RegularTaskWeek {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('varchar', { length: 10, nullable: false })
    beginDate: string

    @OneToMany('RegularTask', (rt: RegularTask) => rt.week, {
        nullable: true, cascade: ["insert", "update", "remove", "soft-remove", "recover"]
    })
    @JoinTable()
    weekDays: RegularTask[]

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updateAt: string

    @DeleteDateColumn()
    deletedAt: string | null
}
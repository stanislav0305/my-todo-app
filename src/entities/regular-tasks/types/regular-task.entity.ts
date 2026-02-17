import { Column, CreateDateColumn, DeleteDateColumn, Entity, ForeignKey, JoinTable, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm'
import type { RegularTaskWeek } from './regular-task-week.entity'


export type Period = 'everyDay' | 'everyWeek' | 'everyMonth' | 'everyYear'

@Entity('regularTasks')
export class RegularTask {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('varchar', { length: 5, nullable: true })
    time: string

    @Column('varchar', { length: 10, nullable: false })
    beginDate: string
    @Column('varchar', { length: 10, nullable: true })
    endDate: string | null

    @Column('varchar', { length: 25, nullable: false, default: 'everyDay' })
    period: Period
    @Column('varchar', { length: 25, nullable: false, default: '+1 day' })
    periodParam: string

    //if (period = everyDay) then 
    //          begin from 'beginDate' and end to 'endDate' if entered 
    //          periodSize = repeat each first, second ... day
    //          =>
    //          Repeat DAILY every (1, 2, ...) day

    //if (period = everyWeek) then 
    //          begin from 'beginDate' and end to 'endDate' if entered 
    //          periodSize = repeat each one, second or ... (1, 2, ...) week 
    //          su, mo, tu, we, th, fr, sa = repeat on Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
    //          =>
    //          Repeat WEEKLY every (1, 2, ...) weeks on (Sunday, Monday, Tuesday, Wednesday, Thursday, Friday or Saturday ...) 

    //if (period = everyMonth) then
    //          begin from 'beginDate' and end to 'endDate' if entered 
    //          periodSize = repeat each one, second or ... (1, 2, ...) month 
    //          =>
    //          if (everyMonthType = 'byDayOfMonth') => Repeat MONTHLY every (1, 2, ...) months on the (1, 2, ...) day of date 'beginDate' and 

    //if (period = everyYear) then
    //          begin from 'beginDate' and end to 'endDate' if entered 
    //          periodSize = repeat each first, second ... year on day and month 'beginDate'
    //          =>
    //          Repeat DAILY every (1, 2, ...) on day and month 'beginDate'
    //if (period = everyYear) then repeat each one, second or ... day 
    @Column('integer', { nullable: false, default: 1 })
    periodSize: number

    @Column('text', { nullable: true })
    title: string

    @Column('boolean', { nullable: false, default: false })
    isImportant: boolean

    @Column('boolean', { nullable: false, default: false })
    isUrgent: boolean

    @Column('integer', { nullable: true })
    weekDay: number | null

    @Column('integer', { nullable: true })
    @ForeignKey<RegularTaskWeek>('RegularTaskWeek', 'id', { name: 'FK_week_id' })
    weekId: number | null

    @ManyToOne('RegularTaskWeek', (rtw: RegularTaskWeek) => rtw.weekDays, {
        nullable: true, orphanedRowAction: "delete", // If this child is removed from the parent's children array, delete the child row
    })
    @JoinTable({ name: "weekId" })
    week: Relation<RegularTaskWeek | null>


    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updateAt: string

    @DeleteDateColumn()
    deletedAt: string | null
}
import { Column, PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm'
import { Period } from './regular-task.entity'


@ViewEntity({
    name: 'regularTasksView',
    expression: `
    SELECT 
        r.id, 
        r.time, 

        r.beginDate, 
        r.endDate, 

        r.period, 
        r.periodParam, 
        r.periodSize, 

        r.title, 
        r.isImportant, 
        r.isUrgent, 
        r.weekId,

        r.createdAt, 
        r.updateAt, 
        r.deletedAt, 

        false as su,
        false as mo,
        false as tu,
        false as we,
        false as th,
        false as fr,
        false as sa
    FROM regularTasks r
    WHERE r.period <> 'everyWeek'
    UNION
    SELECT 
        MIN(r.id),
        r.time,

        IFNULL(rtw.beginDate, r.beginDate), 
        r.endDate,

        r.period, 
        '' as periodParam, 
        r.periodSize, 

        r.title, 
        r.isImportant, 
        r.isUrgent, 
        r.weekId,
        
        IFNULL(rtw.createdAt, r.createdAt), 
        IFNULL(rtw.updateAt, r.updateAt), 
        IFNULL(rtw.deletedAt, r.deletedAt), 

        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 0) is not null as su,
        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 1) is not null as mo,
        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 2) is not null as tu,
        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 3) is not null as we,
        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 4) is not null as th,
        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 5) is not null as fr,
        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 6) is not null as sa
    FROM regularTasks r
    JOIN regularTasksWeek rtw
    ON rtw.id = r.weekId AND r.period = 'everyWeek'
    GROUP BY r.weekId
    `
})
export class RegularTaskView {
    @PrimaryColumn('integer')
    id: number

    @Column('varchar', { length: 5, nullable: true })
    time: string

    @Column('varchar', { length: 10, nullable: false })
    beginDate: string //if period = 'everyWeek' then get data from regularTasksWeek table else from regularTasks
    @Column('varchar', { length: 10, nullable: true })
    endDate: string | null

    @Column('varchar', { length: 25, nullable: false, default: 'everyDay' })
    period: Period
    @Column('varchar', { length: 25, nullable: false, default: '+1 day' })
    periodParam: string
    @Column('integer', { nullable: false, default: 1 })
    periodSize: number

    @Column('text', { nullable: true })
    title: string

    @Column('boolean', { nullable: false, default: false })
    isImportant: boolean

    @Column('boolean', { nullable: false, default: false })
    isUrgent: boolean

    @Column('integer', { nullable: true })
    weekId: number | null

    @ViewColumn()
    createdAt: string //if period = 'eachWeek' then get data from regularTaskWeek else from regularTask

    @ViewColumn()
    updateAt: string //if period = 'eachWeek' then get data from regularTaskWeek else from regularTask

    @ViewColumn()
    deletedAt: string | null //if period = 'eachWeek' then get data from regularTaskWeek else from regularTask


    @Column('boolean', { nullable: false })
    su: boolean

    @Column('boolean', { nullable: false })
    mo: boolean

    @Column('boolean', { nullable: false })
    tu: boolean

    @Column('boolean', { nullable: false })
    we: boolean

    @Column('boolean', { nullable: false })
    th: boolean

    @Column('boolean', { nullable: false })
    fr: boolean

    @Column('boolean', { nullable: false })
    sa: boolean
}
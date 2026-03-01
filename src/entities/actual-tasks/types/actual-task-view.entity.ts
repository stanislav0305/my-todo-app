
import { Column, PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm'

export type ActualTaskPeriod = 'everyDay' | 'everyWeek' | 'everyMonth' | 'everyYear'
export type ActualTaskStatus = 'todo' | 'doing' | 'done'

@ViewEntity({
    name: 'actualTasksView',
    expression: `
WITH RECURSIVE dates (
    id,
    isFirstGen,

    time,
    date,

    title,

    regularTaskId,
    taskId,
    regularTasksResultId,

    weekDay,
    periodParam, 
    period, 
    periodSize,

    isImportant, 
    isUrgent, 
    
    createdAt, 
    updateAt, 
    deletedAt, 
    
    beginDate, 
    endDate,

    status,

    pagingDateFrom, 
    pagingDateTo
) 
AS (
    SELECT
        IFNULL(rt.id, 0) || '-' || 0 || '-' || IFNULL(rtr.id, 0) || '-' || rt.beginDate AS id,
        'true ' || rt.period AS isFirstGen,

        rt.time,
        rt.beginDate AS date,

        rt.title,

        rt.id AS regularTaskId, 
        NULL AS taskId,
        rtr.id AS regularTasksResultId,

        rt.weekDay,
        rt.periodParam,
        rt.period, 
        rt.periodSize,

        rt.isImportant, 
        rt.isUrgent, 
        
        rt.createdAt, 
        rt.updateAt, 
        rt.deletedAt,

        rt.beginDate, 
        rt.endDate,

        NULL AS status,

        atp.dateFrom AS pagingDateFrom, 
        atp.dateTo AS pagingDateTo
    FROM regularTasks AS rt
    JOIN actualTasksPaging atp
    LEFT JOIN regularTasksResults rtr ON rt.id = rtr.regularTaskId AND rt.beginDate = rtr.date
    WHERE 
        rt.deletedAt IS NULL
        AND
        (
            -- if rt.beginDate in from atp.dateFrom to  atp.dateTo 
            (atp.dateFrom <= rt.beginDate AND atp.dateTo >= rt.beginDate)
            -- if rt.endDate is null or in from atp.dateFrom to  atp.dateTo 
            OR (rt.endDate IS NULL OR (atp.dateFrom <= rt.endDate AND atp.dateTo >= rt.endDate))
            -- if atp.dateFrom in from rt.beginDate to rt.endDate
            OR (rt.beginDate <= atp.dateFrom AND rt.beginDate >= atp.dateTo)
            -- if atp.dateTo is null or in from atp.dateFrom to atp.dateTo 
            OR (rt.endDate IS NULL OR (rt.endDate <= atp.dateFrom AND rt.endDate >= atp.dateTo))
        )
    UNION ALL
    SELECT
        IFNULL(d.regularTaskId, 0) || '-' || IFNULL(d.taskId, 0) || '-' || IFNULL(rtr.id, 0) || '-' 
            || date(d.date, d.periodParam) AS id,
        'false ' || d.period AS isFirstGen,

        d.time,
        date(d.date, d.periodParam) AS date,

        d.title,

        d.regularTaskId, 
        d.taskId,
        rtr.id AS regularTasksResultId,

        d.weekDay,
        d.periodParam,
        d.period, 
        d.periodSize,

        d.isImportant, 
        d.isUrgent, 
        
        d.createdAt, 
        d.updateAt, 
        d.deletedAt, 
        
        d.beginDate, 
        d.endDate,

        rtr.status,

        d.pagingDateFrom, 
        d.pagingDateTo
    FROM dates d
    LEFT JOIN regularTasksResults rtr ON d.regularTaskId = rtr.regularTaskId AND d.date = rtr.date
    WHERE
        date(d.date, d.periodParam) >= d.beginDate
        AND (d.endDate IS NULL OR date(d.date, d.periodParam) <= d.endDate)
        AND date(d.date, d.periodParam) <= d.pagingDateTo
)

SELECT 
	d.id,
    d.isFirstGen,

    d.time, 
    d.date,

    d.title,

    d.regularTaskId, 
    d.taskId,
    d.regularTasksResultId,

    d.weekDay,
    d.periodParam,
    d.period, 
    d.periodSize,

    d.isImportant, 
    d.isUrgent,

    d.createdAt, 
    d.updateAt, 
    d.deletedAt,

    d.beginDate, 
    d.endDate,

    d.status, 

    d.pagingDateFrom, 
    d.pagingDateTo
FROM dates d
JOIN actualTasksPaging atp
WHERE 
    d.deletedAt IS NULL
    AND d.date >= atp.dateFrom
    AND d.date <= atp.dateTo
UNION 
SELECT
    0 || '-' || t.id || '-' || 0 || '-' || t.date AS id,
    'false task' AS isFirstGen,

    t.time, 
    t.date,

    t.title,

    NULL AS regularTaskId, 
    t.id AS taskId,
    NULL AS regularTasksResultId,

    NULL AS weekDay,
    NULL AS periodParam,
    NULL AS period, 
    NULL AS periodSize,

    t.isImportant, 
    t.isUrgent,

    t.createdAt, 
    t.updateAt, 
    t.deletedAt,

    NULL AS beginDate, 
    NULL AS endDate,

    t.status, 

    atp.dateFrom AS pagingDateFrom, 
    atp.dateTo AS pagingDateTo
FROM tasks t
JOIN actualTasksPaging atp
WHERE 
    t.deletedAt IS NULL
    AND t.date >= atp.dateFrom
    AND t.date <= atp.dateTo
ORDER BY date, time, period, taskId, regularTaskId
`
})
export class ActualTaskView {
    @PrimaryColumn('text')
    id: string

    @Column('text', { nullable: true })
    isFirstGen: string

    @Column('varchar', { length: 5, nullable: true })
    time: string

    @Column('varchar', { length: 10, nullable: true })
    date: string

    @Column('text', { nullable: true })
    title: string

    @Column('integer', { nullable: true })
    regularTaskId: number | null
    @Column('integer', { nullable: true })
    taskId: number | null
    @Column('integer', { nullable: true })
    regularTasksResultId: number | null

    @Column('integer', { nullable: true })
    weekDay: number | null
    @Column('varchar', { length: 25, nullable: true })
    periodParam: string
    @Column('varchar', { length: 25, nullable: true })
    period: ActualTaskPeriod | null
    @Column('integer', { nullable: true })
    periodSize: number | null

    @Column('boolean', { nullable: false, default: false })
    isImportant: boolean
    @Column('boolean', { nullable: false, default: false })
    isUrgent: boolean

    @ViewColumn()
    createdAt: string
    @ViewColumn()
    updateAt: string
    @ViewColumn()
    deletedAt: string | null

    @Column('varchar', { length: 10, nullable: true })
    beginDate: string | null
    @Column('varchar', { length: 10, nullable: true })
    endDate: string | null

    @Column('text')
    status: ActualTaskStatus

    @Column('varchar', { length: 10, nullable: true })
    pagingDateFrom: string | null
    @Column('varchar', { length: 10, nullable: true })
    pagingDateTo: string | null
}
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export type Period = 'everyDay' | 'everyWeek' | 'everyMonth' | 'everyYear'

@Entity('regularTasks')
export class RegularTask {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text', { nullable: true })
    time: string

    @Column('date', { nullable: false, default: Date.now() })
    from: Date
    @Column('date', { nullable: true })
    to: Date | null

    @Column('varchar', { length: 50, nullable: false, default: 'everyDay' })
    period: Period
    //if (period = everyDay) then 
    //          begin from 'from date' and end to 'to date' if entered 
    //          periodSize = repeat each first, second ... day
    //          =>
    //          Repeat DAILY every (1, 2, ...) day

    //if (period = everyWeek) then 
    //          begin from 'from date' and end to 'to date' if entered 
    //          periodSize = repeat each one, second or ... (1, 2, ...) week 
    //          su, mo, tu, we, th, fr, sa = repeat on Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
    //          =>
    //          Repeat WEEKLY every (1, 2, ...) weeks on (Sunday, Monday, Tuesday, Wednesday, Thursday, Friday or Saturday ...) 

    //if (period = everyMonth) then
    //          begin from 'from date' and end to 'to date' if entered 
    //          periodSize = repeat each one, second or ... (1, 2, ...) month 
    //          useLastDayFix = 
    //                      true  - if month day number 'from date' not exist in current month use last month day number in current month
    //                   or false - skip month because month day number not exist in current month
    //          =>
    //          if (everyMonthType = 'byDayOfMonth') => Repeat MONTHLY every (1, 2, ...) months on the (1, 2, ...) day of date 'from date' and 
    //          (if useLastDayFix = true) use last month day number if months on the (1, 2, ...) day not exist
    //          (else useLastDayFix = false) skip month if months on the (1, 2, ...) day not exist

    //if (period = everyYear) then
    //          begin from 'from date' and end to 'to date' if entered 
    //          periodSize = repeat each first, second ... year on day and month 'from date'
    //          =>
    //          Repeat DAILY every (1, 2, ...) on day and month 'from date'
    //          (if useLastDayFix = true) use last month day number if months on the (1, 2, ...) day not exist
    //          (else useLastDayFix = false) skip month if months on the (1, 2, ...) day not exist

    //if (period = everyYear) then repeat each one, second or ... day 
    @Column('integer', { nullable: false, default: 1 })
    periodSize: number
    //fix last day of month if entered date in current month not exist (for example 30 29 or 28) - calc last of month day
    //fix date of year if entered date in current year not exist - calc last of month day
    @Column('boolean', { nullable: false, default: false })
    useLastDayFix: boolean

    //for everyWeek only
    @Column('boolean', { nullable: false, default: false })
    su: boolean
    @Column('boolean', { nullable: false, default: false })
    mo: boolean
    @Column('boolean', { nullable: false, default: false })
    tu: boolean
    @Column('boolean', { nullable: false, default: false })
    we: boolean
    @Column('boolean', { nullable: false, default: false })
    th: boolean
    @Column('boolean', { nullable: false, default: false })
    fr: boolean
    @Column('boolean', { nullable: false, default: false })
    sa: boolean


    @Column('text', { nullable: true })
    title: string

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
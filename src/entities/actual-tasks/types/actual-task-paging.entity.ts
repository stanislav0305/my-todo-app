import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'


export type ActualTaskDatesPeriod = 'byDay' | 'byWeek' | 'byMonth'

@Entity('actualTasksPaging')
export class ActualTaskPaging {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('varchar', { length: 10, nullable: false, default: '2026-02-18' })
    dateFrom: string

    @Column('varchar', { length: 10, nullable: false, default: '2026-02-18' })
    dateTo: string

    @Column('varchar', { length: 25, nullable: false, default: 'byDay' })
    period: ActualTaskDatesPeriod
}
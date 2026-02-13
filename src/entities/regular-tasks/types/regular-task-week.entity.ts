import { Column, CreateDateColumn, DeleteDateColumn, Entity, ForeignKey, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm'
import type { RegularTask } from './regular-task.entity'


@Entity('regularTasksWeek')
export class RegularTaskWeek {
    @PrimaryGeneratedColumn('increment')
    id: number

    @OneToOne('RegularTask', (regularTask: RegularTask) => regularTask.week, {
        nullable: true, cascade: ["insert", "update", "remove", "soft-remove", "recover"]
    })
    @JoinColumn({ name: "suRegularTaskId" })
    su: Relation<RegularTask | null>

    @Column('integer', { nullable: true })
    @ForeignKey<RegularTask>('RegularTask', 'id', { name: 'FK_week_su_regularTask' })
    suRegularTaskId: number | null

    @OneToOne('RegularTask', (regularTask: RegularTask) => regularTask.week, {
        nullable: true, cascade: ["insert", "update", "remove", "soft-remove", "recover"]
    })
    @JoinColumn({ name: "moRegularTaskId" })
    mo: Relation<RegularTask | null>

    @Column('integer', { nullable: true })
    @ForeignKey<RegularTask>('RegularTask', 'id', { name: 'FK_week_mo_regularTask' })
    moRegularTaskId: number | null

    @OneToOne('RegularTask', (regularTask: RegularTask) => regularTask.week, {
        nullable: true, cascade: ["insert", "update", "remove", "soft-remove", "recover"]
    })
    @JoinColumn({ name: "tuRegularTaskId" })
    tu: Relation<RegularTask | null>

    @Column('integer', { nullable: true })
    @ForeignKey<RegularTask>('RegularTask', 'id', { name: 'FK_week_tu_regularTask' })
    tuRegularTaskId: number | null

    @OneToOne('RegularTask', (regularTask: RegularTask) => regularTask.week, {
        nullable: true, cascade: ["insert", "update", "remove", "soft-remove", "recover"]
    })
    @JoinColumn({ name: "weRegularTaskId" })
    we: Relation<RegularTask | null>

    @Column('integer', { nullable: true })
    @ForeignKey<RegularTask>('RegularTask', 'id', { name: 'FK_week_we_regularTask' })
    weRegularTaskId: number | null

    @OneToOne('RegularTask', (regularTask: RegularTask) => regularTask.week, {
        nullable: true, cascade: ["insert", "update", "remove", "soft-remove", "recover"]
    })
    @JoinColumn({ name: "thRegularTaskId" })
    th: Relation<RegularTask | null>

    @Column('integer', { nullable: true })
    @ForeignKey<RegularTask>('RegularTask', 'id', { name: 'FK_week_th_regularTask' })
    thRegularTaskId: number | null

    @OneToOne('RegularTask', (regularTask: RegularTask) => regularTask.week, {
        nullable: true, cascade: ["insert", "update", "remove", "soft-remove", "recover"]
    })
    @JoinColumn({ name: "frRegularTaskId" })
    fr: Relation<RegularTask | null>

    @Column('integer', { nullable: true })
    @ForeignKey<RegularTask>('RegularTask', 'id', { name: 'FK_week_fr_regularTask' })
    frRegularTaskId: number | null

    @OneToOne('RegularTask', (regularTask: RegularTask) => regularTask.week, {
        nullable: true, cascade: ["insert", "update", "remove", "soft-remove", "recover"]
    })
    @JoinColumn({ name: "saRegularTaskId" })
    sa: Relation<RegularTask | null>

    @Column('integer', { nullable: true })
    @ForeignKey<RegularTask>('RegularTask', 'id', { name: 'FK_week_sa_regularTask' })
    saRegularTaskId: number | null

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updateAt: string

    @DeleteDateColumn()
    deletedAt: string | null
}
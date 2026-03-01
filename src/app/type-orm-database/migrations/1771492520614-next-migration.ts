import { MigrationInterface, QueryRunner } from "typeorm"

export class NextMigration1771492520614 implements MigrationInterface {
    name = 'NextMigration1771492520614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "regularTasksWeek" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "beginDate" varchar(10) NOT NULL, 
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "updateAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "deletedAt" datetime)
        `)
        await queryRunner.query(
            `CREATE TABLE "regularTasks" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "time" varchar(5), 
                "beginDate" varchar(10) NOT NULL, 
                "endDate" varchar(10), 
                "period" varchar(25) NOT NULL DEFAULT ('everyDay'), 
                "periodParam" varchar(25) NOT NULL DEFAULT ('+1 day'), 
                "periodSize" integer NOT NULL DEFAULT (1), 
                "title" text, 
                "isImportant" boolean NOT NULL DEFAULT (0), 
                "isUrgent" boolean NOT NULL DEFAULT (0), 
                "weekDay" integer, 
                "weekId" integer, 
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "updateAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "deletedAt" datetime
            )`)
        await queryRunner.query(
            `CREATE TABLE "tasks" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "time" varchar(5), 
                "date" varchar(10), 
                "title" text, 
                "status" text NOT NULL, 
                "isImportant" boolean NOT NULL DEFAULT (0), 
                "isUrgent" boolean NOT NULL DEFAULT (0), 
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "updateAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "deletedAt" datetime
            )`)
        await queryRunner.query(
            `CREATE TABLE "temporary_regularTasks" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "time" varchar(5), 
                "beginDate" varchar(10) NOT NULL, 
                "endDate" varchar(10), 
                "period" varchar(25) NOT NULL DEFAULT ('everyDay'), 
                "periodParam" varchar(25) NOT NULL DEFAULT ('+1 day'), 
                "periodSize" integer NOT NULL DEFAULT (1), 
                "title" text, 
                "isImportant" boolean NOT NULL DEFAULT (0), 
                "isUrgent" boolean NOT NULL DEFAULT (0), 
                "weekDay" integer, 
                "weekId" integer, 
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "updateAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "deletedAt" datetime, 
                CONSTRAINT "FK_c2e7e909d97d03ccee93c1905e2" 
                    FOREIGN KEY ("weekId") 
                    REFERENCES "regularTasksWeek" ("id") 
                    ON DELETE NO ACTION ON UPDATE NO ACTION, 
                CONSTRAINT "FK_week_id" 
                    FOREIGN KEY ("weekId") 
                    REFERENCES "regularTasksWeek" ("id") 
                    ON DELETE NO ACTION ON UPDATE NO ACTION
            )`)
        await queryRunner.query(
            `INSERT INTO "temporary_regularTasks"(
                "id", "time", "beginDate", "endDate", "period", "periodParam", "periodSize", 
                "title", "isImportant", "isUrgent", "weekDay", "weekId", "createdAt", "updateAt", "deletedAt") 
            SELECT "id", "time", "beginDate", "endDate", "period", "periodParam", "periodSize", "title", 
                "isImportant", "isUrgent", "weekDay", "weekId", "createdAt", "updateAt", "deletedAt" 
            FROM "regularTasks"
            `)
        await queryRunner.query(`DROP TABLE "regularTasks"`)
        await queryRunner.query(`ALTER TABLE "temporary_regularTasks" RENAME TO "regularTasks"`)
        await queryRunner.query(
            `CREATE VIEW "regularTasksView" AS 
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
            `)

        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (NULL, NULL, NULL, ?, ?, ?)`, ["VIEW", "regularTasksView", "SELECT \n        r.id, \n        r.time, \n\n        r.beginDate, \n        r.endDate, \n\n        r.period, \n        r.periodParam, \n        r.periodSize, \n\n        r.title, \n        r.isImportant, \n        r.isUrgent, \n        r.weekId,\n\n        r.createdAt, \n        r.updateAt, \n        r.deletedAt, \n\n        false as su,\n        false as mo,\n        false as tu,\n        false as we,\n        false as th,\n        false as fr,\n        false as sa\n    FROM regularTasks r\n    WHERE r.period <> 'everyWeek'\n    UNION\n    SELECT \n        MIN(r.id),\n        r.time,\n\n        IFNULL(rtw.beginDate, r.beginDate), \n        r.endDate,\n\n        r.period, \n        '' as periodParam, \n        r.periodSize, \n\n        r.title, \n        r.isImportant, \n        r.isUrgent, \n        r.weekId,\n        \n        IFNULL(rtw.createdAt, r.createdAt), \n        IFNULL(rtw.updateAt, r.updateAt), \n        IFNULL(rtw.deletedAt, r.deletedAt), \n\n        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 0) is not null as su,\n        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 1) is not null as mo,\n        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 2) is not null as tu,\n        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 3) is not null as we,\n        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 4) is not null as th,\n        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 5) is not null as fr,\n        (SELECT r2.id FROM regularTasks r2 WHERE r2.weekId = r.weekId AND r2.weekDay = 6) is not null as sa\n    FROM regularTasks r\n    JOIN regularTasksWeek rtw\n    ON rtw.id = r.weekId AND r.period = 'everyWeek'\n    GROUP BY r.weekId"])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = ? AND "name" = ?`, ["VIEW", "regularTasksView"])
        await queryRunner.query(`DROP VIEW "regularTasksView"`)
        await queryRunner.query(`ALTER TABLE "regularTasks" RENAME TO "temporary_regularTasks"`)
        await queryRunner.query(`CREATE TABLE "regularTasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "time" varchar(5), "beginDate" varchar(10) NOT NULL, "endDate" varchar(10), "period" varchar(25) NOT NULL DEFAULT ('everyDay'), "periodParam" varchar(25) NOT NULL DEFAULT ('+1 day'), "periodSize" integer NOT NULL DEFAULT (1), "title" text, "isImportant" boolean NOT NULL DEFAULT (0), "isUrgent" boolean NOT NULL DEFAULT (0), "weekDay" integer, "weekId" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updateAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime)`)
        await queryRunner.query(`INSERT INTO "regularTasks"("id", "time", "beginDate", "endDate", "period", "periodParam", "periodSize", "title", "isImportant", "isUrgent", "weekDay", "weekId", "createdAt", "updateAt", "deletedAt") SELECT "id", "time", "beginDate", "endDate", "period", "periodParam", "periodSize", "title", "isImportant", "isUrgent", "weekDay", "weekId", "createdAt", "updateAt", "deletedAt" FROM "temporary_regularTasks"`)
        await queryRunner.query(`DROP TABLE "temporary_regularTasks"`)
        await queryRunner.query(`DROP TABLE "tasks"`)
        await queryRunner.query(`DROP TABLE "regularTasks"`)
        await queryRunner.query(`DROP TABLE "regularTasksWeek"`)
    }
}

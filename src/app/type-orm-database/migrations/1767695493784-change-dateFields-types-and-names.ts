import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDateFieldsTypesAndNames1767695493784 implements MigrationInterface {
    name = 'ChangeDateFieldsTypesAndNames1767695493784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "temporary_regularTasks" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "time" varchar(5), 
                "period" varchar(25) NOT NULL DEFAULT ('everyDay'), 
                "periodSize" integer NOT NULL DEFAULT (1), 
                "useLastDayFix" boolean NOT NULL DEFAULT (0), 
                "su" boolean NOT NULL DEFAULT (0), 
                "mo" boolean NOT NULL DEFAULT (0), 
                "tu" boolean NOT NULL DEFAULT (0), 
                "we" boolean NOT NULL DEFAULT (0), 
                "th" boolean NOT NULL DEFAULT (0), 
                "fr" boolean NOT NULL DEFAULT (0), 
                "sa" boolean NOT NULL DEFAULT (0), 
                "title" text, 
                "isImportant" boolean NOT NULL DEFAULT (0), 
                "isUrgent" boolean NOT NULL DEFAULT (0), 
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "updateAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "deletedAt" datetime, 
                "beginDate" varchar(10) NOT NULL, 
                "endDate" varchar(10)
            )`);
        await queryRunner.query(
            `INSERT INTO "temporary_regularTasks"(
                "id", "time", "period", "periodSize", "useLastDayFix", 
                "su", "mo", "tu", "we", "th", "fr", "sa", 
                "title", "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt", 
                "beginDate", "endDate"
            ) 
            SELECT 
                "id", "time", "period", "periodSize", "useLastDayFix", 
                "su", "mo", "tu", "we", "th", "fr", "sa", "title", 
                "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt", 
                "regularTasks"."from" as "beginDate",
                "regularTasks"."to" as "endDate" 
            FROM "regularTasks"`
        );
        await queryRunner.query(`DROP TABLE "regularTasks"`);
        await queryRunner.query(`ALTER TABLE "temporary_regularTasks" RENAME TO "regularTasks"`);

        await queryRunner.query(
            `CREATE TABLE "temporary_tasks" (
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
            )`);
        await queryRunner.query(
            `INSERT INTO "temporary_tasks"(
                "id", "time", "date", "title", "status", "isImportant", "isUrgent",
                 "createdAt", "updateAt", "deletedAt"
            ) 
            SELECT 
                "id", "time", "date", "title", "status", "isImportant", "isUrgent", 
                "createdAt", "updateAt", "deletedAt" 
            FROM "tasks"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`ALTER TABLE "temporary_tasks" RENAME TO "tasks"`);
    }



    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" RENAME TO "temporary_tasks"`);
        await queryRunner.query(
            `CREATE TABLE "tasks" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "time" text, 
                "date" text, 
                "title" text, 
                "status" text NOT NULL, 
                "isImportant" boolean NOT NULL DEFAULT (0), 
                "isUrgent" boolean NOT NULL DEFAULT (0), 
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "updateAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "deletedAt" datetime
            )`);
        await queryRunner.query(
            `INSERT INTO "tasks"(
                "id", "time", 
                "date", 
                "title", "status", "isImportant", "isUrgent", 
                "createdAt", "updateAt", "deletedAt"
            ) 
            SELECT 
                "id", "time", 
                 "date", 
                "title", "status", "isImportant", "isUrgent", 
                "createdAt", "updateAt", "deletedAt" 
            FROM "temporary_tasks"`
        );
        await queryRunner.query(`DROP TABLE "temporary_tasks"`);

        await queryRunner.query(`ALTER TABLE "regularTasks" RENAME TO "temporary_regularTasks"`);
        await queryRunner.query(
            `CREATE TABLE "regularTasks" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "time" text, 
                "period" varchar(50) NOT NULL DEFAULT ('everyDay'), 
                "periodSize" integer NOT NULL DEFAULT (1), 
                "useLastDayFix" boolean NOT NULL DEFAULT (0), 
                "su" boolean NOT NULL DEFAULT (0), 
                "mo" boolean NOT NULL DEFAULT (0), 
                "tu" boolean NOT NULL DEFAULT (0), 
                "we" boolean NOT NULL DEFAULT (0), 
                "th" boolean NOT NULL DEFAULT (0), 
                "fr" boolean NOT NULL DEFAULT (0), 
                "sa" boolean NOT NULL DEFAULT (0), 
                "title" text, 
                "isImportant" boolean NOT NULL DEFAULT (0), 
                "isUrgent" boolean NOT NULL DEFAULT (0), 
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "updateAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "deletedAt" datetime, 
                "beginDate" varchar(10) NOT NULL, 
                "endDate" varchar(10)
            )`);
        await queryRunner.query(
            `INSERT INTO "regularTasks"(
                "id", "time", "period", "periodSize", "useLastDayFix", 
                "su", "mo", "tu", "we", "th", "fr", "sa", 
                "title", "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt", "beginDate", "endDate"
            ) 
            SELECT 
                "id", "time", "period", "periodSize", "useLastDayFix", 
                "su", "mo", "tu", "we", "th", "fr", "sa", 
                "title", "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt", "beginDate", "endDate" 
            FROM "temporary_regularTasks"`
        );
        await queryRunner.query(`DROP TABLE "temporary_regularTasks"`);


        await queryRunner.query(`ALTER TABLE "regularTasks" RENAME TO "temporary_regularTasks"`);
        await queryRunner.query(
            `CREATE TABLE "regularTasks" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "time" text, 
                "from" date NOT NULL, 
                "to" date, 
                "period" varchar(50) NOT NULL DEFAULT ('everyDay'), 
                "periodSize" integer NOT NULL DEFAULT (1), 
                "useLastDayFix" boolean NOT NULL DEFAULT (0), 
                "su" boolean NOT NULL DEFAULT (0), 
                "mo" boolean NOT NULL DEFAULT (0), 
                "tu" boolean NOT NULL DEFAULT (0), 
                "we" boolean NOT NULL DEFAULT (0), 
                "th" boolean NOT NULL DEFAULT (0), 
                "fr" boolean NOT NULL DEFAULT (0), 
                "sa" boolean NOT NULL DEFAULT (0), 
                "title" text, 
                "isImportant" boolean NOT NULL DEFAULT (0), 
                "isUrgent" boolean NOT NULL DEFAULT (0), 
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "updateAt" datetime NOT NULL DEFAULT (datetime('now')), 
                "deletedAt" datetime
            )`
        );
        await queryRunner.query(
            `INSERT INTO "regularTasks"(
            "id", "time", 
            "from",
            "to",
            "period", "periodSize", "useLastDayFix", 
            "su", "mo", "tu", "we", "th", "fr", "sa", 
            "title", "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt"
            ) 
            SELECT 
                "id", "time", 
                temporary_regularTasks.beginDate as "from",
                temporary_regularTasks.endDate as "to",
                "period", "periodSize", "useLastDayFix",
                "su", "mo", "tu", "we", "th", "fr", "sa", 
                "title", "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt" 
            FROM "temporary_regularTasks"`
        );
        await queryRunner.query(`DROP TABLE "temporary_regularTasks"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class RegularTaskRemoveFieldUseLastDayFix1770038161469 implements MigrationInterface {
    name = 'RegularTaskRemoveFieldUseLastDayFix1770038161469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_regularTasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "time" varchar(5), "period" varchar(25) NOT NULL DEFAULT ('everyDay'), "periodSize" integer NOT NULL DEFAULT (1), "su" boolean NOT NULL DEFAULT (0), "mo" boolean NOT NULL DEFAULT (0), "tu" boolean NOT NULL DEFAULT (0), "we" boolean NOT NULL DEFAULT (0), "th" boolean NOT NULL DEFAULT (0), "fr" boolean NOT NULL DEFAULT (0), "sa" boolean NOT NULL DEFAULT (0), "title" text, "isImportant" boolean NOT NULL DEFAULT (0), "isUrgent" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updateAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "beginDate" varchar(10) NOT NULL, "endDate" varchar(10))`);
        await queryRunner.query(`INSERT INTO "temporary_regularTasks"("id", "time", "period", "periodSize", "su", "mo", "tu", "we", "th", "fr", "sa", "title", "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt", "beginDate", "endDate") SELECT "id", "time", "period", "periodSize", "su", "mo", "tu", "we", "th", "fr", "sa", "title", "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt", "beginDate", "endDate" FROM "regularTasks"`);
        await queryRunner.query(`DROP TABLE "regularTasks"`);
        await queryRunner.query(`ALTER TABLE "temporary_regularTasks" RENAME TO "regularTasks"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regularTasks" RENAME TO "temporary_regularTasks"`);
        await queryRunner.query(`CREATE TABLE "regularTasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "time" varchar(5), "period" varchar(25) NOT NULL DEFAULT ('everyDay'), "periodSize" integer NOT NULL DEFAULT (1), "useLastDayFix" boolean NOT NULL DEFAULT (0), "su" boolean NOT NULL DEFAULT (0), "mo" boolean NOT NULL DEFAULT (0), "tu" boolean NOT NULL DEFAULT (0), "we" boolean NOT NULL DEFAULT (0), "th" boolean NOT NULL DEFAULT (0), "fr" boolean NOT NULL DEFAULT (0), "sa" boolean NOT NULL DEFAULT (0), "title" text, "isImportant" boolean NOT NULL DEFAULT (0), "isUrgent" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updateAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "beginDate" varchar(10) NOT NULL, "endDate" varchar(10))`);
        await queryRunner.query(`INSERT INTO "regularTasks"("id", "time", "period", "periodSize", "su", "mo", "tu", "we", "th", "fr", "sa", "title", "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt", "beginDate", "endDate") SELECT "id", "time", "period", "periodSize", "su", "mo", "tu", "we", "th", "fr", "sa", "title", "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt", "beginDate", "endDate" FROM "temporary_regularTasks"`);
        await queryRunner.query(`DROP TABLE "temporary_regularTasks"`);
    }

}

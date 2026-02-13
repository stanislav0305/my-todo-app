import { MigrationInterface, QueryRunner } from "typeorm"

export class RegularTaskWeekTableCreate1770203616594 implements MigrationInterface {
    name = 'RegularTaskWeekTableCreate1770203616594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "regularTasksWeek" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
            "suRegularTaskId" integer, 
            "moRegularTaskId" integer, 
            "tuRegularTaskId" integer, 
            "weRegularTaskId" integer, 
            "thRegularTaskId" integer, 
            "frRegularTaskId" integer, 
            "saRegularTaskId" integer,
             CONSTRAINT "REL_f78fd11a468674bbca87851d45" UNIQUE ("suRegularTaskId"), 
             CONSTRAINT "REL_3d5822fa82e0478f8d1a0c5ed9" UNIQUE ("moRegularTaskId"), 
             CONSTRAINT "REL_c3b0081ac2bd442f8159f0b1d1" UNIQUE ("tuRegularTaskId"), 
             CONSTRAINT "REL_eff3867bddc6d0a95b4659ec92" UNIQUE ("weRegularTaskId"), 
             CONSTRAINT "REL_9f313737a7b5b8085d29fc7464" UNIQUE ("thRegularTaskId"), 
             CONSTRAINT "REL_ada607ba88e2b1d334259b2b66" UNIQUE ("frRegularTaskId"), 
             CONSTRAINT "REL_c476d15ae697fd888bc51fd844" UNIQUE ("saRegularTaskId")
        )`)

        await queryRunner.query(`CREATE TABLE "temporary_regularTasks" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
            "time" varchar(5), 
            "period" varchar(25) NOT NULL DEFAULT ('everyDay'), 
            "periodSize" integer NOT NULL DEFAULT (1), 
            "title" text, 
            "isImportant" boolean NOT NULL DEFAULT (0), 
            "isUrgent" boolean NOT NULL DEFAULT (0), 
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "updateAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "deletedAt" datetime, 
            "beginDate" varchar(10) NOT NULL, 
            "endDate" varchar(10)
        )`)

        await queryRunner.query(
            `INSERT INTO "temporary_regularTasks" 
                ("id", "time", "period", "periodSize", "title", "isImportant", "isUrgent", 
                "createdAt", "updateAt", "deletedAt", "beginDate", "endDate") 
            SELECT 
                "id", "time", "period", "periodSize", "title", "isImportant", "isUrgent", 
                "createdAt", "updateAt", "deletedAt", "beginDate", "endDate" 
            FROM "regularTasks"`)
        await queryRunner.query(`DROP TABLE "regularTasks"`)
        await queryRunner.query(`ALTER TABLE "temporary_regularTasks" RENAME TO "regularTasks"`)

        await queryRunner.query(
            `CREATE TABLE "temporary_regularTasks" 
        (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
            "time" varchar(5), 
            "period" varchar(25) NOT NULL DEFAULT ('everyDay'), 
            "periodSize" integer NOT NULL DEFAULT (1), 
            "title" text, 
            "isImportant" boolean NOT NULL DEFAULT (0), 
            "isUrgent" boolean NOT NULL DEFAULT (0), 
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "updateAt" datetime NOT NULL DEFAULT (datetime('now')), 
            "deletedAt" datetime, 
            "beginDate" varchar(10) NOT NULL, 
            "endDate" varchar(10), 
            "periodParam" varchar(25) NOT NULL DEFAULT ('+1 day')
        )`)
        await queryRunner.query(
            `INSERT INTO "temporary_regularTasks"
                ("id", "time", "period", "periodSize", "title", "isImportant", "isUrgent", 
                "createdAt", "updateAt", "deletedAt", 
                "beginDate", "endDate") 
            SELECT 
                "id", "time", "period", "periodSize", "title", "isImportant", "isUrgent", 
                "createdAt", "updateAt", "deletedAt", 
                "beginDate", "endDate" 
            FROM "regularTasks"
        `)
        await queryRunner.query(`DROP TABLE "regularTasks"`)
        await queryRunner.query(`ALTER TABLE "temporary_regularTasks" RENAME TO "regularTasks"`)

        await queryRunner.query(`CREATE TABLE "temporary_regularTasksWeek"(
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "suRegularTaskId" integer, "moRegularTaskId" integer, 
             "tuRegularTaskId" integer, "weRegularTaskId" integer, "thRegularTaskId" integer, 
             "frRegularTaskId" integer, "saRegularTaskId" integer, 
             CONSTRAINT "REL_f78fd11a468674bbca87851d45" UNIQUE ("suRegularTaskId"), 
             CONSTRAINT "REL_3d5822fa82e0478f8d1a0c5ed9" UNIQUE ("moRegularTaskId"), 
             CONSTRAINT "REL_c3b0081ac2bd442f8159f0b1d1" UNIQUE ("tuRegularTaskId"), 
             CONSTRAINT "REL_eff3867bddc6d0a95b4659ec92" UNIQUE ("weRegularTaskId"), 
             CONSTRAINT "REL_9f313737a7b5b8085d29fc7464" UNIQUE ("thRegularTaskId"), 
             CONSTRAINT "REL_ada607ba88e2b1d334259b2b66" UNIQUE ("frRegularTaskId"), 
             CONSTRAINT "REL_c476d15ae697fd888bc51fd844" UNIQUE ("saRegularTaskId"), 
             CONSTRAINT "FK_f78fd11a468674bbca87851d45c" FOREIGN KEY ("suRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
             CONSTRAINT "FK_3d5822fa82e0478f8d1a0c5ed93" FOREIGN KEY ("moRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
             CONSTRAINT "FK_c3b0081ac2bd442f8159f0b1d11" FOREIGN KEY ("tuRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
             CONSTRAINT "FK_eff3867bddc6d0a95b4659ec92e" FOREIGN KEY ("weRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
             CONSTRAINT "FK_9f313737a7b5b8085d29fc74644" FOREIGN KEY ("thRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
             CONSTRAINT "FK_ada607ba88e2b1d334259b2b66d" FOREIGN KEY ("frRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, 
             CONSTRAINT "FK_c476d15ae697fd888bc51fd8448" FOREIGN KEY ("saRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)
        `)
        await queryRunner.query(
            `INSERT INTO "temporary_regularTasksWeek"
                ("id", "suRegularTaskId", 
                "moRegularTaskId", "tuRegularTaskId", "weRegularTaskId", 
                "thRegularTaskId", "frRegularTaskId", "saRegularTaskId") 
            SELECT 
            "id", 
                "suRegularTaskId", "moRegularTaskId", "tuRegularTaskId", "weRegularTaskId", 
                "thRegularTaskId", "frRegularTaskId", "saRegularTaskId" 
            FROM "regularTasksWeek"
        `)
        await queryRunner.query(`DROP TABLE "regularTasksWeek"`)
        await queryRunner.query(`ALTER TABLE "temporary_regularTasksWeek" RENAME TO "regularTasksWeek"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regularTasksWeek" RENAME TO "temporary_regularTasksWeek"`)
        await queryRunner.query(`CREATE TABLE "regularTasksWeek" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "suRegularTaskId" integer, "moRegularTaskId" integer, "tuRegularTaskId" integer, "weRegularTaskId" integer, "thRegularTaskId" integer, "frRegularTaskId" integer, "saRegularTaskId" integer, CONSTRAINT "REL_f78fd11a468674bbca87851d45" UNIQUE ("suRegularTaskId"), CONSTRAINT "REL_3d5822fa82e0478f8d1a0c5ed9" UNIQUE ("moRegularTaskId"), CONSTRAINT "REL_c3b0081ac2bd442f8159f0b1d1" UNIQUE ("tuRegularTaskId"), CONSTRAINT "REL_eff3867bddc6d0a95b4659ec92" UNIQUE ("weRegularTaskId"), CONSTRAINT "REL_9f313737a7b5b8085d29fc7464" UNIQUE ("thRegularTaskId"), CONSTRAINT "REL_ada607ba88e2b1d334259b2b66" UNIQUE ("frRegularTaskId"), CONSTRAINT "REL_c476d15ae697fd888bc51fd844" UNIQUE ("saRegularTaskId"))`)
        await queryRunner.query(`INSERT INTO "regularTasksWeek"("id", "suRegularTaskId", "moRegularTaskId", "tuRegularTaskId", "weRegularTaskId", "thRegularTaskId", "frRegularTaskId", "saRegularTaskId") SELECT "id", "suRegularTaskId", "moRegularTaskId", "tuRegularTaskId", "weRegularTaskId", "thRegularTaskId", "frRegularTaskId", "saRegularTaskId" FROM "temporary_regularTasksWeek"`)
        await queryRunner.query(`DROP TABLE "temporary_regularTasksWeek"`)
        await queryRunner.query(`ALTER TABLE "regularTasks" RENAME TO "temporary_regularTasks"`)
        await queryRunner.query(`CREATE TABLE "regularTasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "time" varchar(5), "period" varchar(25) NOT NULL DEFAULT ('everyDay'), "periodSize" integer NOT NULL DEFAULT (1), "title" text, "isImportant" boolean NOT NULL DEFAULT (0), "isUrgent" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updateAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "beginDate" varchar(10) NOT NULL, "endDate" varchar(10))`)
        await queryRunner.query(`INSERT INTO "regularTasks"("id", "time", "period", "periodSize", "title", "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt", "beginDate", "endDate") SELECT "id", "time", "period", "periodSize", "title", "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt", "beginDate", "endDate" FROM "temporary_regularTasks"`)
        await queryRunner.query(`DROP TABLE "temporary_regularTasks"`)
        await queryRunner.query(`ALTER TABLE "regularTasks" RENAME TO "temporary_regularTasks"`)
        await queryRunner.query(`CREATE TABLE "regularTasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "time" varchar(5), "period" varchar(25) NOT NULL DEFAULT ('everyDay'), "periodSize" integer NOT NULL DEFAULT (1), "su" boolean NOT NULL DEFAULT (0), "mo" boolean NOT NULL DEFAULT (0), "tu" boolean NOT NULL DEFAULT (0), "we" boolean NOT NULL DEFAULT (0), "th" boolean NOT NULL DEFAULT (0), "fr" boolean NOT NULL DEFAULT (0), "sa" boolean NOT NULL DEFAULT (0), "title" text, "isImportant" boolean NOT NULL DEFAULT (0), "isUrgent" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updateAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "beginDate" varchar(10) NOT NULL, "endDate" varchar(10))`)
        await queryRunner.query(`INSERT INTO "regularTasks"("id", "time", "period", "periodSize", "title", "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt", "beginDate", "endDate") SELECT "id", "time", "period", "periodSize", "title", "isImportant", "isUrgent", "createdAt", "updateAt", "deletedAt", "beginDate", "endDate" FROM "temporary_regularTasks"`)
        await queryRunner.query(`DROP TABLE "temporary_regularTasks"`)
        await queryRunner.query(`DROP TABLE "regularTasksWeek"`)
    }

}

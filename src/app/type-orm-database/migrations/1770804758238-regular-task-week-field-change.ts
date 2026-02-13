import { MigrationInterface, QueryRunner } from "typeorm"

export class RegularTaskWeekFieldChange1770804758238 implements MigrationInterface {
    name = 'RegularTaskWeekFieldChange1770804758238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE
        "temporary_regularTasksWeek" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
            "suRegularTaskId" integer,
            "moRegularTaskId" integer,
            "tuRegularTaskId" integer,
            "weRegularTaskId" integer,
            "thRegularTaskId" integer,
            "frRegularTaskId" integer,
            "saRegularTaskId" integer,
            "createdAt" DATETIME NOT NULL DEFAULT (DATETIME('now')),
            "updateAt" DATETIME NOT NULL DEFAULT (DATETIME('now')),
            "deletedAt" DATETIME,
            CONSTRAINT "REL_c476d15ae697fd888bc51fd844" UNIQUE ("saRegularTaskId"),
            CONSTRAINT "REL_ada607ba88e2b1d334259b2b66" UNIQUE ("frRegularTaskId"),
            CONSTRAINT "REL_9f313737a7b5b8085d29fc7464" UNIQUE ("thRegularTaskId"),
            CONSTRAINT "REL_eff3867bddc6d0a95b4659ec92" UNIQUE ("weRegularTaskId"),
            CONSTRAINT "REL_c3b0081ac2bd442f8159f0b1d1" UNIQUE ("tuRegularTaskId"),
            CONSTRAINT "REL_3d5822fa82e0478f8d1a0c5ed9" UNIQUE ("moRegularTaskId"),
            CONSTRAINT "REL_f78fd11a468674bbca87851d45" UNIQUE ("suRegularTaskId")
        )`)
        await queryRunner.query(
            `INSERT INTO
        "temporary_regularTasksWeek" (
            "id",
            "suRegularTaskId",
            "moRegularTaskId",
            "tuRegularTaskId",
            "weRegularTaskId",
            "thRegularTaskId",
            "frRegularTaskId",
            "saRegularTaskId",
            "createdAt",
            "updateAt",
            "deletedAt"
        )
        SELECT
        "id",
        "suRegularTaskId",
        "moRegularTaskId",
        "tuRegularTaskId",
        "weRegularTaskId",
        "thRegularTaskId",
        "frRegularTaskId",
        "saRegularTaskId",
        "createdAt",
        "updateAt",
        "deletedAt"
        FROM
        "regularTasksWeek"`)
        await queryRunner.query(`DROP TABLE "regularTasksWeek"`)
        await queryRunner.query(`ALTER TABLE "temporary_regularTasksWeek" RENAME TO "regularTasksWeek"`)

        await queryRunner.query(
            `CREATE TABLE
        "temporary_regularTasksWeek" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
            "suRegularTaskId" integer NOT NULL,
            "moRegularTaskId" integer NOT NULL,
            "tuRegularTaskId" integer NOT NULL,
            "weRegularTaskId" integer NOT NULL,
            "thRegularTaskId" integer NOT NULL,
            "frRegularTaskId" integer NOT NULL,
            "saRegularTaskId" integer NOT NULL,
            "createdAt" DATETIME NOT NULL DEFAULT (DATETIME('now')),
            "updateAt" DATETIME NOT NULL DEFAULT (DATETIME('now')),
            "deletedAt" DATETIME,
            CONSTRAINT "REL_c476d15ae697fd888bc51fd844" UNIQUE ("saRegularTaskId"),
            CONSTRAINT "REL_ada607ba88e2b1d334259b2b66" UNIQUE ("frRegularTaskId"),
            CONSTRAINT "REL_9f313737a7b5b8085d29fc7464" UNIQUE ("thRegularTaskId"),
            CONSTRAINT "REL_eff3867bddc6d0a95b4659ec92" UNIQUE ("weRegularTaskId"),
            CONSTRAINT "REL_c3b0081ac2bd442f8159f0b1d1" UNIQUE ("tuRegularTaskId"),
            CONSTRAINT "REL_3d5822fa82e0478f8d1a0c5ed9" UNIQUE ("moRegularTaskId"),
            CONSTRAINT "REL_f78fd11a468674bbca87851d45" UNIQUE ("suRegularTaskId")
        )`)
        await queryRunner.query(
            `INSERT INTO
        "temporary_regularTasksWeek" (
            "id",
            "suRegularTaskId",
            "moRegularTaskId",
            "tuRegularTaskId",
            "weRegularTaskId",
            "thRegularTaskId",
            "frRegularTaskId",
            "saRegularTaskId",
            "createdAt",
            "updateAt",
            "deletedAt"
        )
        SELECT
        "id",
        "suRegularTaskId",
        "moRegularTaskId",
        "tuRegularTaskId",
        "weRegularTaskId",
        "thRegularTaskId",
        "frRegularTaskId",
        "saRegularTaskId",
        "createdAt",
        "updateAt",
        "deletedAt"
        FROM
        "regularTasksWeek"`)
        await queryRunner.query(`DROP TABLE "regularTasksWeek"`)
        await queryRunner.query(`ALTER TABLE "temporary_regularTasksWeek" RENAME TO "regularTasksWeek"`)

        await queryRunner.query(
            `CREATE TABLE
        "temporary_regularTasksWeek" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
            "suRegularTaskId" integer NOT NULL,
            "moRegularTaskId" integer NOT NULL,
            "tuRegularTaskId" integer NOT NULL,
            "weRegularTaskId" integer NOT NULL,
            "thRegularTaskId" integer NOT NULL,
            "frRegularTaskId" integer NOT NULL,
            "saRegularTaskId" integer NOT NULL,
            "createdAt" DATETIME NOT NULL DEFAULT (DATETIME('now')),
            "updateAt" DATETIME NOT NULL DEFAULT (DATETIME('now')),
            "deletedAt" DATETIME,
            CONSTRAINT "REL_c476d15ae697fd888bc51fd844" UNIQUE ("saRegularTaskId"),
            CONSTRAINT "REL_ada607ba88e2b1d334259b2b66" UNIQUE ("frRegularTaskId"),
            CONSTRAINT "REL_9f313737a7b5b8085d29fc7464" UNIQUE ("thRegularTaskId"),
            CONSTRAINT "REL_eff3867bddc6d0a95b4659ec92" UNIQUE ("weRegularTaskId"),
            CONSTRAINT "REL_c3b0081ac2bd442f8159f0b1d1" UNIQUE ("tuRegularTaskId"),
            CONSTRAINT "REL_3d5822fa82e0478f8d1a0c5ed9" UNIQUE ("moRegularTaskId"),
            CONSTRAINT "REL_f78fd11a468674bbca87851d45" UNIQUE ("suRegularTaskId"),
            CONSTRAINT "FK_f78fd11a468674bbca87851d45c" FOREIGN KEY ("suRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_3d5822fa82e0478f8d1a0c5ed93" FOREIGN KEY ("moRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_c3b0081ac2bd442f8159f0b1d11" FOREIGN KEY ("tuRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_eff3867bddc6d0a95b4659ec92e" FOREIGN KEY ("weRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_9f313737a7b5b8085d29fc74644" FOREIGN KEY ("thRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_ada607ba88e2b1d334259b2b66d" FOREIGN KEY ("frRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_c476d15ae697fd888bc51fd8448" FOREIGN KEY ("saRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_week_su_regularTask" FOREIGN KEY ("suRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_week_mo_regularTask" FOREIGN KEY ("moRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_week_tu_regularTask" FOREIGN KEY ("tuRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_week_we_regularTask" FOREIGN KEY ("weRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_week_th_regularTask" FOREIGN KEY ("thRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_week_fr_regularTask" FOREIGN KEY ("frRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_week_sa_regularTask" FOREIGN KEY ("saRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`)
        await queryRunner.query(
            `INSERT INTO
        "temporary_regularTasksWeek" (
            "id",
            "suRegularTaskId",
            "moRegularTaskId",
            "tuRegularTaskId",
            "weRegularTaskId",
            "thRegularTaskId",
            "frRegularTaskId",
            "saRegularTaskId",
            "createdAt",
            "updateAt",
            "deletedAt"
        )
        SELECT
        "id",
        "suRegularTaskId",
        "moRegularTaskId",
        "tuRegularTaskId",
        "weRegularTaskId",
        "thRegularTaskId",
        "frRegularTaskId",
        "saRegularTaskId",
        "createdAt",
        "updateAt",
        "deletedAt"
        FROM
        "regularTasksWeek"`)
        await queryRunner.query(`DROP TABLE "regularTasksWeek"`)
        await queryRunner.query(`ALTER TABLE "temporary_regularTasksWeek" RENAME TO "regularTasksWeek"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regularTasksWeek" RENAME TO "temporary_regularTasksWeek"`)
        await queryRunner.query(`CREATE TABLE "regularTasksWeek" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "suRegularTaskId" integer NOT NULL, "moRegularTaskId" integer NOT NULL, "tuRegularTaskId" integer NOT NULL, "weRegularTaskId" integer NOT NULL, "thRegularTaskId" integer NOT NULL, "frRegularTaskId" integer NOT NULL, "saRegularTaskId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updateAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, CONSTRAINT "REL_c476d15ae697fd888bc51fd844" UNIQUE ("saRegularTaskId"), CONSTRAINT "REL_ada607ba88e2b1d334259b2b66" UNIQUE ("frRegularTaskId"), CONSTRAINT "REL_9f313737a7b5b8085d29fc7464" UNIQUE ("thRegularTaskId"), CONSTRAINT "REL_eff3867bddc6d0a95b4659ec92" UNIQUE ("weRegularTaskId"), CONSTRAINT "REL_c3b0081ac2bd442f8159f0b1d1" UNIQUE ("tuRegularTaskId"), CONSTRAINT "REL_3d5822fa82e0478f8d1a0c5ed9" UNIQUE ("moRegularTaskId"), CONSTRAINT "REL_f78fd11a468674bbca87851d45" UNIQUE ("suRegularTaskId"))`)
        await queryRunner.query(`INSERT INTO "regularTasksWeek"("id", "suRegularTaskId", "moRegularTaskId", "tuRegularTaskId", "weRegularTaskId", "thRegularTaskId", "frRegularTaskId", "saRegularTaskId", "createdAt", "updateAt", "deletedAt") SELECT "id", "suRegularTaskId", "moRegularTaskId", "tuRegularTaskId", "weRegularTaskId", "thRegularTaskId", "frRegularTaskId", "saRegularTaskId", "createdAt", "updateAt", "deletedAt" FROM "temporary_regularTasksWeek"`)
        await queryRunner.query(`DROP TABLE "temporary_regularTasksWeek"`)
        await queryRunner.query(`ALTER TABLE "regularTasksWeek" RENAME TO "temporary_regularTasksWeek"`)
        await queryRunner.query(`CREATE TABLE "regularTasksWeek" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "suRegularTaskId" integer, "moRegularTaskId" integer, "tuRegularTaskId" integer, "weRegularTaskId" integer, "thRegularTaskId" integer, "frRegularTaskId" integer, "saRegularTaskId" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updateAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, CONSTRAINT "REL_c476d15ae697fd888bc51fd844" UNIQUE ("saRegularTaskId"), CONSTRAINT "REL_ada607ba88e2b1d334259b2b66" UNIQUE ("frRegularTaskId"), CONSTRAINT "REL_9f313737a7b5b8085d29fc7464" UNIQUE ("thRegularTaskId"), CONSTRAINT "REL_eff3867bddc6d0a95b4659ec92" UNIQUE ("weRegularTaskId"), CONSTRAINT "REL_c3b0081ac2bd442f8159f0b1d1" UNIQUE ("tuRegularTaskId"), CONSTRAINT "REL_3d5822fa82e0478f8d1a0c5ed9" UNIQUE ("moRegularTaskId"), CONSTRAINT "REL_f78fd11a468674bbca87851d45" UNIQUE ("suRegularTaskId"))`)
        await queryRunner.query(`INSERT INTO "regularTasksWeek"("id", "suRegularTaskId", "moRegularTaskId", "tuRegularTaskId", "weRegularTaskId", "thRegularTaskId", "frRegularTaskId", "saRegularTaskId", "createdAt", "updateAt", "deletedAt") SELECT "id", "suRegularTaskId", "moRegularTaskId", "tuRegularTaskId", "weRegularTaskId", "thRegularTaskId", "frRegularTaskId", "saRegularTaskId", "createdAt", "updateAt", "deletedAt" FROM "temporary_regularTasksWeek"`)
        await queryRunner.query(`DROP TABLE "temporary_regularTasksWeek"`)
        await queryRunner.query(`ALTER TABLE "regularTasksWeek" RENAME TO "temporary_regularTasksWeek"`)
        await queryRunner.query(`CREATE TABLE "regularTasksWeek" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "suRegularTaskId" integer, "moRegularTaskId" integer, "tuRegularTaskId" integer, "weRegularTaskId" integer, "thRegularTaskId" integer, "frRegularTaskId" integer, "saRegularTaskId" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updateAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, CONSTRAINT "REL_c476d15ae697fd888bc51fd844" UNIQUE ("saRegularTaskId"), CONSTRAINT "REL_ada607ba88e2b1d334259b2b66" UNIQUE ("frRegularTaskId"), CONSTRAINT "REL_9f313737a7b5b8085d29fc7464" UNIQUE ("thRegularTaskId"), CONSTRAINT "REL_eff3867bddc6d0a95b4659ec92" UNIQUE ("weRegularTaskId"), CONSTRAINT "REL_c3b0081ac2bd442f8159f0b1d1" UNIQUE ("tuRegularTaskId"), CONSTRAINT "REL_3d5822fa82e0478f8d1a0c5ed9" UNIQUE ("moRegularTaskId"), CONSTRAINT "REL_f78fd11a468674bbca87851d45" UNIQUE ("suRegularTaskId"), CONSTRAINT "FK_f78fd11a468674bbca87851d45c" FOREIGN KEY ("suRegularTaskId") REFERENCES "regularTasks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`)
        await queryRunner.query(`INSERT INTO "regularTasksWeek"("id", "suRegularTaskId", "moRegularTaskId", "tuRegularTaskId", "weRegularTaskId", "thRegularTaskId", "frRegularTaskId", "saRegularTaskId", "createdAt", "updateAt", "deletedAt") SELECT "id", "suRegularTaskId", "moRegularTaskId", "tuRegularTaskId", "weRegularTaskId", "thRegularTaskId", "frRegularTaskId", "saRegularTaskId", "createdAt", "updateAt", "deletedAt" FROM "temporary_regularTasksWeek"`)
        await queryRunner.query(`DROP TABLE "temporary_regularTasksWeek"`)
    }

}

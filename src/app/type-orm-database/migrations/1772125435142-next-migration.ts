import { MigrationInterface, QueryRunner } from "typeorm"

export class NextMigration1772125435142 implements MigrationInterface {
    name = 'NextMigration1772125435142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        //auto-generation mistake 
        /*  await queryRunner.query(
              `CREATE TABLE "temporary_regularTasks" (
              "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
              "time" VARCHAR(5),
              "beginDate" VARCHAR(10) NOT NULL,
              "endDate" VARCHAR(10),
              "period" VARCHAR(25) NOT NULL DEFAULT ('everyDay'),
              "periodParam" VARCHAR(25) NOT NULL DEFAULT ('+1 day'),
              "periodSize" INTEGER NOT NULL DEFAULT (1),
              "title" TEXT,
              "isImportant" BOOLEAN NOT NULL DEFAULT (0),
              "isUrgent" BOOLEAN NOT NULL DEFAULT (0),
              "weekDay" INTEGER,
              "weekId" INTEGER,
              "createdAt" datetime NOT NULL DEFAULT (datetime ('now')),
              "updateAt" datetime NOT NULL DEFAULT (datetime ('now')),
              "deletedAt" datetime
          )`)
          await queryRunner.query(
              `INSERT INTO "temporary_regularTasks" (
                  "id",
                  "time",
                  "beginDate",
                  "endDate",
                  "period",
                  "periodParam",
                  "periodSize",
                  "title",
                  "isImportant",
                  "isUrgent",
                  "weekDay",
                  "weekId",
                  "createdAt",
                  "updateAt",
                  "deletedAt"
              )
              SELECT
                  "id",
                  "time",
                  "beginDate",
                  "endDate",
                  "period",
                  "periodParam",
                  "periodSize",
                  "title",
                  "isImportant",
                  "isUrgent",
                  "weekDay",
                  "weekId",
                  "createdAt",
                  "updateAt",
                  "deletedAt"
              FROM
                  "regularTasks"`)
          await queryRunner.query(`DROP TABLE "regularTasks"`)
          await queryRunner.query(`ALTER TABLE "temporary_regularTasks" RENAME TO "regularTasks"`)
          */
        await queryRunner.query(
            `CREATE TABLE "actualTasksPaging" (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            "dateFrom" VARCHAR(10) NOT NULL DEFAULT ('2026-02-18'),
            "dateTo" VARCHAR(10) NOT NULL DEFAULT ('2026-02-18'),
            "period" VARCHAR(25) NOT NULL DEFAULT ('byDay')
        )`)
        await queryRunner.query(
            `CREATE TABLE "regularTasksResults" (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            "regularTaskId" INTEGER,
            "time" VARCHAR(5),
            "date" VARCHAR(10),
            "title" TEXT,
            "status" TEXT NOT NULL,
            "isImportant" BOOLEAN NOT NULL DEFAULT (0),
            "isUrgent" BOOLEAN NOT NULL DEFAULT (0),
            "createdAt" datetime NOT NULL DEFAULT (datetime ('now')),
            "updateAt" datetime NOT NULL DEFAULT (datetime ('now')),
            "deletedAt" datetime
        )`)
        //auto-generation mistake 
        /*
        await queryRunner.query(
            `CREATE TABLE "temporary_regularTasks" (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            "time" VARCHAR(5),
            "beginDate" VARCHAR(10) NOT NULL,
            "endDate" VARCHAR(10),
            "period" VARCHAR(25) NOT NULL DEFAULT ('everyDay'),
            "periodParam" VARCHAR(25) NOT NULL DEFAULT ('+1 day'),
            "periodSize" INTEGER NOT NULL DEFAULT (1),
            "title" TEXT,
            "isImportant" BOOLEAN NOT NULL DEFAULT (0),
            "isUrgent" BOOLEAN NOT NULL DEFAULT (0),
            "weekDay" INTEGER,
            "weekId" INTEGER,
            "createdAt" datetime NOT NULL DEFAULT (datetime ('now')),
            "updateAt" datetime NOT NULL DEFAULT (datetime ('now')),
            "deletedAt" datetime,
            CONSTRAINT "FK_c2e7e909d97d03ccee93c1905e2" FOREIGN KEY ("weekId") REFERENCES "regularTasksWeek" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_week_id" FOREIGN KEY ("weekId") REFERENCES "regularTasksWeek" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`)
        await queryRunner.query(
            `INSERT INTO "temporary_regularTasks" (
            "id",
            "time",
            "beginDate",
            "endDate",
            "period",
            "periodParam",
            "periodSize",
            "title",
            "isImportant",
            "isUrgent",
            "weekDay",
            "weekId",
            "createdAt",
            "updateAt",
            "deletedAt"
        )
        SELECT
            "id",
            "time",
            "beginDate",
            "endDate",
            "period",
            "periodParam",
            "periodSize",
            "title",
            "isImportant",
            "isUrgent",
            "weekDay",
            "weekId",
            "createdAt",
            "updateAt",
            "deletedAt"
        FROM
            "regularTasks"`)
        await queryRunner.query(`DROP TABLE "regularTasks"`)
        await queryRunner.query(`ALTER TABLE "temporary_regularTasks" RENAME TO "regularTasks"`)
        */
        await queryRunner.query(
            `INSERT INTO "actualTasksPaging" 
            ("dateFrom", "dateTo", "period")
         VALUES 
            (DATE('now'), DATE('now'), 'byDay')`)

        await queryRunner.query(
            `CREATE VIEW "actualTasksView" AS 
            WITH RECURSIVE dates (
                id,
                isFirstGen,

                time,
                date,

                title,

                regularTaskId,
                taskId,
                regularTasksResultId,

                weekId,
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

                    rt.weekId,
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

                    d.weekId,
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

                d.weekId,
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

                NULL AS weekId,
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
        `)

        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (NULL, NULL, NULL, ?, ?, ?)`, ["VIEW", "actualTasksView", "WITH RECURSIVE dates (\n    id,\n    isFirstGen,\n\n    time,\n    date,\n\n    title,\n\n    regularTaskId,\n    taskId,\n    regularTasksResultId,\n\n    weekId,\n    weekDay,\n    periodParam, \n    period, \n    periodSize,\n\n    isImportant, \n    isUrgent, \n    \n    createdAt, \n    updateAt, \n    deletedAt, \n    \n    beginDate, \n    endDate,\n\n    status,\n\n    pagingDateFrom, \n    pagingDateTo\n) \nAS (\n    SELECT\n        IFNULL(rt.id, 0) || '-' || 0 || '-' || IFNULL(rtr.id, 0) || '-' || rt.beginDate AS id,\n        'true ' || rt.period AS isFirstGen,\n\n        rt.time,\n        rt.beginDate AS date,\n\n        rt.title,\n\n        rt.id AS regularTaskId, \n        NULL AS taskId,\n        rtr.id AS regularTasksResultId,\n\n        rt.weekId,\n        rt.weekDay,\n        rt.periodParam,\n        rt.period, \n        rt.periodSize,\n\n        rt.isImportant, \n        rt.isUrgent, \n        \n        rt.createdAt, \n        rt.updateAt, \n        rt.deletedAt,\n\n        rt.beginDate, \n        rt.endDate,\n\n        NULL AS status,\n\n        atp.dateFrom AS pagingDateFrom, \n        atp.dateTo AS pagingDateTo\n    FROM regularTasks AS rt\n    JOIN actualTasksPaging atp\n    LEFT JOIN regularTasksResults rtr ON rt.id = rtr.regularTaskId AND rt.beginDate = rtr.date\n    WHERE \n        rt.deletedAt IS NULL\n        AND\n        (\n            -- if rt.beginDate in from atp.dateFrom to  atp.dateTo \n            (atp.dateFrom <= rt.beginDate AND atp.dateTo >= rt.beginDate)\n            -- if rt.endDate is null or in from atp.dateFrom to  atp.dateTo \n            OR (rt.endDate IS NULL OR (atp.dateFrom <= rt.endDate AND atp.dateTo >= rt.endDate))\n            -- if atp.dateFrom in from rt.beginDate to rt.endDate\n            OR (rt.beginDate <= atp.dateFrom AND rt.beginDate >= atp.dateTo)\n            -- if atp.dateTo is null or in from atp.dateFrom to atp.dateTo \n            OR (rt.endDate IS NULL OR (rt.endDate <= atp.dateFrom AND rt.endDate >= atp.dateTo))\n        )\n    UNION ALL\n    SELECT\n        IFNULL(d.regularTaskId, 0) || '-' || IFNULL(d.taskId, 0) || '-' || IFNULL(rtr.id, 0) || '-' \n            || date(d.date, d.periodParam) AS id,\n        'false ' || d.period AS isFirstGen,\n\n        d.time,\n        date(d.date, d.periodParam) AS date,\n\n        d.title,\n\n        d.regularTaskId, \n        d.taskId,\n        rtr.id AS regularTasksResultId,\n\n        d.weekId,\n        d.weekDay,\n        d.periodParam,\n        d.period, \n        d.periodSize,\n\n        d.isImportant, \n        d.isUrgent, \n        \n        d.createdAt, \n        d.updateAt, \n        d.deletedAt, \n        \n        d.beginDate, \n        d.endDate,\n\n        rtr.status,\n\n        d.pagingDateFrom, \n        d.pagingDateTo\n    FROM dates d\n    LEFT JOIN regularTasksResults rtr ON d.regularTaskId = rtr.regularTaskId AND d.date = rtr.date\n    WHERE\n        date(d.date, d.periodParam) >= d.beginDate\n        AND (d.endDate IS NULL OR date(d.date, d.periodParam) <= d.endDate)\n        AND date(d.date, d.periodParam) <= d.pagingDateTo\n)\n\nSELECT \n\td.id,\n    d.isFirstGen,\n\n    d.time, \n    d.date,\n\n    d.title,\n\n    d.regularTaskId, \n    d.taskId,\n    d.regularTasksResultId,\n\n    d.weekId,\n    d.weekDay,\n    d.periodParam,\n    d.period, \n    d.periodSize,\n\n    d.isImportant, \n    d.isUrgent,\n\n    d.createdAt, \n    d.updateAt, \n    d.deletedAt,\n\n    d.beginDate, \n    d.endDate,\n\n    d.status, \n\n    d.pagingDateFrom, \n    d.pagingDateTo\nFROM dates d\nJOIN actualTasksPaging atp\nWHERE \n    d.deletedAt IS NULL\n    AND d.date >= atp.dateFrom\n    AND d.date <= atp.dateTo\nUNION \nSELECT\n    0 || '-' || t.id || '-' || 0 || '-' || t.date AS id,\n    'false task' AS isFirstGen,\n\n    t.time, \n    t.date,\n\n    t.title,\n\n    NULL AS regularTaskId, \n    t.id AS taskId,\n    NULL AS regularTasksResultId,\n\n    NULL AS weekId,\n    NULL AS weekDay,\n    NULL AS periodParam,\n    NULL AS period, \n    NULL AS periodSize,\n\n    t.isImportant, \n    t.isUrgent,\n\n    t.createdAt, \n    t.updateAt, \n    t.deletedAt,\n\n    NULL AS beginDate, \n    NULL AS endDate,\n\n    t.status, \n\n    atp.dateFrom AS pagingDateFrom, \n    atp.dateTo AS pagingDateTo\nFROM tasks t\nJOIN actualTasksPaging atp\nWHERE \n    t.deletedAt IS NULL\n    AND t.date >= atp.dateFrom\n    AND t.date <= atp.dateTo\nORDER BY date, time, period, taskId, regularTaskId"])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = ? AND "name" = ?`, ["VIEW", "actualTasksView"])
        await queryRunner.query(`DROP VIEW "actualTasksView"`)
        //auto-generation mistake 
        /*
        await queryRunner.query(`ALTER TABLE "regularTasks" RENAME TO "temporary_regularTasks"`)
        await queryRunner.query(`CREATE TABLE "regularTasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "time" varchar(5), "beginDate" varchar(10) NOT NULL, "endDate" varchar(10), "period" varchar(25) NOT NULL DEFAULT ('everyDay'), "periodParam" varchar(25) NOT NULL DEFAULT ('+1 day'), "periodSize" integer NOT NULL DEFAULT (1), "title" text, "isImportant" boolean NOT NULL DEFAULT (0), "isUrgent" boolean NOT NULL DEFAULT (0), "weekDay" integer, "weekId" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updateAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime)`)
        await queryRunner.query(`INSERT INTO "regularTasks"("id", "time", "beginDate", "endDate", "period", "periodParam", "periodSize", "title", "isImportant", "isUrgent", "weekDay", "weekId", "createdAt", "updateAt", "deletedAt") SELECT "id", "time", "beginDate", "endDate", "period", "periodParam", "periodSize", "title", "isImportant", "isUrgent", "weekDay", "weekId", "createdAt", "updateAt", "deletedAt" FROM "temporary_regularTasks"`)
        await queryRunner.query(`DROP TABLE "temporary_regularTasks"`)
        */
        await queryRunner.query(`DROP TABLE "regularTasksResults"`)
        await queryRunner.query(`DROP TABLE "actualTasksPaging"`)
        //auto-generation mistake 
        /*
        await queryRunner.query(`ALTER TABLE "regularTasks" RENAME TO "temporary_regularTasks"`)
        await queryRunner.query(`CREATE TABLE "regularTasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "time" varchar(5), "beginDate" varchar(10) NOT NULL, "endDate" varchar(10), "period" varchar(25) NOT NULL DEFAULT ('everyDay'), "periodParam" varchar(25) NOT NULL DEFAULT ('+1 day'), "periodSize" integer NOT NULL DEFAULT (1), "title" text, "isImportant" boolean NOT NULL DEFAULT (0), "isUrgent" boolean NOT NULL DEFAULT (0), "weekDay" integer, "weekId" integer, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updateAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, CONSTRAINT "FK_c2e7e909d97d03ccee93c1905e2" FOREIGN KEY ("weekId") REFERENCES "regularTasksWeek" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c2e7e909d97d03ccee93c1905e2" FOREIGN KEY ("weekId") REFERENCES "regularTasksWeek" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`)
        await queryRunner.query(`INSERT INTO "regularTasks"("id", "time", "beginDate", "endDate", "period", "periodParam", "periodSize", "title", "isImportant", "isUrgent", "weekDay", "weekId", "createdAt", "updateAt", "deletedAt") SELECT "id", "time", "beginDate", "endDate", "period", "periodParam", "periodSize", "title", "isImportant", "isUrgent", "weekDay", "weekId", "createdAt", "updateAt", "deletedAt" FROM "temporary_regularTasks"`)
        await queryRunner.query(`DROP TABLE "temporary_regularTasks"`)
        */
    }

}

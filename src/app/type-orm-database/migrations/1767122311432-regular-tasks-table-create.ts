import { MigrationInterface, QueryRunner } from "typeorm";

export class RegularTasksTableCreate1767122311432 implements MigrationInterface {
    name = 'RegularTasksTableCreate1767122311432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE 
            "regularTasks" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "time" text, 
                "from" date NOT NULL DEFAULT (1767122313164), 
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
            )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "regularTasks"`);
    }

}

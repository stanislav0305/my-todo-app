import { MigrationInterface, QueryRunner } from "typeorm";

export class NextMigration1765049101409 implements MigrationInterface {
    name = 'NextMigration1765049101409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_tasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "time" text, "date" text, "title" text, "status" text NOT NULL, "isImportant" boolean NOT NULL DEFAULT (0), "isUrgent" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updateAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime)`);
        await queryRunner.query(`INSERT INTO "temporary_tasks"("id", "time", "date", "title", "status") SELECT "id", "time", "date", "title", "status" FROM "tasks"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`ALTER TABLE "temporary_tasks" RENAME TO "tasks"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" RENAME TO "temporary_tasks"`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "time" text, "date" text, "title" text, "status" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "tasks"("id", "time", "date", "title", "status") SELECT "id", "time", "date", "title", "status" FROM "temporary_tasks"`);
        await queryRunner.query(`DROP TABLE "temporary_tasks"`);
    }

}

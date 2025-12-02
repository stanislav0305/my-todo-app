import { MigrationInterface, QueryRunner } from "typeorm";

export class TasksTableCreate1764668295103 implements MigrationInterface {
    name = 'TasksTableCreate1764668295103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "time" text, "date" text, "title" text, "status" text NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tasks"`);
    }

}

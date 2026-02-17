import { MigrationInterface, QueryRunner } from "typeorm"

export class NextMigration1771050379714 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM regularTasks WHERE period = 'everyWeek'`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

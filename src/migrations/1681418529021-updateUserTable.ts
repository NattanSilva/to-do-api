import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1681418529021 implements MigrationInterface {
    name = 'UpdateUserTable1681418529021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

}

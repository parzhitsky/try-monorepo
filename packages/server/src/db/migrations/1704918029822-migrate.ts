import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class Migrate1704918029822 implements MigrationInterface {
    name = 'Migrate1704918029822'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "user_credit" SET DEFAULT (0)')
      await queryRunner.query('ALTER TABLE "purchase" ALTER COLUMN "purchase_price" SET DEFAULT (0)')
      await queryRunner.query('ALTER TABLE "post" ALTER COLUMN "post_price" SET DEFAULT (0)')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "post" ALTER COLUMN "post_price" SET DEFAULT \'0\'')
      await queryRunner.query('ALTER TABLE "purchase" ALTER COLUMN "purchase_price" SET DEFAULT \'0\'')
      await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "user_credit" SET DEFAULT \'0\'')
    }
}

import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class Migrate1704844759535 implements MigrationInterface {
    name = 'Migrate1704844759535'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE "purchase" ("post_id" uuid NOT NULL, "user_id" uuid NOT NULL, "purchase_price" numeric(10,4) NOT NULL DEFAULT (0), CONSTRAINT "PK_39f6c54f7329ccc1dd805e1be6d" PRIMARY KEY ("post_id", "user_id"))')
      await queryRunner.query('CREATE UNIQUE INDEX "idx_purchase_post_id_user_id" ON "purchase" ("post_id", "user_id") ')
      await queryRunner.query('ALTER TABLE "user" ADD "user_credit" numeric(18,4) NOT NULL DEFAULT (0)')
      await queryRunner.query('ALTER TABLE "post" ADD "post_price" numeric(10,4) NOT NULL DEFAULT (0)')
      await queryRunner.query('ALTER TABLE "purchase" ADD CONSTRAINT "FK_d81ae50e2d4ab9920bebcef21ae" FOREIGN KEY ("post_id") REFERENCES "post"("post_id") ON DELETE RESTRICT ON UPDATE NO ACTION')
      await queryRunner.query('ALTER TABLE "purchase" ADD CONSTRAINT "FK_c4f9e58ae516d88361b37ed9532" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "purchase" DROP CONSTRAINT "FK_c4f9e58ae516d88361b37ed9532"')
      await queryRunner.query('ALTER TABLE "purchase" DROP CONSTRAINT "FK_d81ae50e2d4ab9920bebcef21ae"')
      await queryRunner.query('ALTER TABLE "post" DROP COLUMN "post_price"')
      await queryRunner.query('ALTER TABLE "user" DROP COLUMN "user_credit"')
      await queryRunner.query('DROP INDEX "public"."idx_purchase_post_id_user_id"')
      await queryRunner.query('DROP TABLE "purchase"')
    }
}

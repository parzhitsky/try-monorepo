import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class Migrate1696623420789 implements MigrationInterface {
    name = 'Migrate1696623420789'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE "user" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_alias" character varying NOT NULL, CONSTRAINT "UQ_aa2631f812fc2d00bf26a5eada6" UNIQUE ("user_alias"), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))')
      await queryRunner.query('CREATE TABLE "comment" ("comment_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "comment_content" character varying(255) NOT NULL, "author_id" uuid, "post_id" uuid, CONSTRAINT "PK_6a9f9bf1cf9a09107d3224a0e9a" PRIMARY KEY ("comment_id"))')
      await queryRunner.query('CREATE TABLE "post" ("post_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "post_content" character varying(255) NOT NULL, "author_id" uuid, CONSTRAINT "PK_4d093caee4d33b2745c7d05a41d" PRIMARY KEY ("post_id"))')
      await queryRunner.query('ALTER TABLE "comment" ADD CONSTRAINT "FK_3ce66469b26697baa097f8da923" FOREIGN KEY ("author_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION')
      await queryRunner.query('ALTER TABLE "comment" ADD CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93" FOREIGN KEY ("post_id") REFERENCES "post"("post_id") ON DELETE CASCADE ON UPDATE NO ACTION')
      await queryRunner.query('ALTER TABLE "post" ADD CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62" FOREIGN KEY ("author_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "post" DROP CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62"')
      await queryRunner.query('ALTER TABLE "comment" DROP CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93"')
      await queryRunner.query('ALTER TABLE "comment" DROP CONSTRAINT "FK_3ce66469b26697baa097f8da923"')
      await queryRunner.query('DROP TABLE "post"')
      await queryRunner.query('DROP TABLE "comment"')
      await queryRunner.query('DROP TABLE "user"')
    }
}

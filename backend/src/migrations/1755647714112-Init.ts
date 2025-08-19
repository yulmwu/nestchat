import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1755647714112 implements MigrationInterface {
    name = 'Init1755647714112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "subscriptions" ("id" SERIAL NOT NULL, "followerId" integer, "followingId" integer, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('0', '1')`)
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(32) NOT NULL, "nickname" character varying(32), "password" character varying(255) NOT NULL, "email" character varying(320) NOT NULL, "description" character varying(255), "profileImage" character varying(255), "role" "public"."users_role_enum" NOT NULL DEFAULT '1', "points" integer NOT NULL DEFAULT '0', "postCount" integer NOT NULL DEFAULT '0', "commentCount" integer NOT NULL DEFAULT '0', "followersCount" integer NOT NULL DEFAULT '0', "followingCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "messages" ("id" SERIAL NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "readAt" TIMESTAMP, "senderId" integer, "recipientId" integer, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_22040b67c0262140a92dd38e7fe" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_c08927026d5de9b1a1cb6b87d3d" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "messages" ADD CONSTRAINT "FK_f548818d46a1315d4e1d5e62da5" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_f548818d46a1315d4e1d5e62da5"`)
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`)
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_c08927026d5de9b1a1cb6b87d3d"`)
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_22040b67c0262140a92dd38e7fe"`)
        await queryRunner.query(`DROP TABLE "messages"`)
        await queryRunner.query(`DROP TABLE "users"`)
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`)
        await queryRunner.query(`DROP TABLE "subscriptions"`)
    }
}

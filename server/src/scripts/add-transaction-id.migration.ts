import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransactionIdToOrders1234567890 implements MigrationInterface {
  name = 'AddTransactionIdToOrders1234567890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "orders" 
      ADD COLUMN IF NOT EXISTS "transaction_id" text
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_orders_transaction_id" 
      ON "orders" ("transaction_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_orders_transaction_id"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN IF EXISTS "transaction_id"`);
  }
}

import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddImageUrlToCategories1700000000000 implements MigrationInterface {
  name = 'AddImageUrlToCategories1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'categories',
      new TableColumn({
        name: 'image_url',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('categories', 'image_url');
  }
}

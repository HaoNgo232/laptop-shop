import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Category } from '../products/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../auth/entities/user.entity';
import { BcryptProvider } from '../auth/providers/bcrypt.provider';

async function seedData() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const bcryptProvider = new BcryptProvider();

  try {
    // Tạo categories
    const categoryRepo = dataSource.getRepository(Category);

    const electronics = await categoryRepo.save({
      name: 'Điện tử',
      description: 'Các thiết bị điện tử như điện thoại, laptop, tablet',
    });

    const fashion = await categoryRepo.save({
      name: 'Thời trang',
      description: 'Quần áo, giày dép, phụ kiện thời trang',
    });

    const books = await categoryRepo.save({
      name: 'Sách',
      description: 'Sách giáo khoa, tiểu thuyết, sách kỹ năng',
    });

    // Tạo products
    const productRepo = dataSource.getRepository(Product);

    const products = [
      {
        name: 'iPhone 15 Pro',
        description: 'Điện thoại thông minh cao cấp với chip A17 Pro',
        price: 25000000,
        stock_quantity: 50,
        image_url:
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        category_id: electronics.id,
      },
      {
        name: 'MacBook Air M2',
        description: 'Laptop siêu mỏng với chip Apple M2 mạnh mẽ',
        price: 28000000,
        stock_quantity: 30,
        image_url:
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        category_id: electronics.id,
      },
      {
        name: 'Áo thun nam cao cấp',
        description: 'Áo thun cotton 100% thoáng mát, form slim fit',
        price: 299000,
        stock_quantity: 100,
        image_url:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        category_id: fashion.id,
      },
      {
        name: 'Giày sneaker trắng',
        description: 'Giày thể thao thời trang, phù hợp mọi độ tuổi',
        price: 850000,
        stock_quantity: 75,
        image_url:
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        category_id: fashion.id,
      },
      {
        name: 'Clean Code',
        description: 'Sách lập trình - Nghệ thuật viết code sạch',
        price: 320000,
        stock_quantity: 200,
        image_url:
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        category_id: books.id,
      },
    ];

    for (const productData of products) {
      await productRepo.save(productData);
    }

    // Tạo test user
    const userRepo = dataSource.getRepository(User);

    const hashedPassword = await bcryptProvider.hashPassword('123456789');

    await userRepo.save({
      email: 'test@example.com',
      username: 'testuser',
      password_hash: hashedPassword,
      address: 'Hà Nội, Việt Nam',
      phone_number: '0123456789',
    });

    console.log('✅ Seed data completed successfully!');
    console.log('Test user: test@example.com / 123456789');
  } catch (error) {
    console.error('❌ Seed data failed:', error);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  seedData();
}

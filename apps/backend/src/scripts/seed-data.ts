import { AppModule } from '@/app.module';
import { BcryptProvider } from '@/auth/providers/bcrypt.provider';
import { Category } from '@/products/entities/category.entity';
import { Product } from '@/products/entities/product.entity';
import { User } from '@/auth/entities/user.entity';
import { UserRole } from '@/auth/enums/user-role.enum';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

async function seedData() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const bcryptProvider = new BcryptProvider();

  try {
    // Tạo categories chuyên về công nghệ
    const categoryRepo = dataSource.getRepository(Category);

    const laptops = await categoryRepo.save({
      name: 'Laptop',
      description: 'Laptop văn phòng, gaming, workstation cho mọi nhu cầu',
    });

    const accessories = await categoryRepo.save({
      name: 'Phụ kiện',
      description: 'Chuột, bàn phím, tai nghe, webcam và các phụ kiện khác',
    });

    const components = await categoryRepo.save({
      name: 'Linh kiện',
      description: 'RAM, SSD, ổ cứng, card đồ họa và linh kiện nâng cấp',
    });

    const monitors = await categoryRepo.save({
      name: 'Màn hình',
      description: 'Màn hình máy tính, gaming monitor, màn hình chuyên dụng',
    });

    const gadgets = await categoryRepo.save({
      name: 'Thiết bị di động',
      description: 'Tablet, smartphone, smartwatch và thiết bị thông minh',
    });

    // Tạo products chuyên về công nghệ
    const productRepo = dataSource.getRepository(Product);

    const products = [
      // LAPTOPS
      {
        name: 'MacBook Pro 14" M3 Pro',
        description:
          'Laptop chuyên nghiệp với chip M3 Pro, 18GB RAM, 512GB SSD. Màn hình Liquid Retina XDR 14.2 inch. Lý tưởng cho developers và designers.',
        price: 52990000,
        stockQuantity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        category_id: laptops.id,
      },
      {
        name: 'Dell XPS 13 Plus',
        description:
          'Ultrabook cao cấp Intel Core i7-1260P, 16GB RAM, 1TB SSD. Thiết kế siêu mỏng, màn hình 13.4" 4K OLED touchscreen.',
        price: 42990000,
        stockQuantity: 20,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        category_id: laptops.id,
      },
      {
        name: 'ASUS ROG Strix G15',
        description:
          'Gaming laptop AMD Ryzen 7 6800H, RTX 4060 8GB, 16GB DDR5, 1TB SSD. Màn hình 15.6" 144Hz. Hoàn hảo cho gaming và streaming.',
        price: 28990000,
        stockQuantity: 25,
        imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
        category_id: laptops.id,
      },
      {
        name: 'ThinkPad X1 Carbon Gen 11',
        description:
          'Business laptop Intel Core i7-1355U, 32GB RAM, 1TB SSD. Chuẩn quân đội Mỹ, bàn phím TrackPoint. Dành cho doanh nghiệp.',
        price: 48990000,
        stockQuantity: 12,
        imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
        category_id: laptops.id,
      },
      {
        name: 'HP Pavilion 15',
        description:
          'Laptop tầm trung Intel Core i5-1235U, 8GB RAM, 512GB SSD. Màn hình 15.6" Full HD. Phù hợp học tập và làm việc.',
        price: 16990000,
        stockQuantity: 40,
        imageUrl: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500',
        category_id: laptops.id,
      },

      // PHỤ KIỆN
      {
        name: 'Logitech MX Master 3S',
        description:
          'Chuột không dây cao cấp, sensor 8000 DPI, pin 70 ngày, cuộn ngang. Tương thích đa thiết bị với Logitech Flow.',
        price: 2490000,
        stockQuantity: 50,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        category_id: accessories.id,
      },
      {
        name: 'Keychron K8 Pro',
        description:
          'Bàn phím cơ không dây 87 phím, hotswap switch, LED RGB, pin 4000mAh. Tương thích Mac/Windows với keycap kép.',
        price: 3590000,
        stockQuantity: 30,
        imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
        category_id: accessories.id,
      },
      {
        name: 'Sony WH-1000XM5',
        description:
          'Tai nghe chống ồn hàng đầu, driver 30mm, pin 30 giờ, sạc nhanh 3 phút dùng 3 giờ. Codec LDAC Hi-Res.',
        price: 8990000,
        stockQuantity: 25,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category_id: accessories.id,
      },
      {
        name: 'Logitech C920s Pro HD',
        description:
          'Webcam Full HD 1080p/30fps, autofocus, mic stereo tích hợp, privacy shutter. Tối ưu cho meetings và streaming.',
        price: 1890000,
        stockQuantity: 60,
        imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500',
        category_id: accessories.id,
      },

      // LINH KIỆN
      {
        name: 'Corsair Vengeance LPX 32GB DDR4',
        description:
          'RAM DDR4-3200 (2x16GB), timings 16-18-18-36, tản nhiệt nhôm. Tương thích Intel XMP 2.0 và AMD DOCP.',
        price: 2890000,
        stockQuantity: 35,
        imageUrl: 'https://images.unsplash.com/photo-1591238371519-95f9dbfe7bb6?w=500',
        category_id: components.id,
      },
      {
        name: 'Samsung 980 PRO 2TB',
        description:
          'SSD NVMe PCIe 4.0, tốc độ đọc 7000MB/s, ghi 6900MB/s. Bảo hành 5 năm, TBW 1200TB. Tăng tốc hệ thống và games.',
        price: 4490000,
        stockQuantity: 40,
        imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
        category_id: components.id,
      },
      {
        name: 'Seagate BarraCuda 4TB',
        description:
          'Ổ cứng HDD 3.5" 7200RPM, cache 256MB, SATA 6Gb/s. Lưu trữ lớn cho dữ liệu, phim ảnh và backup.',
        price: 2290000,
        stockQuantity: 45,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        category_id: components.id,
      },

      // MÀN HÌNH
      {
        name: 'LG UltraGear 27GP850',
        description:
          'Gaming monitor 27" 2K QHD, 165Hz, 1ms GtG, G-Sync Compatible, HDR400. Panel Nano IPS với 98% DCI-P3.',
        price: 8490000,
        stockQuantity: 20,
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
        category_id: monitors.id,
      },
      {
        name: 'Dell U2723QE',
        description:
          'Màn hình chuyên nghiệp 27" 4K IPS, 100% sRGB, 95% DCI-P3, USB-C 90W, KVM switch. Dành cho content creators.',
        price: 12990000,
        stockQuantity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=500',
        category_id: monitors.id,
      },

      // THIẾT BỊ DI ĐỘNG
      {
        name: 'iPad Pro 12.9" M2',
        description:
          'Tablet cao cấp chip M2, 128GB WiFi, màn hình Liquid Retina XDR 12.9", hỗ trợ Apple Pencil 2. Thay thế laptop.',
        price: 26990000,
        stockQuantity: 18,
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
        category_id: gadgets.id,
      },
      {
        name: 'Samsung Galaxy Tab S9+',
        description:
          'Android tablet Snapdragon 8 Gen 2, 12.4" Dynamic AMOLED 2X, S Pen trong hộp, chống nước IP68.',
        price: 22990000,
        stockQuantity: 22,
        imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500',
        category_id: gadgets.id,
      },
      {
        name: 'Apple Watch Series 9',
        description:
          'Smartwatch chip S9 SiP, màn hình Always-On Retina 45mm, GPS + Cellular, theo dõi sức khỏe toàn diện.',
        price: 10990000,
        stockQuantity: 30,
        imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500',
        category_id: gadgets.id,
      },
    ];

    for (const productData of products) {
      await productRepo.save(productData);
    }

    // Tạo admin và customer test users
    const userRepo = dataSource.getRepository(User);

    const hashedPassword = await bcryptProvider.hashPassword('123456789');
    const hashedAdminPassword = await bcryptProvider.hashPassword('admin123');

    // Admin user
    await userRepo.save({
      email: 'admin@techstore.com',
      username: 'admin',
      passwordHash: hashedAdminPassword,
      address: 'Trụ sở chính - 123 Nguyễn Văn Cừ, Q1, HCM',
      phoneNumber: '0909123456',
      role: UserRole.ADMIN,
    });

    // Test customer
    await userRepo.save({
      email: 'customer@gmail.com',
      username: 'customer',
      passwordHash: hashedPassword,
      address: '456 Lê Văn Việt, Q9, TP.HCM',
      phoneNumber: '0987654321',
      role: UserRole.USER,
    });

    console.log(' Tech Store seed data completed successfully!');
    console.log(' Categories: Laptop, Phụ kiện, Linh kiện, Màn hình, Thiết bị di động');
    console.log(' Products: 18 sản phẩm công nghệ cao cấp');
    console.log(' Test users:');
    console.log('   - Admin: admin@techstore.com / admin123');
    console.log('   - Customer: customer@gmail.com / 123456789');
  } catch (error) {
    console.error(' Seed data failed:', error);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  void seedData();
}

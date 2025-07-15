/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

    const findOrCreateCategory = async (name: string, description: string) => {
      let category = await categoryRepo.findOneBy({ name });
      if (!category) {
        category = await categoryRepo.save({
          name,
          description,
        });
      }
      return category;
    };

    const laptops = await findOrCreateCategory(
      'Laptop',
      'Laptop văn phòng, gaming, workstation cho mọi nhu cầu',
    );

    const accessories = await findOrCreateCategory(
      'Phụ kiện',
      'Chuột, bàn phím, tai nghe, webcam và các phụ kiện khác',
    );

    const components = await findOrCreateCategory(
      'Linh kiện',
      'RAM, SSD, ổ cứng, card đồ họa và linh kiện nâng cấp',
    );

    const monitors = await findOrCreateCategory(
      'Màn hình',
      'Màn hình máy tính, gaming monitor, màn hình chuyên dụng',
    );

    const gadgets = await findOrCreateCategory(
      'Thiết bị di động',
      'Tablet, smartphone, smartwatch và thiết bị thông minh',
    );

    // Tạo products chuyên về công nghệ
    const productRepo = dataSource.getRepository(Product);

    const findOrCreateProduct = async (productData: any) => {
      let product = await productRepo.findOneBy({ name: productData.name });
      if (!product) {
        product = await productRepo.save(productData);
        console.log(` Created product: ${productData.name}`);
      } else {
        console.log(`⚠️  Product already exists: ${productData.name}`);
      }
      return product;
    };

    const products = [
      // LAPTOPS
      {
        name: 'MacBook Pro 14" M3 Pro',
        description:
          'Laptop chuyên nghiệp với chip M3 Pro, 18GB RAM, 512GB SSD. Màn hình Liquid Retina XDR 14.2 inch. Lý tưởng cho developers và designers.',
        price: 2990,
        stockQuantity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        category: laptops,
      },
      {
        name: 'Dell XPS 13 Plus',
        description:
          'Ultrabook cao cấp Intel Core i7-1260P, 16GB RAM, 1TB SSD. Thiết kế siêu mỏng, màn hình 13.4" 4K OLED touchscreen.',
        price: 2890,
        stockQuantity: 20,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        category: laptops,
      },
      {
        name: 'ASUS ROG Strix G15',
        description:
          'Gaming laptop AMD Ryzen 7 6800H, RTX 4060 8GB, 16GB DDR5, 1TB SSD. Màn hình 15.6" 144Hz. Hoàn hảo cho gaming và streaming.',
        price: 2490,
        stockQuantity: 25,
        imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
        category: laptops,
      },
      {
        name: 'ThinkPad X1 Carbon Gen 11',
        description:
          'Business laptop Intel Core i7-1355U, 32GB RAM, 1TB SSD. Chuẩn quân đội Mỹ, bàn phím TrackPoint. Dành cho doanh nghiệp.',
        price: 2790,
        stockQuantity: 12,
        imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
        category: laptops,
      },
      {
        name: 'HP Pavilion 15',
        description:
          'Laptop tầm trung Intel Core i5-1235U, 8GB RAM, 512GB SSD. Màn hình 15.6" Full HD. Phù hợp học tập và làm việc.',
        price: 1690,
        stockQuantity: 40,
        imageUrl: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500',
        category: laptops,
      },

      // PHỤ KIỆN
      {
        name: 'Logitech MX Master 3S',
        description:
          'Chuột không dây cao cấp, sensor 8000 DPI, pin 70 ngày, cuộn ngang. Tương thích đa thiết bị với Logitech Flow.',
        price: 1249,
        stockQuantity: 50,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        category: accessories,
      },
      {
        name: 'Keychron K8 Pro',
        description:
          'Bàn phím cơ không dây 87 phím, hotswap switch, LED RGB, pin 4000mAh. Tương thích Mac/Windows với keycap kép.',
        price: 1590,
        stockQuantity: 30,
        imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
        category: accessories,
      },
      {
        name: 'Sony WH-1000XM5',
        description:
          'Tai nghe chống ồn hàng đầu, driver 30mm, pin 30 giờ, sạc nhanh 3 phút dùng 3 giờ. Codec LDAC Hi-Res.',
        price: 2990,
        stockQuantity: 25,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: accessories,
      },
      {
        name: 'Logitech C920s Pro HD',
        description:
          'Webcam Full HD 1080p/30fps, autofocus, mic stereo tích hợp, privacy shutter. Tối ưu cho meetings và streaming.',
        price: 1189,
        stockQuantity: 60,
        imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500',
        category: accessories,
      },

      // LINH KIỆN
      {
        name: 'Corsair Vengeance LPX 32GB DDR4',
        description:
          'RAM DDR4-3200 (2x16GB), timings 16-18-18-36, tản nhiệt nhôm. Tương thích Intel XMP 2.0 và AMD DOCP.',
        price: 1289,
        stockQuantity: 35,
        imageUrl: 'https://images.unsplash.com/photo-1591238371519-95f9dbfe7bb6?w=500',
        category: components,
      },
      {
        name: 'Samsung 980 PRO 2TB',
        description:
          'SSD NVMe PCIe 4.0, tốc độ đọc 7000MB/s, ghi 6900MB/s. Bảo hành 5 năm, TBW 1200TB. Tăng tốc hệ thống và games.',
        price: 2249,
        stockQuantity: 40,
        imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
        category: components,
      },
      {
        name: 'Seagate BarraCuda 4TB',
        description:
          'Ổ cứng HDD 3.5" 7200RPM, cache 256MB, SATA 6Gb/s. Lưu trữ lớn cho dữ liệu, phim ảnh và backup.',
        price: 1129,
        stockQuantity: 45,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        category: components,
      },

      // MÀN HÌNH
      {
        name: 'LG UltraGear 27GP850',
        description:
          'Gaming monitor 27" 2K QHD, 165Hz, 1ms GtG, G-Sync Compatible, HDR400. Panel Nano IPS với 98% DCI-P3.',
        price: 2849,
        stockQuantity: 20,
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
        category: monitors,
      },
      {
        name: 'Dell U2723QE',
        description:
          'Màn hình chuyên nghiệp 27" 4K IPS, 100% sRGB, 95% DCI-P3, USB-C 90W, KVM switch. Dành cho content creators.',
        price: 2001,
        stockQuantity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=500',
        category: monitors,
      },

      // THIẾT BỊ DI ĐỘNG
      {
        name: 'iPad Pro 12.9" M2',
        description:
          'Tablet cao cấp chip M2, 128GB WiFi, màn hình Liquid Retina XDR 12.9", hỗ trợ Apple Pencil 2. Thay thế laptop.',
        price: 2002,
        stockQuantity: 18,
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
        category: gadgets,
      },
      {
        name: 'Samsung Galaxy Tab S9+',
        description:
          'Android tablet Snapdragon 8 Gen 2, 12.4" Dynamic AMOLED 2X, S Pen trong hộp, chống nước IP68.',
        price: 2003,
        stockQuantity: 22,
        imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500',
        category: gadgets,
      },
      {
        name: 'Apple Watch Series 9',
        description:
          'Smartwatch chip S9 SiP, màn hình Always-On Retina 45mm, GPS + Cellular, theo dõi sức khỏe toàn diện.',
        price: 2000,
        stockQuantity: 30,
        imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500',
        category: gadgets,
      },

      // THÊM 20 SẢN PHẨM MỚI ĐỂ TEST
      // LAPTOPS MỞ RỘNG
      {
        name: 'MSI Creator Z17',
        description:
          'Workstation laptop Intel Core i9-12900H, RTX 4080 16GB, 32GB DDR5, 2TB SSD. Màn hình 17" 4K Mini LED 100% DCI-P3.',
        price: 2999,
        stockQuantity: 8,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        category: laptops,
      },
      {
        name: 'Razer Blade 15',
        description:
          'Gaming ultrabook Intel Core i7-13800H, RTX 4070 8GB, 16GB DDR5, 1TB SSD. Màn hình 15.6" QHD 240Hz.',
        price: 2799,
        stockQuantity: 12,
        imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
        category: laptops,
      },
      {
        name: 'Surface Laptop Studio 2',
        description:
          'Laptop lai 2-in-1 Intel Core i7-13700H, RTX 4060 8GB, 32GB RAM, 1TB SSD. Màn hình cảm ứng 14.4" PixelSense.',
        price: 2749,
        stockQuantity: 10,
        imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
        category: laptops,
      },
      {
        name: 'MacBook Air 13" M3',
        description:
          'Ultrabook mỏng nhẹ chip M3, 16GB RAM, 512GB SSD. Pin 18 giờ, màn hình Liquid Retina 13.6". Hoàn hảo cho di động.',
        price: 2349,
        stockQuantity: 35,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        category: laptops,
      },

      // PHỤ KIỆN MỞ RỘNG
      {
        name: 'Razer DeathAdder V3 Pro',
        description:
          'Chuột gaming không dây, sensor Focus Pro 30K, switches quang học Gen-3, pin 90 giờ. Tối ưu cho esports.',
        price: 1999,
        stockQuantity: 40,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        category: accessories,
      },
      {
        name: 'SteelSeries Apex Pro TKL',
        description:
          'Bàn phím cơ gaming tenkeyless, switch từ tính OmniPoint 2.0, LED RGB per-key, khung nhôm cao cấp.',
        price: 2549,
        stockQuantity: 25,
        imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
        category: accessories,
      },
      {
        name: 'HyperX Cloud Alpha Wireless',
        description:
          'Gaming headset không dây, driver 50mm, pin 300 giờ, mic chống ồn. Tương thích PC, PlayStation, Nintendo Switch.',
        price: 2479,
        stockQuantity: 30,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: accessories,
      },
      {
        name: 'Elgato Stream Deck +',
        description:
          'Bộ điều khiển streaming 8 phím LCD cảm ứng, 4 núm xoay, tích hợp với OBS, Twitch, YouTube. Dành cho streamers.',
        price: 2599,
        stockQuantity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500',
        category: accessories,
      },
      {
        name: 'Blue Yeti X USB Microphone',
        description:
          'Microphone chuyên nghiệp 4-capsule condenser, LED meter thời gian thực, pop filter tích hợp. Cho podcast và streaming.',
        price: 2249,
        stockQuantity: 20,
        imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500',
        category: accessories,
      },

      // LINH KIỆN MỞ RỘNG
      {
        name: 'NVIDIA GeForce RTX 4090',
        description:
          'Card đồ họa flagship 24GB GDDR6X, Ada Lovelace architecture, Ray Tracing Gen 3, DLSS 3. Đỉnh cao gaming 4K.',
        price: 2999,
        stockQuantity: 5,
        imageUrl: 'https://images.unsplash.com/photo-1591238371519-95f9dbfe7bb6?w=500',
        category: components,
      },
      {
        name: 'AMD Ryzen 9 7950X3D',
        description:
          'CPU 16-core/32-thread, 3D V-Cache technology, boost 5.7GHz. Tối ưu cho gaming và workstation, socket AM5.',
        price: 1599,
        stockQuantity: 18,
        imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500',
        category: components,
      },
      {
        name: 'G.SKILL Trident Z5 RGB 64GB DDR5',
        description:
          'RAM DDR5-6000 (4x16GB), timings C36-36-36-96, RGB lighting, tản nhiệt nhôm. Extreme performance cho workstation.',
        price: 1299,
        stockQuantity: 12,
        imageUrl: 'https://images.unsplash.com/photo-1591238371519-95f9dbfe7bb6?w=500',
        category: components,
      },
      {
        name: 'Western Digital Black SN850X 4TB',
        description:
          'SSD NVMe PCIe 4.0, đọc 7300MB/s, ghi 6600MB/s. Game Mode 2.0, DirectStorage support. Dành cho gaming cao cấp.',
        price: 2999,
        stockQuantity: 22,
        imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
        category: components,
      },

      // MÀN HÌNH MỞ RỘNG
      {
        name: 'ASUS ROG Swift PG32UQX',
        description:
          'Gaming monitor 32" 4K Mini LED, 144Hz, 1ms, G-Sync Ultimate, HDR1400. 1152 zones dimming, 99% Adobe RGB.',
        price: 2999,
        stockQuantity: 3,
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
        category: monitors,
      },
      {
        name: 'Samsung Odyssey G9 49"',
        description:
          'Ultrawide gaming monitor 49" 5120x1440, 240Hz, 1ms, Quantum Dot, HDR1000. Độ cong 1000R, dual QHD.',
        price: 2329,
        stockQuantity: 6,
        imageUrl: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=500',
        category: monitors,
      },
      {
        name: 'Apple Studio Display',
        description:
          'Màn hình 27" 5K Retina, 600 nits, P3 wide color, True Tone, camera 12MP Ultra Wide, 6 speakers. Cho Mac ecosystem.',
        price: 2429,
        stockQuantity: 8,
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
        category: monitors,
      },
      {
        name: 'BenQ SW321C PhotoVue',
        description:
          'Monitor chuyên nhiếp ảnh 32" 4K IPS, 99% Adobe RGB, 95% DCI-P3, hardware calibration, hood chống lóa.',
        price: 2249,
        stockQuantity: 10,
        imageUrl: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=500',
        category: monitors,
      },

      // THIẾT BỊ DI ĐỘNG MỞ RỘNG
      {
        name: 'iPhone 15 Pro Max',
        description:
          'Smartphone cao cấp chip A17 Pro, titanium design, camera 48MP với 5x zoom, Action Button, USB-C. 512GB storage.',
        price: 2349,
        stockQuantity: 25,
        imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500',
        category: gadgets,
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description:
          'Android flagship Snapdragon 8 Gen 3, S Pen tích hợp, camera 200MP với AI zoom, màn hình 6.8" Dynamic AMOLED 2X.',
        price: 2299,
        stockQuantity: 20,
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
        category: gadgets,
      },
      {
        name: 'Steam Deck OLED',
        description:
          'Handheld gaming PC màn hình OLED 7.4", AMD APU custom, 1TB NVMe, pin 12 giờ. Chơi games Steam mọi lúc mọi nơi.',
        price: 1899,
        stockQuantity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=500',
        category: gadgets,
      },
    ];

    for (const productData of products) {
      await findOrCreateProduct(productData);
    }

    // Xử lý users với helper function tương tự
    const userRepo = dataSource.getRepository(User);

    const findOrCreateUser = async (userData: any) => {
      let user = await userRepo.findOneBy({ email: userData.email });
      if (!user) {
        user = await userRepo.save(userData);
        console.log(` Created user: ${userData.email}`);
      } else {
        console.log(`⚠️  User already exists: ${userData.email}`);
      }
      return user;
    };

    const hashedPassword = await bcryptProvider.hashPassword('123456789');
    const hashedAdminPassword = await bcryptProvider.hashPassword('admin123');

    // Admin user - sử dụng findOrCreateUser thay vì save trực tiếp
    await findOrCreateUser({
      email: 'admin@techstore.com',
      username: 'admin',
      passwordHash: hashedAdminPassword,
      address: 'Trụ sở chính - 123 Nguyễn Văn Cừ, Q1, HCM',
      phoneNumber: '0909123456',
      role: UserRole.ADMIN,
    });

    // Test customer - sử dụng findOrCreateUser thay vì save trực tiếp
    await findOrCreateUser({
      email: 'customer@gmail.com',
      username: 'customer',
      passwordHash: hashedPassword,
      address: '456 Lê Văn Việt, Q9, TP.HCM',
      phoneNumber: '0987654321',
      role: UserRole.USER,
    });

    // Thêm một vài test users khác để test đa dạng
    await findOrCreateUser({
      email: 'john.doe@example.com',
      username: 'johndoe',
      passwordHash: hashedPassword,
      address: '789 Trần Hưng Đạo, Q1, TP.HCM',
      phoneNumber: '0901234567',
      role: UserRole.USER,
    });

    await findOrCreateUser({
      email: 'jane.smith@example.com',
      username: 'janesmith',
      passwordHash: hashedPassword,
      address: '321 Nguyễn Thị Minh Khai, Q3, TP.HCM',
      phoneNumber: '0912345678',
      role: UserRole.USER,
    });

    console.log(' Tech Store seed data completed successfully!');
    console.log('📂 Categories: Laptop, Phụ kiện, Linh kiện, Màn hình, Thiết bị di động');
    console.log('📱 Products: 38 sản phẩm công nghệ cao cấp');
    console.log('👥 Test users:');
    console.log('   - Admin: admin@techstore.com / admin123');
    console.log('   - Customer: customer@gmail.com / 123456789');
    console.log('   - John Doe: john.doe@example.com / 123456789');
    console.log('   - Jane Smith: jane.smith@example.com / 123456789');
  } catch (error) {
    console.error(' Seed data failed:', error);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  void seedData();
}

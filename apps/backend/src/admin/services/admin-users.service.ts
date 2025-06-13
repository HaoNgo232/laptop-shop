import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/auth/entities/user.entity';
import { AdminUserQueryDto } from '@/admin/dtos/admin-user-query.dto';
import { AdminUserViewDto } from '@/admin/dtos/admin-user-view.dto';
import { AdminViewDetailDto } from '@/admin/dtos/admin-view-detail.dto';
import { UpdateUserByAdminDto } from '@/admin/dtos/update-user-by-admin.dto';
import { IPaginationMeta } from '@web-ecom/shared-types/common/interfaces.cjs';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Lấy danh sách tất cả người dùng cho admin với phân trang và tìm kiếm
   * @param query - Tham số truy vấn bao gồm page, limit, search, role
   * @returns Promise chứa danh sách người dùng và thông tin phân trang
   */
  async findAllForAdmin(query: AdminUserQueryDto): Promise<{
    data: AdminUserViewDto[];
    meta: IPaginationMeta;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Áp dụng bộ lọc tìm kiếm theo username hoặc email
    if (query.search) {
      queryBuilder.where('(user.username ILIKE :search OR user.email ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    // Áp dụng bộ lọc theo role
    if (query.role) {
      queryBuilder.andWhere('user.role = :role', { role: query.role });
    }

    // Lấy tổng số bản ghi để tính phân trang
    const totalItems = await queryBuilder.getCount();

    // Áp dụng phân trang và sắp xếp theo ngày tạo giảm dần
    const users = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getMany();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Lấy thông tin chi tiết một người dùng theo ID cho admin
   * @param userId - ID của người dùng cần lấy thông tin
   * @returns Promise chứa thông tin chi tiết người dùng
   * @throws NotFoundException nếu không tìm thấy người dùng
   */
  async findByIdForAdmin(userId: string): Promise<AdminViewDetailDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      address: user.address,
      phoneNumber: user.phoneNumber,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Cập nhật thông tin người dùng bởi admin
   * @param userId - ID của người dùng cần cập nhật
   * @param updateUserDto - Dữ liệu cập nhật từ admin
   * @returns Promise chứa thông tin người dùng sau khi cập nhật
   * @throws NotFoundException nếu không tìm thấy người dùng
   */
  async updateByAdmin(
    userId: string,
    updateUserDto: UpdateUserByAdminDto,
  ): Promise<AdminViewDetailDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cập nhật các trường được phép cho admin
    if (updateUserDto.role !== undefined) {
      user.role = updateUserDto.role;
    }

    const updatedUser = await this.userRepository.save(user);

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      address: updatedUser.address,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}

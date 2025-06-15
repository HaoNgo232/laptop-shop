import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
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
   */
  async findAllForAdmin(query: AdminUserQueryDto): Promise<{
    data: AdminUserViewDto[];
    meta: IPaginationMeta;
  }> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.buildUserQuery(query);
    const totalItems = await queryBuilder.getCount();
    const users = await this.executeUserQuery(queryBuilder, skip, limit);
    const meta = this.buildPaginationMeta(page, limit, totalItems);

    return {
      data: users.map(this.mapToAdminUserView),
      meta,
    };
  }

  /**
   * Lấy thông tin chi tiết một người dùng theo ID cho admin
   */
  async findByIdForAdmin(userId: string): Promise<AdminViewDetailDto> {
    const user = await this.findUserOrThrow(userId);
    return this.mapToAdminDetailView(user);
  }

  /**
   * Cập nhật thông tin người dùng bởi admin
   */
  async updateByAdmin(
    userId: string,
    updateUserDto: UpdateUserByAdminDto,
  ): Promise<AdminViewDetailDto> {
    const user = await this.findUserOrThrow(userId);
    this.updateUserFields(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return this.mapToAdminDetailView(updatedUser);
  }

  /**
   * Tạo query builder với các điều kiện filter
   */
  private buildUserQuery(query: AdminUserQueryDto): SelectQueryBuilder<User> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (query.search) {
      queryBuilder.where('(user.username ILIKE :search OR user.email ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    if (query.role) {
      queryBuilder.andWhere('user.role = :role', { role: query.role });
    }

    return queryBuilder;
  }

  /**
   * Thực thi query với phân trang và sắp xếp
   */
  private async executeUserQuery(
    queryBuilder: SelectQueryBuilder<User>,
    skip: number,
    limit: number,
  ): Promise<User[]> {
    return queryBuilder.skip(skip).take(limit).orderBy('user.createdAt', 'DESC').getMany();
  }

  /**
   * Tạo thông tin phân trang
   */
  private buildPaginationMeta(page: number, limit: number, totalItems: number): IPaginationMeta {
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  /**
   * Tìm user theo ID hoặc throw exception
   */
  private async findUserOrThrow(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Cập nhật các trường được phép cho admin
   */
  private updateUserFields(user: User, updateUserDto: UpdateUserByAdminDto): void {
    if (updateUserDto.role !== undefined) {
      user.role = updateUserDto.role;
    }
  }

  /**
   * Map User entity sang AdminUserViewDto
   */
  private mapToAdminUserView = (user: User): AdminUserViewDto => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });

  /**
   * Map User entity sang AdminViewDetailDto
   */
  private mapToAdminDetailView = (user: User): AdminViewDetailDto => ({
    id: user.id,
    username: user.username,
    email: user.email,
    address: user.address,
    phoneNumber: user.phoneNumber,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}

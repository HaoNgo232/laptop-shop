import { Injectable } from '@nestjs/common';
import { UserProfileDto } from '@/auth/dtos/user-profile.dto';
import { User } from '@/auth/entities/user.entity';

interface IUserMapperProvider {
  toUserProfileDto(user: User): UserProfileDto;
  toUserDtos(users: User[]): UserProfileDto[];
}

@Injectable()
export class UserMapperProvider implements IUserMapperProvider {
  /**
   * Map User entity to UserProfileDto (without role - for user profile)
   */
  toUserProfileDto(user: User): UserProfileDto {
    const dto = new UserProfileDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.username = user.username;
    dto.address = user.address;
    dto.phoneNumber = user.phoneNumber;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;

    dto.role = user.role;
    return dto;
  }

  /**
   * Map array of User entities to UserDto array
   */
  toUserDtos(users: User[]): UserProfileDto[] {
    return users.map((user) => this.toUserProfileDto(user));
  }
}

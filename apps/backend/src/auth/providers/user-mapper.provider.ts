import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserProfileDto } from '../dtos/user-profile.dto';

@Injectable()
export class UserMapperProvider {
  /**
   * Map User entity to UserProfileDto (without role - for user profile)
   */
  toUserProfileDto(user: User): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      address: user.address,
      phone_number: user.phone_number,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  /**
   * Map array of User entities to UserDto array
   */
  toUserDtos(users: User[]): UserProfileDto[] {
    return users.map((user) => this.toUserProfileDto(user));
  }
}

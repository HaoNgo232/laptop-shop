import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@/auth/enums/user-role.enum';

/**
 * User response DTO (without sensitive information like password hash)
 */
export class UserResponseDto {
  @ApiProperty({ 
    description: 'Unique user identifier',
    example: '95134367-4e5c-4601-9fc9-c2cfb34ca7f7',
    format: 'uuid' 
  })
  id: string;

  @ApiProperty({ 
    description: 'User email address',
    example: 'user@example.com',
    format: 'email' 
  })
  email: string;

  @ApiProperty({ 
    description: 'Username for the account',
    example: 'johnsmith',
    minLength: 3,
    maxLength: 20 
  })
  username: string;

  @ApiProperty({ 
    description: 'User role in the system',
    enum: UserRole,
    example: UserRole.USER 
  })
  role: UserRole;

  @ApiProperty({ 
    description: 'Whether the user account is active',
    example: true 
  })
  isActive: boolean;

  @ApiProperty({ 
    description: 'Account creation timestamp',
    example: '2025-08-27T10:30:00.000Z',
    format: 'date-time' 
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Last account update timestamp',
    example: '2025-08-27T10:30:00.000Z',
    format: 'date-time' 
  })
  updatedAt: Date;
}
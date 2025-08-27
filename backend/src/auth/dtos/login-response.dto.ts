import { User } from '@/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for successful login operations
 */
export class LoginResponseDto {
  @ApiProperty({ 
    description: 'JWT access token for API authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NTEzNDM2Ny00ZTVjLTQ2MDEtOWZjOS1jMmNmYjM0Y2E3ZjciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTY5MjAwMDAwMCwiZXhwIjoxNjkyMDAzNjAwfQ.signature'
  })
  accessToken: string;

  @ApiProperty({ 
    description: 'Refresh token for obtaining new access tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NTEzNDM2Ny00ZTVjLTQ2MDEtOWZjOS1jMmNmYjM0Y2E3ZjciLCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjkyMDAwMDAwLCJleHAiOjE2OTI2MDQ4MDB9.signature'
  })
  refreshToken: string;

  @ApiProperty({ 
    description: 'Authenticated user information (password hash excluded for security)',
    example: {
      id: '95134367-4e5c-4601-9fc9-c2cfb34ca7f7',
      email: 'admin@gmail.com',
      username: 'admin',
      role: 'ADMIN',
      isActive: true,
      createdAt: '2025-08-27T10:30:00.000Z',
      updatedAt: '2025-08-27T10:30:00.000Z'
    }
  })
  user: Omit<User, 'passwordHash'>;
}

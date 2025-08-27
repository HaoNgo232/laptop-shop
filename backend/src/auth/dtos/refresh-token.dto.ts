import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for refresh token operations
 */
export class RefreshTokenDto {
  @ApiProperty({ 
    description: 'Valid refresh token to obtain a new access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NTEzNDM2Ny00ZTVjLTQ2MDEtOWZjOS1jMmNmYjM0Y2E3ZjciLCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjkyMDAwMDAwLCJleHAiOjE2OTI2MDQ4MDB9.signature' 
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

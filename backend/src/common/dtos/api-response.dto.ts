import { ApiProperty } from '@nestjs/swagger';

/**
 * Standardized API response format
 */
export class ApiResponseDto<T = any> {
  @ApiProperty({ 
    description: 'Response status code',
    example: 200 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Response message',
    example: 'Operation completed successfully' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Response data',
    required: false 
  })
  data?: T;

  @ApiProperty({ 
    description: 'Timestamp of the response',
    example: '2025-08-27T10:30:00.000Z' 
  })
  timestamp: string;
}

/**
 * Error response format
 */
export class ErrorResponseDto {
  @ApiProperty({ 
    description: 'Error status code',
    examples: [400, 401, 403, 404, 500] 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Error message or array of error messages',
    oneOf: [
      { type: 'string', example: 'Validation failed' },
      { type: 'array', items: { type: 'string' }, example: ['Email is required', 'Password must be at least 8 characters'] }
    ]
  })
  message: string | string[];

  @ApiProperty({ 
    description: 'Error type/name',
    example: 'ValidationError' 
  })
  error: string;

  @ApiProperty({ 
    description: 'Timestamp of the error',
    example: '2025-08-27T10:30:00.000Z' 
  })
  timestamp: string;

  @ApiProperty({ 
    description: 'Request path that caused the error',
    example: '/api/auth/login' 
  })
  path: string;
}

/**
 * Validation error response
 */
export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({ 
    description: 'Validation error details',
    example: ['email must be a valid email', 'password must be longer than or equal to 8 characters']
  })
  message: string[];

  @ApiProperty({ 
    description: 'Error type',
    example: 'Bad Request' 
  })
  error: string;

  @ApiProperty({ 
    description: 'HTTP status code',
    example: 400 
  })
  statusCode: number;
}

/**
 * Unauthorized error response
 */
export class UnauthorizedErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({ 
    description: 'Unauthorized error message',
    example: 'Invalid credentials' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Error type',
    example: 'Unauthorized' 
  })
  error: string;

  @ApiProperty({ 
    description: 'HTTP status code',
    example: 401 
  })
  statusCode: number;
}

/**
 * Forbidden error response
 */
export class ForbiddenErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({ 
    description: 'Forbidden access message',
    example: 'Access denied. Admin privileges required.' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Error type',
    example: 'Forbidden' 
  })
  error: string;

  @ApiProperty({ 
    description: 'HTTP status code',
    example: 403 
  })
  statusCode: number;
}

/**
 * Not found error response
 */
export class NotFoundErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({ 
    description: 'Not found error message',
    example: 'Resource not found' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Error type',
    example: 'Not Found' 
  })
  error: string;

  @ApiProperty({ 
    description: 'HTTP status code',
    example: 404 
  })
  statusCode: number;
}

/**
 * Internal server error response
 */
export class InternalServerErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({ 
    description: 'Internal server error message',
    example: 'Internal server error occurred' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Error type',
    example: 'Internal Server Error' 
  })
  error: string;

  @ApiProperty({ 
    description: 'HTTP status code',
    example: 500 
  })
  statusCode: number;
}
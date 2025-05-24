import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
  details?: any;
}

interface PostgresError {
  code?: string;
  detail?: string;
  [key: string]: any;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);

    // Fix: Convert message to string for logging
    const messageStr = Array.isArray(errorResponse.message)
      ? errorResponse.message.join(', ')
      : errorResponse.message;

    // Log error for debugging
    if (errorResponse.statusCode >= 500) {
      this.logger.error(
        `${errorResponse.method} ${errorResponse.path} - ${messageStr}`,
        exception instanceof Error ? exception.stack : exception,
      );
    } else {
      this.logger.warn(
        `${errorResponse.method} ${errorResponse.path} - ${messageStr}`,
      );
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;

    // Handle HTTP exceptions (validation errors, auth errors, etc.)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return {
        statusCode: status,
        timestamp,
        path,
        method,
        message: this.extractMessage(exceptionResponse),
        error: exception.name,
      };
    }

    // Handle TypeORM/Database errors
    if (exception instanceof QueryFailedError) {
      return this.handleDatabaseError(exception, timestamp, path, method);
    }

    // Handle unknown errors
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp,
      path,
      method,
      message: 'Đã xảy ra lỗi hệ thống',
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? exception : undefined,
    };
  }

  private extractMessage(exceptionResponse: unknown): string | string[] {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    // Fix: Type check properly
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const response = exceptionResponse as { message?: unknown };
      if (response.message) {
        return Array.isArray(response.message)
          ? (response.message as string[])
          : String(response.message);
      }
    }

    return 'Đã xảy ra lỗi';
  }

  private handleDatabaseError(
    error: QueryFailedError,
    timestamp: string,
    path: string,
    method: string,
  ): ErrorResponse {
    // Fix: Proper typing
    const driverError = error.driverError as PostgresError;

    // PostgreSQL error codes
    switch (driverError?.code) {
      case '22P02': // Invalid UUID format
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp,
          path,
          method,
          message: 'Định dạng ID không hợp lệ',
          error: 'Bad Request',
        };

      case '22001': // String too long
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp,
          path,
          method,
          message: 'Dữ liệu nhập vào quá dài theo quy định',
          error: 'Bad Request',
        };

      case '23505': {
        // Fix: Block scope
        // Unique violation
        const detail = driverError?.detail || '';
        let message = 'Dữ liệu đã tồn tại';

        if (typeof detail === 'string') {
          if (detail.includes('email')) {
            message = 'Email đã tồn tại';
          } else if (detail.includes('username')) {
            message = 'Tên người dùng đã tồn tại';
          }
        }

        return {
          statusCode: HttpStatus.CONFLICT,
          timestamp,
          path,
          method,
          message,
          error: 'Conflict',
        };
      }

      case '23503': // Foreign key violation
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp,
          path,
          method,
          message: 'Dữ liệu tham chiếu không tồn tại',
          error: 'Bad Request',
        };

      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp,
          path,
          method,
          message: 'Lỗi cơ sở dữ liệu',
          error: 'Database Error',
          details:
            process.env.NODE_ENV === 'development'
              ? {
                  code: driverError?.code,
                  detail: driverError?.detail,
                }
              : undefined,
        };
    }
  }
}

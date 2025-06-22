import { Logger } from '@nestjs/common';

export class DebugUtil {
  private static readonly logger = new Logger('Debug');

  /**
   * Log debug info với format đẹp
   */
  static log(context: string, data: any, additionalInfo?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(`[${context}] ${JSON.stringify(data, null, 2)}`);
      if (additionalInfo) {
        this.logger.debug(
          `[${context}] Additional Info: ${JSON.stringify(additionalInfo, null, 2)}`,
        );
      }
    }
  }

  /**
   * Log API request/response
   */
  static logApiCall(method: string, endpoint: string, payload?: any, response?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(`[API] ${method} ${endpoint}`);
      if (payload) {
        this.logger.debug(`[API] Payload: ${JSON.stringify(payload, null, 2)}`);
      }
      if (response) {
        this.logger.debug(`[API] Response: ${JSON.stringify(response, null, 2)}`);
      }
    }
  }

  /**
   * Log database queries
   */
  static logQuery(query: string, parameters?: any[], result?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(`[DB] Query: ${query}`);
      if (parameters && parameters.length > 0) {
        this.logger.debug(`[DB] Parameters: ${JSON.stringify(parameters, null, 2)}`);
      }
      if (result) {
        this.logger.debug(`[DB] Result: ${JSON.stringify(result, null, 2)}`);
      }
    }
  }

  /**
   * Log error với stack trace
   */
  static logError(context: string, error: unknown, additionalInfo?: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    this.logger.error(`[${context}] Error: ${message}`);

    if (error instanceof Error && error.stack) {
      this.logger.error(`[${context}] Stack: ${error.stack}`);
    }

    if (additionalInfo) {
      this.logger.error(`[${context}] Additional Info: ${JSON.stringify(additionalInfo, null, 2)}`);
    }
  }

  /**
   * Performance timing
   */
  static timeStart(label: string) {
    if (process.env.NODE_ENV === 'development') {
      console.time(label);
    }
  }

  static timeEnd(label: string) {
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(label);
    }
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from '@/app.service';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('🔧 System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiOkResponse({ description: 'Application is running' })
  getHello(): string {
    return this.appService.getHello();
  }
}

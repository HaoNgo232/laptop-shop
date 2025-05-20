import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Ứng dụng')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Kiểm tra trạng thái hoạt động' })
  @ApiResponse({ status: 200, description: 'Ứng dụng đang hoạt động' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

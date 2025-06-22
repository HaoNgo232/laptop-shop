# 🔧 Debug Configuration Guide

## Environment Variables for Debug

Thêm các biến môi trường sau vào file `.env` của bạn để enable debugging:

```env
# Debug Settings
DEBUG=true
LOG_LEVEL=debug
ENABLE_QUERY_LOGGING=true
ENABLE_REQUEST_LOGGING=true

# Performance Monitoring
ENABLE_PERFORMANCE_MONITORING=true
SLOW_QUERY_THRESHOLD=1000
```

## 🚀 Cách sử dụng Debug

### 1. Debug với VS Code

1. Mở VS Code trong thư mục root của project
2. Chọn tab "Run and Debug" (Ctrl+Shift+D)
3. Chọn một trong các cấu hình debug:

   - **🚀 Debug NestJS App**: Debug ứng dụng chính
   - **🧪 Debug Jest Tests**: Debug tất cả unit tests
   - **🧪 Debug Current Jest Test File**: Debug file test hiện tại
   - **🔬 Debug E2E Tests**: Debug E2E tests
   - **🌱 Debug Seed Script**: Debug seed data script

4. Đặt breakpoints bằng cách click vào bên trái số dòng
5. Nhấn F5 hoặc click nút "Start Debugging"

### 2. Debug với Terminal

```bash
# Debug ứng dụng chính
cd apps/backend
pnpm run start:debug

# Debug với breakpoint ngay từ đầu
pnpm run start:debug:brk

# Debug với remote debugging (cho Docker)
pnpm run start:debug:inspect
```

### 3. Debug Tests

```bash
# Debug tất cả tests
pnpm run test:debug

# Debug E2E tests
pnpm run test:e2e --watch
```

## 🔍 Debug Utilities

### Sử dụng DebugUtil

```typescript
import { DebugUtil } from '@/common/utils/debug.util';

// Log debug info
DebugUtil.log('UserService', { userId: '123', action: 'create' });

// Log API calls
DebugUtil.logApiCall('POST', '/api/users', { name: 'John' }, { id: '123' });

// Log database queries
DebugUtil.logQuery('SELECT * FROM users WHERE id = $1', ['123'], userResult);

// Log errors
DebugUtil.logError('UserService.create', error, { userId: '123' });

// Performance timing
DebugUtil.timeStart('user-creation');
// ... your code ...
DebugUtil.timeEnd('user-creation');
```

### Custom Logger

```typescript
import { Logger } from '@nestjs/common';

export class MyService {
  private readonly logger = new Logger(MyService.name);

  async someMethod() {
    this.logger.debug('Method started');
    this.logger.verbose('Detailed info');
    this.logger.warn('Something might be wrong');
    this.logger.error('Something went wrong', error.stack);
  }
}
```

## 🐛 Common Debug Scenarios

### 1. Debug API Endpoints

```typescript
@Controller('users')
export class UsersController {
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    DebugUtil.logApiCall('POST', '/users', createUserDto);

    try {
      const user = await this.usersService.create(createUserDto);
      DebugUtil.logApiCall('POST', '/users', createUserDto, user);
      return user;
    } catch (error) {
      DebugUtil.logError('UsersController.create', error, { dto: createUserDto });
      throw error;
    }
  }
}
```

### 2. Debug Database Operations

```typescript
@Injectable()
export class UsersService {
  async findOne(id: string) {
    DebugUtil.timeStart('user-findOne');

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    DebugUtil.timeEnd('user-findOne');
    DebugUtil.log('UsersService.findOne', { id, found: !!user });

    return user;
  }
}
```

### 3. Debug Authentication & Guards

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    DebugUtil.log('JwtAuthGuard', {
      method: request.method,
      url: request.url,
      headers: request.headers.authorization,
    });

    return super.canActivate(context);
  }
}
```

## 🔧 Chrome DevTools Integration

Khi chạy với `--inspect`, bạn có thể connect Chrome DevTools:

1. Mở Chrome và vào `chrome://inspect`
2. Click "Open dedicated DevTools for Node"
3. Hoặc click vào link "inspect" bên cạnh target của bạn

## 📊 Performance Debugging

### Profiling Memory Usage

```typescript
// Trong controller hoặc service
const memUsage = process.memoryUsage();
DebugUtil.log('Memory Usage', {
  rss: `${Math.round((memUsage.rss / 1024 / 1024) * 100) / 100} MB`,
  heapUsed: `${Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100} MB`,
  heapTotal: `${Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100} MB`,
});
```

### Database Query Performance

```typescript
// Enable query logging trong TypeORM config
{
  logging: process.env.ENABLE_QUERY_LOGGING === 'true',
  logger: 'advanced-console',
  loggerLevel: 'debug'
}
```

## 🧪 Testing Debug

### Unit Test Debug

```typescript
// Trong test file
describe('UserService', () => {
  beforeEach(() => {
    // Setup debug logging for tests
    if (process.env.NODE_ENV === 'test') {
      console.log('=== Test Setup ===');
    }
  });

  it('should create user', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    DebugUtil.log('Test.createUser', userData);

    const user = await service.create(userData);

    DebugUtil.log('Test.createUser.result', user);
    expect(user).toBeDefined();
  });
});
```

## 🔍 Troubleshooting

### Common Issues

1. **Breakpoints không hoạt động**: Kiểm tra source maps và đường dẫn
2. **Debug quá chậm**: Disable logging không cần thiết trong development
3. **Memory leaks**: Sử dụng Chrome DevTools Memory tab để profile

### Debug Tips

- Sử dụng `console.table()` để hiển thị data dạng bảng
- Sử dụng `console.group()` để group related logs
- Sử dụng conditional breakpoints trong VS Code
- Leverage TypeScript strict mode để catch bugs sớm

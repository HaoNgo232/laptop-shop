# Hướng dẫn chạy ứng dụng với Docker

## Yêu cầu hệ thống

- Docker Desktop (hoặc Docker + Docker Compose)
- Ít nhất 4GB RAM khả dụng
- Ít nhất 5GB dung lượng đĩa trống

## Các bước chạy ứng dụng

### 1. Clone project (nếu chưa có)

```bash
git clone <repository-url>
cd Web-Ecom
```

### 2. Tạo file .env cho backend

```bash
cp backend/.env.example backend/.env
```

### 3. Chạy toàn bộ ứng dụng

```bash
# Build và chạy tất cả services
docker-compose up --build

# Hoặc chạy ở background
docker-compose up --build -d
```

### 4. Truy cập ứng dụng

- **Frontend (React)**: http://localhost
- **Backend API (NestJS)**: http://localhost:3000
- **Database (PostgreSQL)**: localhost:5432

### 5. Dừng ứng dụng

```bash
# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes (xóa data)
docker-compose down -v
```

## Các lệnh hữu ích

### Xem logs

```bash
# Xem logs tất cả services
docker-compose logs

# Xem logs một service cụ thể
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Chạy lệnh trong container

```bash
# Vào backend container
docker-compose exec backend sh

# Chạy migration (nếu cần)
docker-compose exec backend pnpm run migration:run

# Seed data
docker-compose exec backend pnpm run seed
```

### Rebuild một service cụ thể

```bash
# Rebuild backend
docker-compose up --build backend

# Rebuild frontend
docker-compose up --build frontend
```

## Troubleshooting

### 1. Port đã được sử dụng

Nếu gặp lỗi port đã được sử dụng, thay đổi port trong `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80" # Thay đổi từ 80 sang 8080
  backend:
    ports:
      - "3001:3000" # Thay đổi từ 3000 sang 3001
```

### 2. Backend không kết nối được database

- Đợi một lúc để PostgreSQL khởi động hoàn toàn
- Kiểm tra logs: `docker-compose logs postgres`

### 3. Frontend không gọi được API

- Kiểm tra URL API trong frontend code
- Đảm bảo backend đang chạy: `docker-compose logs backend`

### 4. Xóa toàn bộ và bắt đầu lại

```bash
# Dừng và xóa tất cả
docker-compose down -v
docker system prune -a

# Chạy lại từ đầu
docker-compose up --build
```

## Cấu trúc sau khi setup

```
Web-Ecom/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── nginx.conf
├── init-db/
│   └── 01-init.sh
├── docker-compose.yml
└── README-Docker.md
```

## Lưu ý quan trọng

1. **Security**: Đây là setup cho demo/development. Trong production cần:

   - Thay đổi JWT secret
   - Sử dụng password mạnh cho database
   - Cấu hình HTTPS
   - Sử dụng environment variables thay vì hardcode

2. **Performance**: Có thể tăng tốc build bằng cách:

   - Sử dụng multi-stage builds
   - Cache Docker layers
   - Sử dụng .dockerignore hiệu quả

3. **Data**: Data PostgreSQL được lưu trong Docker volume `postgres_data`, sẽ tồn tại ngay cả khi container bị xóa.

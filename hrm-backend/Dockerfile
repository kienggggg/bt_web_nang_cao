# 1. Chọn môi trường build
FROM node:18-alpine AS builder

# 2. Đặt thư mục làm việc
WORKDIR /app

# 3. Copy file package.json và package-lock.json
COPY package.json package-lock.json ./

# 4. Cài đặt các thư viện (Dùng npm ci cho an toàn)
RUN npm ci

# 5. Copy toàn bộ code còn lại
COPY . .

# 6. Chọn môi trường chạy (production)
FROM node:18-alpine

WORKDIR /app

# 7. Copy các file đã build từ môi trường builder
COPY --from=builder /app .

# 8. Mở cổng (port) mà server sẽ lắng nghe
# (Mặc dù Railway sẽ tự động ghi đè, đây là thông lệ tốt)
EXPOSE 3001 

# 9. Lệnh để chạy ứng dụng (Railway sẽ dùng cái này)
CMD ["npm", "start"]
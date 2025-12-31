# ClipSync 详细安装指南

本文档提供 ClipSync 剪切板同步应用的完整安装步骤。

## 目录
- [环境要求](#环境要求)
- [方法一：本地开发安装](#方法一本地开发安装)
- [方法二：Docker 快速安装](#方法二docker-快速安装)
- [配置说明](#配置说明)
- [启动应用](#启动应用)
- [验证安装](#验证安装)
- [常见问题](#常见问题)

---

## 环境要求

### 必需软件

| 软件 | 版本要求 | 下载地址 |
|------|---------|---------|
| Node.js | >= 18.0.0 | https://nodejs.org/ |
| MongoDB | >= 6.0 | https://www.mongodb.com/download-center/community |
| npm | >= 9.0.0 | 随 Node.js 安装 |
| Git | 最新版本 | https://git-scm.com/ |

### 可选软件

- **Docker Desktop** (推荐用于快速部署): https://www.docker.com/products/docker-desktop
- **Yarn** (可替代 npm): https://yarnpkg.com/

### 系统要求

- **操作系统**: Windows 10+, macOS 10.15+, Linux
- **内存**: 最低 4GB RAM
- **磁盘空间**: 最低 2GB 可用空间

---

## 方法一：本地开发安装

### 步骤 1: 检查环境

打开终端，检查已安装的软件版本：

```bash
# 检查 Node.js 版本
node --version
# 应该显示 v18.x.x 或更高

# 检查 npm 版本
npm --version
# 应该显示 9.x.x 或更高

# 检查 MongoDB 是否安装
mongod --version
# 或者使用 Docker
docker --version
```

### 步骤 2: 克隆项目

```bash
# 克隆仓库
git clone https://github.com/weiruankeji2025/weiruan-Shear-board.git

# 进入项目目录
cd weiruan-Shear-board

# 查看项目结构
ls -la
```

### 步骤 3: 安装后端依赖

```bash
# 进入后端目录
cd server

# 安装依赖（约需 2-3 分钟）
npm install

# 如果遇到权限问题，使用：
# sudo npm install (macOS/Linux)
# 或以管理员身份运行 (Windows)

# 验证安装
ls node_modules
```

**可能的错误及解决方案：**

❌ **错误**: `EACCES: permission denied`
✅ **解决**:
```bash
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER .
npm install
```

❌ **错误**: `gyp ERR! stack Error: Python executable "python" is not found`
✅ **解决**: 安装 Python 2.7 或 3.x
```bash
# macOS
brew install python3

# Ubuntu
sudo apt-get install python3

# Windows: 从 python.org 下载安装
```

### 步骤 4: 安装前端依赖

```bash
# 返回项目根目录
cd ..

# 进入前端目录
cd client

# 安装依赖（约需 3-5 分钟）
npm install

# 验证安装
ls node_modules
```

### 步骤 5: 配置环境变量

#### 后端配置

```bash
# 进入后端目录
cd ../server

# 复制环境变量模板
cp .env.example .env

# 使用文本编辑器打开 .env 文件
# Windows: notepad .env
# macOS: nano .env
# Linux: vim .env 或 nano .env
```

**编辑 `.env` 文件，配置以下必填项：**

```bash
# 基础配置
PORT=5000
NODE_ENV=development

# MongoDB 配置
MONGODB_URI=mongodb://localhost:27017/clipboard-sync

# JWT 密钥（务必修改为复杂字符串）
JWT_SECRET=your-super-secret-jwt-key-change-this-IMPORTANT

# 前端地址
FRONTEND_URL=http://localhost:5173
```

**可选：OAuth 配置**（稍后可配置）

```bash
# Google OAuth（可选）
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Microsoft OAuth（可选）
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_CALLBACK_URL=http://localhost:5000/api/auth/microsoft/callback
```

#### 前端配置

```bash
# 进入前端目录
cd ../client

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
# nano .env
```

**编辑 `.env` 文件：**

```bash
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 步骤 6: 启动 MongoDB

**选项 A: 使用 Docker（推荐）**

```bash
# 启动 MongoDB 容器
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest

# 验证运行状态
docker ps | grep mongodb

# 查看日志
docker logs mongodb
```

**选项 B: 使用本地 MongoDB**

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
sudo systemctl enable mongod

# Windows
# 从开始菜单启动 MongoDB 服务
# 或使用命令：net start MongoDB
```

**验证 MongoDB 运行：**

```bash
# 使用 mongosh 连接
mongosh

# 或使用旧版 mongo 命令
mongo

# 应该显示 MongoDB shell 连接成功
# 输入 exit 退出
```

### 步骤 7: 启动后端服务

```bash
# 进入后端目录
cd server

# 开发模式启动（带热重载）
npm run dev

# 成功启动会显示：
# ╔════════════════════════════════════════╗
# ║  Clipboard Sync Server                 ║
# ║  Port: 5000                            ║
# ║  Environment: development              ║
# ╚════════════════════════════════════════╝
# ✓ MongoDB connected successfully
```

**不要关闭此终端窗口！**

### 步骤 8: 启动前端服务

**打开新的终端窗口**

```bash
# 进入前端目录
cd weiruan-Shear-board/client

# 启动开发服务器
npm run dev

# 成功启动会显示：
#   VITE v5.x.x  ready in xxx ms
#
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: use --host to expose
#   ➜  press h to show help
```

### 步骤 9: 访问应用

1. 打开浏览器
2. 访问: **http://localhost:5173**
3. 你应该看到登录页面

**首次使用：**

1. 点击"立即注册"
2. 填写邮箱、姓名、密码
3. 点击"注册"按钮
4. 注册成功后自动登录

---

## 方法二：Docker 快速安装

### 步骤 1: 安装 Docker

- **Windows/macOS**: 下载并安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl start docker
sudo systemctl enable docker
```

### 步骤 2: 克隆项目

```bash
git clone https://github.com/weiruankeji2025/weiruan-Shear-board.git
cd weiruan-Shear-board
```

### 步骤 3: 配置环境变量

```bash
# 创建 .env 文件用于 Docker Compose
cat > .env << EOF
JWT_SECRET=$(openssl rand -base64 32)
EOF
```

### 步骤 4: 启动所有服务

```bash
# 构建并启动所有容器
docker-compose up -d

# 查看启动日志
docker-compose logs -f

# 等待所有服务启动（约 1-2 分钟）
```

### 步骤 5: 验证容器运行

```bash
# 查看运行中的容器
docker-compose ps

# 应该看到 3 个运行中的服务：
# - mongodb
# - server
# - client
```

### 步骤 6: 访问应用

打开浏览器访问: **http://localhost:5173**

### 停止服务

```bash
# 停止所有容器
docker-compose down

# 停止并删除数据卷（慎用！）
docker-compose down -v
```

---

## 配置说明

### OAuth 配置（可选）

#### 获取 Google OAuth 凭据

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 凭据：
   - 应用类型：Web 应用
   - 授权重定向 URI: `http://localhost:5000/api/auth/google/callback`
5. 复制 Client ID 和 Client Secret
6. 添加到 `server/.env` 文件：

```bash
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

#### 获取 Microsoft OAuth 凭据

1. 访问 [Azure Portal](https://portal.azure.com/)
2. 进入"Azure Active Directory" > "应用注册"
3. 点击"新注册"
4. 配置：
   - 名称：ClipSync
   - 支持的账户类型：任何组织目录中的账户
   - 重定向 URI: `http://localhost:5000/api/auth/microsoft/callback`
5. 创建客户端密码
6. 添加到 `server/.env` 文件：

```bash
MICROSOFT_CLIENT_ID=your-client-id-here
MICROSOFT_CLIENT_SECRET=your-client-secret-here
```

### 数据库配置

#### 修改 MongoDB 连接

如果使用远程 MongoDB 或自定义配置：

```bash
# 远程 MongoDB
MONGODB_URI=mongodb://username:password@host:port/database

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clipboard-sync

# 本地 MongoDB（默认）
MONGODB_URI=mongodb://localhost:27017/clipboard-sync
```

---

## 启动应用

### 开发模式

**后端：**
```bash
cd server
npm run dev
```

**前端：**
```bash
cd client
npm run dev
```

### 生产模式

```bash
# 构建前端
cd client
npm run build

# 构建后端
cd ../server
npm run build

# 启动生产服务器
npm start
```

---

## 验证安装

### 1. 健康检查

访问后端健康检查端点：

```bash
curl http://localhost:5000/health

# 应该返回：
# {"status":"ok","timestamp":"2024-xx-xxTxx:xx:xx.xxxZ"}
```

### 2. 测试注册功能

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "name": "Test User"
  }'
```

### 3. 检查数据库连接

```bash
# 使用 mongosh 连接数据库
mongosh mongodb://localhost:27017/clipboard-sync

# 查看集合
show collections

# 查看用户数据
db.users.find()
```

### 4. 测试 WebSocket 连接

在浏览器控制台运行：

```javascript
// 应该显示 "Socket connected"
```

---

## 常见问题

### Q1: 端口被占用

**错误**: `Error: listen EADDRINUSE: address already in use :::5000`

**解决**:

```bash
# 查找占用端口的进程
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# 或者修改端口
# 编辑 server/.env
PORT=5001
```

### Q2: MongoDB 连接失败

**错误**: `MongoServerError: Authentication failed`

**解决**:

1. 检查 MongoDB 是否运行：
```bash
# Docker
docker ps | grep mongodb

# 本地
sudo systemctl status mongod  # Linux
brew services list  # macOS
```

2. 验证连接字符串：
```bash
# 测试连接
mongosh "mongodb://localhost:27017/clipboard-sync"
```

3. 重启 MongoDB：
```bash
# Docker
docker restart mongodb

# 本地
sudo systemctl restart mongod  # Linux
brew services restart mongodb-community  # macOS
```

### Q3: npm install 失败

**错误**: `npm ERR! code ENETUNREACH`

**解决**:

```bash
# 清除 npm 缓存
npm cache clean --force

# 使用国内镜像源
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

### Q4: TypeScript 编译错误

**错误**: `error TS2307: Cannot find module`

**解决**:

```bash
# 删除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 清除 TypeScript 缓存
rm -rf dist
npm run build
```

### Q5: CORS 错误

**错误**: `Access to XMLHttpRequest has been blocked by CORS policy`

**解决**:

检查 `server/.env` 中的 `FRONTEND_URL` 配置：

```bash
FRONTEND_URL=http://localhost:5173
```

确保后端代码中 CORS 配置正确（已在代码中配置）。

### Q6: 剪切板监听不工作

**原因**: 浏览器安全策略限制

**解决**:

1. 确保使用 HTTPS（生产环境）或 localhost（开发环境）
2. 在浏览器中允许剪切板访问权限
3. 确保页面处于焦点状态

### Q7: WebSocket 连接失败

**错误**: `WebSocket connection failed`

**解决**:

1. 检查后端是否运行
2. 验证 Socket.io 配置：
```bash
# 查看 client/.env
VITE_SOCKET_URL=http://localhost:5000
```

3. 检查防火墙设置

---

## 性能优化建议

### 1. 生产环境配置

```bash
# server/.env
NODE_ENV=production
MONGODB_URI=mongodb://prod-host:27017/clipboard-sync

# 启用压缩
# 已在代码中配置
```

### 2. MongoDB 索引

```bash
# 连接到 MongoDB
mongosh

# 创建索引
use clipboard-sync
db.clipboarditems.createIndex({ userId: 1, createdAt: -1 })
db.clipboarditems.createIndex({ userId: 1, usageCount: -1 })
```

### 3. Nginx 反向代理（生产环境）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }

    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 下一步

安装完成后，你可以：

1. ✅ 创建账号并登录
2. ✅ 复制一些文本，测试自动同步
3. ✅ 在其他设备上登录，验证多端同步
4. ✅ 配置 OAuth 登录（可选）
5. ✅ 配置云盘备份（可选）

---

## 获取帮助

如果遇到问题：

1. 查看日志文件
2. 检查 [常见问题](#常见问题) 部分
3. 提交 Issue: https://github.com/weiruankeji2025/weiruan-Shear-board/issues

---

**祝你使用愉快！** 🎉

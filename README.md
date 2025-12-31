# ClipSync - 多端剪切板同步工具

一个功能强大的网络剪切板同步应用，支持多设备实时同步、云端备份和智能管理。

## 核心功能

- **自动剪切板监听** - 自动捕获系统复制内容
- **多端实时同步** - WebSocket 实现跨设备即时同步
- **多种登录方式** - 支持邮箱、Google、Microsoft OAuth 登录
- **高频使用统计** - 智能排序常用内容，提升效率
- **云盘备份** - 支持 Google Drive、OneDrive、Dropbox 自动备份
- **智能搜索** - 快速查找历史剪切板内容
- **固定常用项** - Pin 功能保持重要内容置顶

## 技术栈

### 后端
- **Node.js + Express** - RESTful API 服务
- **TypeScript** - 类型安全
- **MongoDB + Mongoose** - 数据持久化
- **Socket.io** - 实时通信
- **JWT + Passport.js** - 认证授权
- **Bcrypt** - 密码加密

### 前端
- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Zustand** - 状态管理
- **Socket.io-client** - 实时通信
- **React Router** - 路由管理
- **Axios** - HTTP 客户端

## 项目结构

```
weiruan-Shear-board/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── api/           # API 客户端
│   │   ├── components/    # React 组件
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── pages/         # 页面组件
│   │   ├── store/         # Zustand 状态管理
│   │   └── utils/         # 工具函数
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # 后端服务
│   ├── src/
│   │   ├── config/        # 配置文件
│   │   ├── controllers/   # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由
│   │   ├── services/      # 业务逻辑
│   │   ├── middleware/    # 中间件
│   │   └── utils/         # 工具函数
│   ├── package.json
│   └── tsconfig.json
│
└── shared/                 # 共享类型定义
    └── types.ts
```

## 快速开始

### 🚀 VPS 一键安装（推荐）

适用于 Linux VPS 服务器快速部署：

```bash
# 1. 克隆项目
git clone https://github.com/weiruankeji2025/weiruan-Shear-board.git
cd weiruan-Shear-board

# 2. 运行一键安装脚本
chmod +x vps-install.sh
./vps-install.sh

# 3. 按照提示配置 MongoDB（推荐使用免费的 MongoDB Atlas）

# 4. 安装完成后启动
./start-server.sh  # 终端1：启动后端
./start-client.sh  # 终端2：启动前端

# 或后台运行
./start-all-background.sh
```

**特点：**
- ✅ 全自动安装依赖
- ✅ 交互式配置向导
- ✅ 自动生成安全密钥
- ✅ 创建启动和停止脚本
- ✅ 支持 MongoDB Atlas 云数据库（免费）

---

### 💻 本地开发安装

#### Windows 用户

```bash
# 1. 克隆项目
git clone https://github.com/weiruankeji2025/weiruan-Shear-board.git
cd weiruan-Shear-board

# 2. 一键安装
install.bat

# 3. 启动
start.bat
```

#### macOS/Linux 用户

```bash
# 1. 克隆项目
git clone https://github.com/weiruankeji2025/weiruan-Shear-board.git
cd weiruan-Shear-board

# 2. 一键安装
chmod +x install.sh
./install.sh

# 3. 启动
./start.sh
```

---

### 📦 Docker 部署（最简单）

```bash
# 1. 克隆项目
git clone https://github.com/weiruankeji2025/weiruan-Shear-board.git
cd weiruan-Shear-board

# 2. 配置环境变量（生成 JWT 密钥）
echo "JWT_SECRET=$(openssl rand -base64 32)" > .env

# 3. 一键启动（包含数据库、后端、前端）
docker-compose up -d

# 4. 访问应用
# http://localhost:5173
```

**查看日志：**
```bash
docker-compose logs -f
```

**停止服务：**
```bash
docker-compose down
```

---

### 🛠️ 手动安装

<details>
<summary>点击展开手动安装步骤</summary>

#### 前置要求

- Node.js >= 18
- MongoDB >= 6.0（或使用 MongoDB Atlas）
- npm 或 yarn

#### 步骤

1. **克隆项目**
```bash
git clone https://github.com/weiruankeji2025/weiruan-Shear-board.git
cd weiruan-Shear-board
```

2. **安装依赖**

后端：
```bash
cd server
npm install
```

前端：
```bash
cd client
npm install
```

3. **配置环境变量**

后端 (.env):
```bash
cd server
cp .env.example .env
# 编辑 .env 文件，配置数据库连接和 OAuth 密钥
```

前端 (.env):
```bash
cd client
cp .env.example .env
# 配置 API 地址
```

4. **启动 MongoDB**
```bash
# 使用 Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 或使用本地安装的 MongoDB
mongod --dbpath /path/to/data

# 或使用 MongoDB Atlas（推荐）
# 访问 https://www.mongodb.com/cloud/atlas/register
# 创建免费集群并获取连接字符串
```

5. **启动应用**

后端：
```bash
cd server
npm run dev
```

前端：
```bash
cd client
npm run dev
```

6. **访问应用**

打开浏览器访问: http://localhost:5173

</details>

---

## MongoDB 配置

### 方式一：MongoDB Atlas（推荐，免费）

1. 注册账号：https://www.mongodb.com/cloud/atlas/register
2. 创建免费 M0 集群（512MB，永久免费）
3. 创建数据库用户
4. 添加 IP 白名单（选择 "Allow Access from Anywhere"）
5. 获取连接字符串
6. 在 `server/.env` 中配置：
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/clipboard-sync
   ```

### 方式二：本地 MongoDB

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# 从 https://www.mongodb.com/download-center/community 下载安装
```

---

## 配置说明

### OAuth 配置（可选）

#### Google OAuth
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建项目并启用 Google+ API
3. 创建 OAuth 2.0 凭据
4. 配置回调 URL: `http://localhost:5000/api/auth/google/callback`
5. 将 Client ID 和 Secret 添加到 `server/.env`

#### Microsoft OAuth
1. 访问 [Azure Portal](https://portal.azure.com/)
2. 注册应用并配置认证
3. 配置回调 URL: `http://localhost:5000/api/auth/microsoft/callback`
4. 将 Client ID 和 Secret 添加到 `server/.env`

### 云盘备份配置（可选）

在应用设置中配置云盘 API 凭据，支持：
- Google Drive
- Microsoft OneDrive
- Dropbox

---

## API 文档

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息
- `PUT /api/auth/profile` - 更新用户信息

### 剪切板接口

- `GET /api/clipboard` - 获取剪切板列表
- `POST /api/clipboard` - 创建剪切板项
- `PUT /api/clipboard/:id` - 更新剪切板项
- `DELETE /api/clipboard/:id` - 删除剪切板项
- `GET /api/clipboard/most-used` - 获取高频使用项
- `GET /api/clipboard/stats` - 获取统计数据
- `GET /api/clipboard/search` - 搜索剪切板

### 备份接口

- `GET /api/backup` - 获取备份配置
- `POST /api/backup` - 创建备份配置
- `PUT /api/backup/:id` - 更新备份配置
- `POST /api/backup/:id/trigger` - 触发手动备份

---

## 生产部署

### 使用 Docker Compose（推荐）

```bash
# 1. 配置生产环境变量
cp .env.example .env
# 编辑 .env，设置强密码和生产配置

# 2. 启动服务
docker-compose up -d

# 3. 配置反向代理（Nginx/Caddy）
# 4. 配置 SSL 证书
```

### 手动部署

1. **构建前端**
```bash
cd client
npm run build
```

2. **构建后端**
```bash
cd server
npm run build
```

3. **配置生产环境变量**

4. **使用 PM2 管理进程**
```bash
npm install -g pm2

cd server
pm2 start npm --name "clipsync-server" -- start

cd ../client
pm2 start npm --name "clipsync-client" -- run preview
```

5. **配置 Nginx 反向代理**

---

## 常用命令

### 后台运行

```bash
# 启动所有服务（后台）
./start-all-background.sh

# 停止所有服务
./stop-all.sh

# 查看日志
tail -f logs/server.log
tail -f logs/client.log
```

### 健康检查

```bash
# 检查后端健康
curl http://localhost:5000/health

# 应返回
{"status":"ok","timestamp":"..."}
```

---

## 文档资源

| 文档 | 说明 |
|------|------|
| [快速开始.md](快速开始.md) | 最简化安装步骤 |
| [INSTALLATION.md](INSTALLATION.md) | 完整安装指南（13KB，包含故障排除） |
| [QUICKREF.md](QUICKREF.md) | 命令速查表 |
| [快速启动指南-VPS.md](快速启动指南-VPS.md) | VPS 专用部署指南 |
| [安装流程图.txt](安装流程图.txt) | 可视化安装流程 |

---

## 安全性

- 密码使用 Bcrypt 加密存储
- JWT Token 认证
- HTTPS 加密传输（生产环境）
- 请求频率限制
- CORS 配置
- 输入验证和清理

---

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

需要支持 Clipboard API 和 WebSocket

---

## 系统要求

### 开发环境
- Node.js >= 18
- npm >= 9
- 2GB RAM
- 2GB 磁盘空间

### 生产环境
- 1 Core CPU
- 2GB RAM
- 10GB 磁盘空间
- MongoDB Atlas（推荐）或独立 MongoDB 服务器

---

## 故障排除

### 端口被占用
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB 连接失败
```bash
# 检查 MongoDB 状态
mongosh

# 重启 MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod            # Linux
```

### npm 安装失败
```bash
# 清除缓存
npm cache clean --force

# 使用国内镜像
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

更多问题请查看 [INSTALLATION.md](INSTALLATION.md) 的常见问题部分。

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 许可证

MIT License

---

## 联系方式

- 📧 问题反馈: [提交 Issue](https://github.com/weiruankeji2025/weiruan-Shear-board/issues)
- 📖 详细文档: 查看项目根目录的文档文件
- 💬 功能建议: 欢迎提交 Pull Request

---

**现在就开始使用 ClipSync，享受多端剪切板同步的便利！** 🚀

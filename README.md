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

### 前置要求

- Node.js >= 18
- MongoDB >= 6.0
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
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

## 配置说明

### OAuth 配置

#### Google OAuth
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建项目并启用 Google+ API
3. 创建 OAuth 2.0 凭据
4. 配置回调 URL: `http://localhost:5000/api/auth/google/callback`
5. 将 Client ID 和 Secret 添加到 `.env`

#### Microsoft OAuth
1. 访问 [Azure Portal](https://portal.azure.com/)
2. 注册应用并配置认证
3. 配置回调 URL: `http://localhost:5000/api/auth/microsoft/callback`
4. 将 Client ID 和 Secret 添加到 `.env`

### 云盘备份配置

在应用设置中配置云盘 API 凭据，支持：
- Google Drive
- Microsoft OneDrive
- Dropbox

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

## 部署

### 使用 Docker

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

### 手动部署

1. 构建前端
```bash
cd client
npm run build
```

2. 构建后端
```bash
cd server
npm run build
```

3. 配置生产环境变量

4. 启动服务
```bash
cd server
npm start
```

## 安全性

- 密码使用 Bcrypt 加密存储
- JWT Token 认证
- HTTPS 加密传输（生产环境）
- 请求频率限制
- CORS 配置
- 输入验证和清理

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

需要支持 Clipboard API 和 WebSocket

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue。

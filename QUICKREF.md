# ClipSync 命令速查表

## 🚀 快速启动

| 平台 | 命令 |
|------|------|
| Windows | `install.bat` 然后 `start.bat` |
| macOS/Linux | `./install.sh` 然后 `./start.sh` |
| Docker | `docker-compose up -d` |

## 📦 安装命令

```bash
# 克隆项目
git clone https://github.com/weiruankeji2025/weiruan-Shear-board.git
cd weiruan-Shear-board

# 后端依赖
cd server && npm install

# 前端依赖
cd ../client && npm install
```

## 🔧 配置文件

```bash
# 后端环境变量
server/.env
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/clipboard-sync
  JWT_SECRET=your-secret-key
  FRONTEND_URL=http://localhost:5173

# 前端环境变量
client/.env
  VITE_API_URL=http://localhost:5000/api
  VITE_SOCKET_URL=http://localhost:5000
```

## 🏃 运行命令

| 服务 | 开发模式 | 生产模式 |
|------|----------|----------|
| 后端 | `cd server && npm run dev` | `npm run build && npm start` |
| 前端 | `cd client && npm run dev` | `npm run build` |

## 🗄️ MongoDB 命令

```bash
# Docker 方式
docker run -d --name mongodb -p 27017:27017 mongo:latest
docker start mongodb
docker stop mongodb
docker logs mongodb

# 本地方式 (macOS)
brew services start mongodb-community
brew services stop mongodb-community
brew services restart mongodb-community

# 本地方式 (Linux)
sudo systemctl start mongod
sudo systemctl stop mongod
sudo systemctl restart mongod
```

## 🐳 Docker 命令

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看运行状态
docker-compose ps
```

## 🔍 调试命令

```bash
# 检查端口占用
lsof -i :5000        # macOS/Linux
netstat -ano | findstr :5000  # Windows

# 测试 API
curl http://localhost:5000/health

# 测试注册
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test"}'

# 连接 MongoDB
mongosh mongodb://localhost:27017/clipboard-sync
```

## 📊 数据库操作

```javascript
// 进入 MongoDB shell
mongosh

// 使用数据库
use clipboard-sync

// 查看集合
show collections

// 查看用户
db.users.find().pretty()

// 查看剪切板项
db.clipboarditems.find().pretty()

// 清空数据
db.clipboarditems.deleteMany({})
db.users.deleteMany({})
```

## 🔐 常用 API

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/register` | POST | 注册 |
| `/api/auth/login` | POST | 登录 |
| `/api/auth/profile` | GET | 获取用户信息 |
| `/api/clipboard` | GET | 获取剪切板列表 |
| `/api/clipboard` | POST | 创建剪切板项 |
| `/api/clipboard/:id` | PUT | 更新剪切板项 |
| `/api/clipboard/:id` | DELETE | 删除剪切板项 |
| `/api/clipboard/most-used` | GET | 高频使用 |
| `/api/clipboard/search?query=xxx` | GET | 搜索 |
| `/api/backup` | GET | 获取备份配置 |

## 🛠️ 维护命令

```bash
# 清除缓存
npm cache clean --force

# 重装依赖
rm -rf node_modules package-lock.json
npm install

# 清除构建
rm -rf dist

# 查看日志
tail -f logs/app.log

# 检查 Node 版本
node -v

# 检查 npm 版本
npm -v
```

## 🔄 Git 命令

```bash
# 查看状态
git status

# 拉取最新代码
git pull origin main

# 切换分支
git checkout -b feature/new-feature

# 提交更改
git add .
git commit -m "feat: add new feature"
git push
```

## 🌐 访问地址

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:5173 |
| 后端 API | http://localhost:5000 |
| 健康检查 | http://localhost:5000/health |
| MongoDB | mongodb://localhost:27017 |

## ⚙️ 环境变量

```bash
# 生成 JWT 密钥
openssl rand -base64 32

# 设置 npm 镜像
npm config set registry https://registry.npmmirror.com

# 查看环境变量
printenv | grep NODE
```

## 📱 浏览器开发者工具

```javascript
// 查看 WebSocket 连接
// 在浏览器控制台

// 查看存储
localStorage.getItem('token')
localStorage.getItem('user')

// 清除存储
localStorage.clear()

// 测试剪切板 API
navigator.clipboard.readText().then(text => console.log(text))
```

## 🐛 问题排查

| 问题 | 解决方案 |
|------|----------|
| 端口占用 | `lsof -i :5000` 然后 `kill -9 <PID>` |
| MongoDB 连接失败 | `docker restart mongodb` |
| npm 安装失败 | `npm cache clean --force && npm install` |
| CORS 错误 | 检查 `FRONTEND_URL` 配置 |
| WebSocket 连接失败 | 检查 `VITE_SOCKET_URL` 配置 |

## 📚 文档链接

- [详细安装指南](INSTALLATION.md)
- [快速开始](快速开始.md)
- [API 文档](README.md#api-文档)
- [常见问题](INSTALLATION.md#常见问题)

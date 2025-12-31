# Vercel 部署配置

## 自动部署到 Vercel

### 前端部署

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署前端**
```bash
cd client
vercel --prod
```

### 配置文件

项目已包含 `vercel.json` 配置文件，会自动：
- 构建前端应用
- 配置路由
- 设置环境变量

### 环境变量配置

在 Vercel 项目设置中添加：
```
VITE_API_URL=你的后端API地址
VITE_SOCKET_URL=你的后端Socket地址
```

### 从 GitHub 自动部署

1. 访问 https://vercel.com
2. 点击 "Import Project"
3. 选择你的 GitHub 仓库
4. Root Directory 设置为 `client`
5. 添加环境变量
6. 点击 "Deploy"

每次推送到 GitHub 会自动部署！

---

## Railway 部署后端

### 后端 + 数据库部署到 Railway

1. 访问 https://railway.app
2. 使用 GitHub 登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择你的仓库
5. Railway 会自动检测到 Node.js 项目

### 环境变量

在 Railway 项目设置中添加：
```
NODE_ENV=production
PORT=5000
MONGODB_URI=你的MongoDB Atlas连接字符串
JWT_SECRET=生成的密钥
FRONTEND_URL=你的Vercel前端地址
```

### MongoDB

Railway 免费提供 MongoDB 插件：
- 点击 "New" → "Database" → "Add MongoDB"
- 自动获取连接字符串

---

## 访问你的应用

- 前端: https://your-app.vercel.app
- 后端: https://your-app.railway.app

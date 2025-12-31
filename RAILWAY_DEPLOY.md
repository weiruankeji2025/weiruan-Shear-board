# Railway 部署指南

## 一键部署到 Railway

### 方式一：使用 GitHub 集成（推荐）

1. **访问 Railway**
   - https://railway.app
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择 `weiruan-Shear-board` 仓库

3. **配置服务**

   Railway 会创建两个服务：

   **服务 1: Server（后端）**
   - Root Directory: `server`
   - Build Command: `npm run build`
   - Start Command: `npm start`

   **服务 2: MongoDB（数据库）**
   - 点击 "New" → "Database" → "Add MongoDB"
   - Railway 自动配置

4. **环境变量（Server 服务）**

   在 Server 服务的 Variables 中添加：
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=使用命令生成: openssl rand -base64 32
   FRONTEND_URL=你的Vercel前端地址
   ```

   MongoDB 连接会自动配置（使用 Railway 提供的 MONGODB_URL）

5. **修改代码连接数据库**

   在 `server/src/config/database.ts` 中：
   ```typescript
   const mongoURI = process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/clipboard-sync';
   ```

6. **部署**
   - 推送到 GitHub 会自动触发部署
   - 或点击 "Deploy" 手动部署

---

### 方式二：使用 Railway CLI

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
cd server
railway init

# 部署
railway up

# 添加 MongoDB
railway add mongodb

# 设置环境变量
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$(openssl rand -base64 32)
```

---

## 获取部署 URL

部署完成后：
- Server: `https://your-app.railway.app`
- 在 Vercel 前端环境变量中更新 API 地址

---

## 自动部署

每次推送到 GitHub main 分支，Railway 会自动：
1. 拉取最新代码
2. 安装依赖
3. 构建应用
4. 重启服务

---

## 免费额度

Railway 免费计划：
- 每月 $5 免费额度
- 足够运行小型应用
- MongoDB 包含在内

---

## 监控和日志

在 Railway 控制台可以：
- 查看实时日志
- 监控资源使用
- 查看部署历史

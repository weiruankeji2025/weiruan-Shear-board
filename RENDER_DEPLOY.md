# Render 部署指南（完全免费方案）

## 在 Render 上一键部署

Render 提供完全免费的部署方案，包括前端、后端和 PostgreSQL 数据库。

---

## 方案：全部署到 Render

### 步骤 1：创建 Render 账号

1. 访问 https://render.com
2. 使用 GitHub 账号注册/登录

---

### 步骤 2：部署后端

1. **创建 Web Service**
   - Dashboard → "New +" → "Web Service"
   - 连接 GitHub 仓库：`weiruan-Shear-board`

2. **配置后端服务**
   ```
   Name: clipsync-server
   Region: Singapore (或最近的区域)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

3. **环境变量**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=你的MongoDB Atlas连接字符串
   JWT_SECRET=生成的密钥
   FRONTEND_URL=https://你的前端地址.onrender.com
   ```

4. **生成 JWT 密钥**
   ```bash
   openssl rand -base64 32
   ```

---

### 步骤 3：部署前端

1. **创建 Static Site**
   - Dashboard → "New +" → "Static Site"
   - 连接同一个 GitHub 仓库

2. **配置前端**
   ```
   Name: clipsync-client
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **环境变量**
   ```
   VITE_API_URL=https://你的后端地址.onrender.com/api
   VITE_SOCKET_URL=https://你的后端地址.onrender.com
   ```

---

### 步骤 4：配置 MongoDB

**使用 MongoDB Atlas**（推荐，完全免费）：
1. 访问 https://www.mongodb.com/cloud/atlas/register
2. 创建免费 M0 集群
3. 获取连接字符串
4. 在 Render 后端环境变量中设置 `MONGODB_URI`

---

### 步骤 5：更新跨域配置

确保后端允许前端域名访问：

在 `server/.env` 或 Render 环境变量中：
```
FRONTEND_URL=https://clipsync-client.onrender.com
```

---

## 自动部署

配置完成后：
- 每次推送到 GitHub main 分支
- Render 自动检测更改
- 自动构建和部署

---

## 免费方案限制

Render 免费计划：
- ✅ 完全免费（无需信用卡）
- ✅ 自定义域名
- ✅ 自动 HTTPS
- ⚠️ 服务不活跃时会休眠（首次访问需 30 秒唤醒）
- ⚠️ 每月 750 小时运行时间

**避免休眠的方法**：
- 使用 UptimeRobot 等服务每 5 分钟 ping 一次
- 或升级到付费计划（$7/月）

---

## 访问地址

部署完成后：
- 前端: `https://clipsync-client.onrender.com`
- 后端: `https://clipsync-server.onrender.com`

---

## 监控和日志

在 Render Dashboard 可以：
- 实时查看部署日志
- 监控服务状态
- 查看访问统计
- 设置自动部署

---

## 性能优化

1. **启用缓存**
   - 前端自动启用 CDN 缓存

2. **健康检查**
   - Render 会自动 ping `/health` 端点

3. **环境选择**
   - 选择离用户最近的 Region

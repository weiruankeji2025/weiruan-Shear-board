# 🚀 VPS 快速启动指南

## ✅ 安装已完成

后端和前端依赖已全部安装完成！

## 📝 重要配置

### 1. MongoDB 配置（必需）

后端需要 MongoDB 数据库。有两种方式：

#### 方式 A：使用 MongoDB Atlas（推荐，免费）

1. 注册账号：https://www.mongodb.com/cloud/atlas/register
2. 创建免费 M0 集群（512MB 永久免费）
3. 获取连接字符串，例如：
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/clipboard-sync
   ```
4. 编辑配置文件：
   ```bash
   nano /home/user/weiruan-Shear-board/server/.env
   ```

5. 修改 MONGODB_URI 行：
   ```
   MONGODB_URI=你的MongoDB Atlas连接字符串
   ```

#### 方式 B：使用其他 MongoDB 服务器

如果你有 MongoDB 服务器，直接修改 `server/.env` 中的 `MONGODB_URI`

## 🚀 启动应用

### 步骤 1：启动后端（终端 1）

```bash
cd /home/user/weiruan-Shear-board/server
npm run dev
```

成功启动会显示：
```
╔════════════════════════════════════════╗
║  Clipboard Sync Server                 ║
║  Port: 5000                            ║
║  Environment: development              ║
╚════════════════════════════════════════╝
✓ MongoDB connected successfully
```

### 步骤 2：启动前端（终端 2 - 新终端）

```bash
cd /home/user/weiruan-Shear-board/client
npm run dev
```

成功启动会显示：
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 步骤 3：访问应用

- 本地访问：http://localhost:5173
- 如果需要外网访问，配置防火墙开放 5173 端口

## 🔧 快捷启动脚本（可选）

创建后台运行脚本：

```bash
# 创建启动脚本
cat > /home/user/weiruan-Shear-board/start-all.sh << 'EOF'
#!/bin/bash
cd /home/user/weiruan-Shear-board

# 启动后端
cd server
nohup npm run dev > ../logs/server.log 2>&1 &
echo $! > ../server.pid
echo "✓ 后端已启动 (PID: $(cat ../server.pid))"

sleep 3

# 启动前端
cd ../client
nohup npm run dev > ../logs/client.log 2>&1 &
echo $! > ../client.pid
echo "✓ 前端已启动 (PID: $(cat ../client.pid))"

echo ""
echo "服务已在后台运行"
echo "后端日志: tail -f logs/server.log"
echo "前端日志: tail -f logs/client.log"
EOF

chmod +x /home/user/weiruan-Shear-board/start-all.sh
mkdir -p /home/user/weiruan-Shear-board/logs

# 使用
./start-all.sh
```

停止服务：
```bash
kill $(cat /home/user/weiruan-Shear-board/server.pid)
kill $(cat /home/user/weiruan-Shear-board/client.pid)
```

## 🌐 外网访问配置

如果需要从外网访问：

### 1. 开放端口
```bash
# 使用 ufw (Ubuntu)
sudo ufw allow 5000
sudo ufw allow 5173

# 或使用 iptables
sudo iptables -A INPUT -p tcp --dport 5000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 5173 -j ACCEPT
```

### 2. 修改前端配置
```bash
# 编辑前端配置，允许外网访问
nano /home/user/weiruan-Shear-board/client/vite.config.ts
```

在 `server` 配置中添加：
```typescript
server: {
  host: '0.0.0.0',  // 添加这行
  port: 5173,
  // ...
}
```

### 3. 更新环境变量

编辑 `server/.env`，将 `localhost` 替换为你的服务器 IP：
```
FRONTEND_URL=http://你的服务器IP:5173
```

编辑 `client/.env`：
```
VITE_API_URL=http://你的服务器IP:5000/api
VITE_SOCKET_URL=http://你的服务器IP:5000
```

## ✅ 验证安装

1. **后端健康检查：**
   ```bash
   curl http://localhost:5000/health
   # 应返回: {"status":"ok","timestamp":"..."}
   ```

2. **浏览器访问：**
   打开 http://localhost:5173

3. **注册账号并测试：**
   - 点击"立即注册"
   - 填写信息并注册
   - 复制任意文本，应该出现在列表中

## 📊 查看日志

```bash
# 后端日志
cd /home/user/weiruan-Shear-board/server
# 查看终端输出

# 前端日志
cd /home/user/weiruan-Shear-board/client
# 查看终端输出
```

## 🐛 常见问题

### MongoDB 连接失败

**错误：** `MongoServerError: Authentication failed`

**解决：**
1. 检查连接字符串是否正确
2. 确保用户名密码正确
3. 检查 IP 白名单（Atlas 需要添加服务器 IP）

### 端口被占用

**错误：** `EADDRINUSE: address already in use :::5000`

**解决：**
```bash
# 查找占用进程
lsof -i :5000
# 杀死进程
kill -9 <PID>
```

### 无法外网访问

**解决：**
1. 检查防火墙设置
2. 检查云服务器安全组规则
3. 确认已修改 `vite.config.ts` 添加 `host: '0.0.0.0'`

## 📁 重要文件位置

```
/home/user/weiruan-Shear-board/
├── server/.env          # 后端配置（MongoDB连接等）
├── client/.env          # 前端配置（API地址）
├── server/package.json  # 后端依赖
└── client/package.json  # 前端依赖
```

## 🎉 开始使用

现在你可以：
1. 注册账号
2. 复制任何文本，自动同步
3. 在其他设备登录相同账号，实现多端同步
4. 使用固定、搜索等功能

---

**需要帮助？** 查看详细文档：
- 完整安装指南：INSTALLATION.md
- 命令速查表：QUICKREF.md
